import fetch from 'node-fetch';

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

  console.log('URL:', url); // Log the URL
  console.log('API Key:', apiKey); // Log the API key (be cautious with this in production)

  const webRiskUrl = `https://webrisk.googleapis.com/v1/uris:search?key=${apiKey}&threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE&uri=${encodeURIComponent(url)}`;

  try {
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
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}