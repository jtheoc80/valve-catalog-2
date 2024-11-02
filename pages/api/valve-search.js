// pages/api/valve-search.js

import axios from 'axios';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Using Google Custom Search API
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID, // Custom Search Engine ID
        q: `industrial valve ${query}`,
        searchType: 'searchTypeUndefined',
        num: 10
      }
    });

    const searchResults = response.data.items?.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      image: item.pagemap?.cse_image?.[0]?.src || null,
      source: item.displayLink
    })) || [];

    return res.status(200).json(searchResults);
  } catch (error) {
    console.error('Search API Error:', error);
    return res.status(500).json({ error: 'Failed to perform search' });
  }
}
