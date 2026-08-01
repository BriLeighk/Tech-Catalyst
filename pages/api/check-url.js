import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { GoogleAuth } from 'google-auth-library';
import { LanguageServiceClient } from '@google-cloud/language';
import vision from '@google-cloud/vision';
import videoIntelligence from '@google-cloud/video-intelligence';

const googleCredentials = {
  private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
};

const languageClient = new LanguageServiceClient({
  credentials: googleCredentials,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const visionClient = new vision.ImageAnnotatorClient({
  credentials: googleCredentials,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const videoClient = new videoIntelligence.VideoIntelligenceServiceClient({
  credentials: googleCredentials,
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

function normalizeUrl(rawUrl) {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return null;

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withProtocol);
  } catch {
    return null;
  }
}

async function checkWebRisk(uri) {
  const threatQuery =
    'threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE';
  const encodedUri = encodeURIComponent(uri);

  // Prefer service-account auth; the public API key may be suspended.
  if (googleCredentials.private_key && googleCredentials.client_email) {
    try {
      const auth = new GoogleAuth({
        credentials: googleCredentials,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const client = await auth.getClient();
      const tokenResponse = await client.getAccessToken();
      const accessToken = tokenResponse?.token;

      if (accessToken) {
        const response = await fetch(
          `https://webrisk.googleapis.com/v1/uris:search?${threatQuery}&uri=${encodedUri}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const text = await response.text();
        console.log('Web Risk API (service account) raw response:', text);

        if (response.ok) {
          return text ? JSON.parse(text) : {};
        }

        console.warn('Web Risk service-account request failed:', text);
      }
    } catch (error) {
      console.warn('Web Risk service-account auth failed:', error.message);
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_WEB_RISK_API_KEY;
  if (!apiKey) {
    console.warn('Web Risk API key missing; skipping Web Risk check');
    return null;
  }

  const response = await fetch(
    `https://webrisk.googleapis.com/v1/uris:search?key=${apiKey}&${threatQuery}&uri=${encodedUri}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const text = await response.text();
  console.log('Web Risk API (API key) raw response:', text);

  if (!response.ok) {
    console.warn('Web Risk API key request failed; continuing without it:', text);
    return null;
  }

  return text ? JSON.parse(text) : {};
}

export default async function handler(req, res) {
  console.log('API handler called');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    console.error('Missing URL');
    return res.status(400).json({ error: 'Missing URL' });
  }

  const validatedUrl = normalizeUrl(url);
  if (!validatedUrl) {
    console.error('Invalid URL:', url);
    return res.status(400).json({ error: 'Invalid URL' });
  }

  console.log('URL:', validatedUrl.href);

  try {
    const data = await checkWebRisk(validatedUrl.href);

    if (data?.threat) {
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
          const base64Content = imageUrl.split(',')[1];
          visionResult = await visionClient.safeSearchDetection({
            image: { content: base64Content },
          });
        } else {
          visionResult = await visionClient.safeSearchDetection(imageUrl);
        }

        const detections = visionResult[0].safeSearchAnnotation;

        console.log('Vision API result for image:', detections);

        if (
          detections &&
          (detections.adult === 'POSSIBLE' ||
            detections.adult === 'LIKELY' ||
            detections.adult === 'VERY_LIKELY' ||
            detections.violence === 'POSSIBLE' ||
            detections.violence === 'LIKELY' ||
            detections.violence === 'VERY_LIKELY')
        ) {
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

        console.log('Video Intelligence API result for video:', explicitContentResults);

        for (const frame of explicitContentResults.frames) {
          if (
            frame.pornographyLikelihood === 'POSSIBLE' ||
            frame.pornographyLikelihood === 'LIKELY' ||
            frame.pornographyLikelihood === 'VERY_LIKELY'
          ) {
            return res.status(200).json({ threat: true, categories: ['Explicit Content Detected in Video'] });
          }
        }
      } catch (error) {
        console.error('Error processing video URL:', videoUrl, error);
      }
    }

    // Check URL content using Google Cloud Natural Language API
    let categories = [];
    try {
      const [result] = await languageClient.classifyText({
        document: {
          content: textContent,
          type: 'PLAIN_TEXT',
        },
      });

      console.log('Natural Language API result:', result);

      const inappropriateCategories = ['Adult', 'Violence', 'Hate Speech'];
      categories = (result.categories || []).map((category) => category.name);
      const highConfidenceCategories = (result.categories || []).filter(
        (category) => category.confidence > 0.6
      );

      if (
        categories.includes('/Adult') ||
        highConfidenceCategories.some((category) => inappropriateCategories.includes(category.name))
      ) {
        return res.status(200).json({ threat: true, categories: ['Explicit Content Detected from Text'] });
      }
    } catch (error) {
      // classifyText requires enough content; skip rather than failing the upload.
      console.warn('Natural Language classification skipped:', error.message);
    }

    return res.status(200).json({ threat: false, categories, normalizedUrl: validatedUrl.href });
  } catch (error) {
    console.error('Error checking URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function scrapeWebpage(content, baseUrl) {
  const dom = new JSDOM(content);
  const document = dom.window.document;

  const textContent = document.body?.textContent || '';

  const imageUrls = Array.from(document.querySelectorAll('img'))
    .map((img) => {
      try {
        return new URL(img.src, baseUrl).href;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const videoUrls = Array.from(document.querySelectorAll('video'))
    .map((video) => {
      try {
        return video.src ? new URL(video.src, baseUrl).href : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return { textContent, imageUrls, videoUrls };
}
