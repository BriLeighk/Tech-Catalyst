import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { LanguageServiceClient } from '@google-cloud/language';
import vision from '@google-cloud/vision';
import videoIntelligence from '@google-cloud/video-intelligence'; // Import Google Video Intelligence API

const languageClient = new LanguageServiceClient({
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const visionClient = new vision.ImageAnnotatorClient({
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const videoClient = new videoIntelligence.VideoIntelligenceServiceClient({
  credentials: {
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

export default async function handler(req, res) {
  console.log('API handler called'); // Log to check if the handler is called

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  const apiKey = process.env.NEXT_PUBLIC_WEB_RISK_API_KEY;

  if (!url || !apiKey) {
    console.error('Missing URL or API key');
    return res.status(400).json({ error: 'Missing URL or API key' });
  }

  // Validate the URL
  let validatedUrl;
  try {
    validatedUrl = new URL(url);
  } catch (error) {
    console.error('Invalid URL:', error);
    return res.status(400).json({ error: 'Invalid URL' });
  }

  console.log('URL:', validatedUrl.href); // Log the validated URL

  const webRiskUrl = `https://webrisk.googleapis.com/v1/uris:search?key=${apiKey}&threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE&uri=${encodeURIComponent(validatedUrl.href)}`;

  try {
    // Check URL safety using Google Safe Browsing API
    const response = await fetch(webRiskUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const text = await response.text();
    console.log('Web Risk API raw response:', text); // Log the raw response for debugging

    if (!response.ok) {
      console.error('Web Risk API error:', text);
      return res.status(response.status).json({ error: text });
    }

    const data = text ? JSON.parse(text) : {};

    if (data && data.threat) {
      return res.status(200).json({ threat: true, threatTypes: data.threat.threatTypes });
    }

    // Fetch the content of the URL
    const pageContentResponse = await fetch(validatedUrl.href);
    const pageContent = await pageContentResponse.text();

    // Scrape the webpage to extract all text, image, and video URLs
    const { textContent, imageUrls, videoUrls } = scrapeWebpage(pageContent, validatedUrl.href);

    // Check URL content using Google Vision API for explicit content in images
    for (const imageUrl of imageUrls) {
      try {
        let visionResult;
        if (imageUrl.startsWith('data:image')) {
          // Handle data URLs
          const base64Content = imageUrl.split(',')[1];
          visionResult = await visionClient.safeSearchDetection({
            image: { content: base64Content },
          });
        } else {
          // Handle regular URLs
          visionResult = await visionClient.safeSearchDetection(imageUrl);
        }

        const detections = visionResult[0].safeSearchAnnotation;

        console.log('Vision API result for image:', detections); // Log the result for debugging

        if (detections && (detections.adult === 'POSSIBLE' || detections.adult === 'LIKELY' || detections.adult === 'VERY_LIKELY' ||
            detections.violence === 'POSSIBLE' || detections.violence === 'LIKELY' || detections.violence === 'VERY_LIKELY')) {
          return res.status(200).json({ threat: true, categories: ['Explicit Content Detected in Image'] });
        }
      } catch (error) {
        console.error('Error processing image URL:', imageUrl, error);
      }
    }

    // Check URL content using Google Video Intelligence API for explicit content in videos
    for (const videoUrl of videoUrls) {
      try {
        const [operation] = await videoClient.annotateVideo({
          inputUri: videoUrl,
          features: ['EXPLICIT_CONTENT_DETECTION'],
        });

        const [videoResult] = await operation.promise();
        const explicitContentResults = videoResult.annotationResults[0].explicitAnnotation;

        console.log('Video Intelligence API result for video:', explicitContentResults); // Log the result for debugging

        for (const frame of explicitContentResults.frames) {
          if (frame.pornographyLikelihood === 'POSSIBLE' || frame.pornographyLikelihood === 'LIKELY' || frame.pornographyLikelihood === 'VERY_LIKELY') {
            return res.status(200).json({ threat: true, categories: ['Explicit Content Detected in Video'] });
          }
        }
      } catch (error) {
        console.error('Error processing video URL:', videoUrl, error);
      }
    }

    // Check URL content using Google Cloud Natural Language API
    const [result] = await languageClient.classifyText({
      document: {
        content: textContent,
        type: 'PLAIN_TEXT',
      },
    });

    console.log('Natural Language API result:', result); // Log the result for debugging

    const inappropriateCategories = ['Adult', 'Violence', 'Hate Speech'];
    const categories = result.categories.map(category => category.name);
    const highConfidenceCategories = result.categories.filter(category => category.confidence > 0.60);

    // Check if any inappropriate categories are detected
    if (categories.includes('/Adult') || highConfidenceCategories.some(category => inappropriateCategories.includes(category.name))) {
      return res.status(200).json({ threat: true, categories: ['Explicit Content Detected from Text'] });
    }

    return res.status(200).json({ threat: false, categories });
  } catch (error) {
    console.error('Error checking URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to scrape the webpage
function scrapeWebpage(content, baseUrl) {
  const dom = new JSDOM(content);
  const document = dom.window.document;

  // Extract all text content
  const textContent = document.body.textContent || '';

  // Extract all image URLs and convert to absolute URLs
  const imageUrls = Array.from(document.querySelectorAll('img')).map(img => new URL(img.src, baseUrl).href);

  // Extract all video URLs and convert to absolute URLs
  const videoUrls = Array.from(document.querySelectorAll('video')).map(video => new URL(video.src, baseUrl).href);

  return { textContent, imageUrls, videoUrls };
}