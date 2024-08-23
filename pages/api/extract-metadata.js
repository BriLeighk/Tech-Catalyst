import axios from 'axios';
import simpleIcons from 'simple-icons'; // Import Simple Icons
import urlMetadata from 'url-metadata'; // Import url-metadata

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const metadata = await urlMetadata(url);

    let title = metadata.title || '';
    let h1 = metadata['og:title'] || '';

    // If title or h1 is empty, parse the URL
    if (!title && !h1) {
      const domain = new URL(url).hostname;
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

    res.status(200).json({ title, h1 });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}

// Helper function to capitalize the first letter of each word
function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}