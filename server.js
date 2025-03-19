// Import potřebných knihoven
const express = require('express');           // Webový framework
const axios = require('axios');               // HTTP klient pro volání API
const cheerio = require('cheerio');           // Parser HTML
const cors = require('cors');                 // Povolení cross-origin požadavků
const path = require('path');                 // Práce s cestami k souborům
const fs = require('fs');                     // Práce se soubory

// Inicializace Express aplikace
const app = express();
const PORT = process.env.PORT || 3000;        // Port pro server (z proměnné prostředí nebo 3000)

// Nastavení middleware
app.use(express.json());                      // Parsování JSON dat v requestech
app.use(express.static(path.join(__dirname, 'public'))); // Statické soubory z adresáře 'public'
app.use(cors());                              // Povolení CORS

// Definice endpointů
// Hlavní stránka - vrátí HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint pro vyhledávání
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;                // Získání dotazu z URL parametru
    
    // Kontrola, zda byl dotaz zadán
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Volání funkce pro scraping Googlu a vrácení výsledků
    const results = await scrapeGoogleResults(query);
    return res.json(results);
  } catch (error) {
    console.error('Error during search:', error.message);
    return res.status(500).json({ error: 'Failed to fetch search results' });
  }
});

// Funkce pro scraping výsledků z Google
async function scrapeGoogleResults(query) {
  try {
    // Nastavení hlaviček pro napodobení prohlížeče (proti blokování)
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.google.com/'
    };

    // Sestavení URL pro vyhledávání na Google
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
    
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
        const descriptionElement = $(element).find('.VwiC3b').first();
        
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

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});

// Export pro testování
module.exports = { app, scrapeGoogleResults };