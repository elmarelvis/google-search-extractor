// api/search.js - Serverless funkce pro Vercel
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Povolení CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const query = req.query.q;
    
    // Kontrola, zda byl dotaz zadán
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Použijeme alternativní API pro získání výsledků
    // Místo scrapování Googlu použijeme veřejné vyhledávací API
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_KEY}`;
    
    const response = await axios.get(searchUrl);
    const data = response.data;
    
    // Transformace výsledků do očekávaného formátu
    const results = {
      query,
      count: data.organic_results ? data.organic_results.length : 0,
      results: []
    };
    
    // Extrakce relevantních dat
    if (data.organic_results) {
      results.results = data.organic_results.map(item => ({
        title: item.title || '',
        url: item.link || '',
        description: item.snippet || ''
      }));
    }
    
    return res.json(results);
  } catch (error) {
    console.error('Error during search:', error.message);
    return res.status(500).json({ error: 'Failed to fetch search results' });
  }
}