// api/search.js - Serverless funkce pro Vercel
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  // Nastavení CORS hlaviček
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Zpracování OPTIONS požadavku pro CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Získání dotazu z URL parametru
    const query = req.query.q;
    
    // Kontrola, zda byl dotaz zadán
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    console.log(`Vyhledávání dotazu: ${query}`);
    
    // Scraping výsledků z Google
    const results = await scrapeGoogleResults(query);
    
    // Odpověď s výsledky
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error during search:', error.message);
    return res.status(500).json({ error: 'Failed to fetch search results' });
  }
};

// Funkce pro scraping výsledků z Google
async function scrapeGoogleResults(query) {
  try {
    // Nastavení hlaviček pro napodobení prohlížeče (proti blokování)
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'cs-CZ,cs;q=0.9,en-US;q=0.8,en;q=0.7',
      'Referer': 'https://www.google.com/'
    };

    // Sestavení URL pro vyhledávání na Google
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=cs`;
    
    console.log(`Volání Google URL: ${searchUrl}`);
    
    // Provedení HTTP požadavku na Google
    const response = await axios.get(searchUrl, { headers });
    
    // Načtení HTML do cheerio pro snadnější manipulaci
    const $ = cheerio.load(response.data);
    
    // Pole pro uložení výsledků
    const results = [];
    
    // Procházení všech výsledků vyhledávání (prvky s třídou 'g')
    $('.g').each((i, element) => {
      // Ignorování reklam - kontrola, zda není uvnitř reklamního bloku
      if (!$(element).closest('[data-sokoban-feature="adslot"]').length) {
        // Extrakce dat z každého výsledku
        const titleElement = $(element).find('h3').first();
        const linkElement = $(element).find('a').first();
        const descriptionElement = $(element).find('.VwiC3b, .IsZvec').first();
        
        // Získání textu a URL
        const title = titleElement.text().trim();
        const link = linkElement.attr('href');
        let url = '';
        
        // Zpracování URL (Google používá přesměrování)
        if (link && link.startsWith('/url?')) {
          const urlParams = new URL('https://google.com' + link);
          url = urlParams.searchParams.get('q') || '';
        } else {
          url = link || '';
        }
        
        // Získání popisu
        const description = descriptionElement.text().trim();
        
        // Přidání do výsledků, jen pokud má alespoň titulek nebo URL
        if (title || url) {
          results.push({
            title,
            url,
            description
          });
        }
      }
    });
    
    console.log(`Nalezeno ${results.length} výsledků pro: ${query}`);
    
    // Vrácení strukturovaných výsledků
    return {
      query,                // Původní dotaz
      count: results.length, // Počet nalezených výsledků
      results                // Seznam výsledků
    };
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape Google results');
  }
}