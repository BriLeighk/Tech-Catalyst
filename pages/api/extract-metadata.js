import axios from 'axios';
import urlMetadata from 'url-metadata';

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const metadata = await urlMetadata(url);

    let title = metadata.title || '';
    let h1 = metadata['og:title'] || '';
    let logoUrl = '';
    let isValidLogo = false;

    // Try to get the logo from Clearbit first
    const domain = new URL(url).hostname;
    const clearbitLogoUrl = `https://logo.clearbit.com/${domain}?size=256`;

    try {
      const response = await axios.head(clearbitLogoUrl);
      if (response.headers['content-type'].startsWith('image/')) {
        logoUrl = clearbitLogoUrl;
        isValidLogo = true;
      }
    } catch (error) {
      console.warn('Clearbit logo fetch failed:', error);
    }

    // If Clearbit logo is not valid, fall back to og:image
    if (!isValidLogo) {
      logoUrl = metadata['og:image'] || '';
      isValidLogo = !!logoUrl;
    }

    // If title or h1 is empty, parse the URL
    if (!title && !h1) {
      const domainName = domain.split('.')[0];
      const urlPath = new URL(url).pathname;
      let lastSegment = urlPath.substring(urlPath.lastIndexOf('/') + 1);
      if (lastSegment) {
        lastSegment = lastSegment.replace(/[-_]/g, ' ').replace(/[^\w\s]/gi, '');
        title = `${capitalizeWords(domainName)} | ${capitalizeWords(lastSegment)}`;
      } else {
        title = capitalizeWords(domainName);
      }
    }

    res.status(200).json({ title, h1, logoUrl, isValidLogo });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}

// Helper function to capitalize the first letter of each word
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}