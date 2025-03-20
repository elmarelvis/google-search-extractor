// Počkáme na načtení DOM
document.addEventListener('DOMContentLoaded', () => {
    // Reference na DOM elementy - získání všech potřebných prvků stránky
    const searchInput = document.getElementById('search-input');        // Vstupní pole pro vyhledávání
    const searchButton = document.getElementById('search-button');      // Tlačítko pro vyhledávání
    const resultsContainer = document.getElementById('results-container'); // Kontejner pro výsledky
    const resultsInfo = document.getElementById('results-info');        // Informace o výsledcích
    const resultsList = document.getElementById('results-list');        // Seznam výsledků
    const loading = document.getElementById('loading');                 // Indikátor načítání
    const errorMessage = document.getElementById('error-message');      // Prostor pro chybové zprávy
    const downloadJsonBtn = document.getElementById('download-json');   // Tlačítko pro stažení JSON
    const downloadCsvBtn = document.getElementById('download-csv');     // Tlačítko pro stažení CSV
    
    // Proměnná pro uložení výsledků vyhledávání
    let searchResults = null;
    
    // Přidání event listenerů - reakce na interakce uživatele
    searchButton.addEventListener('click', handleSearch);               // Kliknutí na tlačítko vyhledat
    searchInput.addEventListener('keypress', (e) => {                   // Stisknutí Enter v poli hledání
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Přidání event listenerů pro tlačítka stažení
    downloadJsonBtn.addEventListener('click', () => downloadResults('json')); // Stažení jako JSON
    downloadCsvBtn.addEventListener('click', () => downloadResults('csv'));   // Stažení jako CSV
    
    // Funkce pro obsluhu vyhledávání
    async function handleSearch() {
        const query = searchInput.value.trim();
        
        if (!query) {
            showError('Zadejte prosím hledaný výraz');
            return;
        }
        
        hideError();
        showLoading();
        resultsContainer.style.display = 'none';
        
        try {
            // Fix: Update API URL to work with both local and production environments
            const apiUrl = window.location.hostname === 'localhost' 
                ? `/api/search?q=${encodeURIComponent(query)}`
                : `/api/search?q=${encodeURIComponent(query)}`;
    
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            searchResults = await response.json();
            displayResults(searchResults);
            hideLoading();
            resultsContainer.style.display = 'block';
            
        } catch (error) {
            console.error('Search error:', error);
            hideLoading();
            showError('Nepodařilo se načíst výsledky vyhledávání');
        }
    }
    
    // Funkce pro zobrazení výsledků vyhledávání
    function displayResults(data) {
        // Kontrola, zda máme nějaké výsledky
        if (!data || !data.results || data.results.length === 0) {
            resultsInfo.textContent = 'Nebyly nalezeny žádné výsledky';
            resultsList.innerHTML = '';
            return;
        }
        
        // Aktualizace informací o výsledcích
        resultsInfo.textContent = `Nalezeno ${data.count} výsledků pro "${data.query}"`;
        
        // Vyčištění předchozích výsledků
        resultsList.innerHTML = '';
        
        // Přidání každého výsledku do seznamu
        data.results.forEach((result, index) => {
            // Vytvoření elementu pro výsledek
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            // Vytvoření titulku výsledku s odkazem
            const resultTitle = document.createElement('a');
            resultTitle.className = 'result-title';
            resultTitle.textContent = result.title || 'Bez titulku';
            resultTitle.href = result.url || '#';
            resultTitle.target = '_blank';
            resultTitle.rel = 'noopener noreferrer';
            
            // Vytvoření URL výsledku
            const resultUrl = document.createElement('div');
            resultUrl.className = 'result-url';
            resultUrl.textContent = result.url || 'Bez URL';
            
            // Vytvoření popisu výsledku
            const resultDescription = document.createElement('div');
            resultDescription.className = 'result-description';
            resultDescription.textContent = result.description || 'Bez popisu';
            
            // Přidání všech částí do výsledku
            resultItem.appendChild(resultTitle);
            resultItem.appendChild(resultUrl);
            resultItem.appendChild(resultDescription);
            
            // Přidání výsledku do seznamu
            resultsList.appendChild(resultItem);
        });
    }
    
    // Funkce pro stažení výsledků
    function downloadResults(format) {
        // Kontrola, zda máme výsledky pro stažení
        if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
            showError('Nejsou žádné výsledky ke stažení');
            return;
        }
        
        let content, filename, type;
        
        if (format === 'json') {
            // Formátování jako JSON
            content = JSON.stringify(searchResults, null, 2);
            filename = `google-search-${searchResults.query.replace(/\s+/g, '-')}.json`;
            type = 'application/json';
        } else if (format === 'csv') {
            // Formátování jako CSV
            const headers = ['title', 'url', 'description'];
            const csvRows = [
                headers.join(','), // Hlavička s názvy sloupců
                ...searchResults.results.map(result => {
                    return headers.map(header => {
                        // Escape uvozovek a zabalení do uvozovek, pokud obsahuje čárku
                        const value = result[header] || '';
                        const escapedValue = value.replace(/"/g, '""');
                        return escapedValue.includes(',') ? `"${escapedValue}"` : escapedValue;
                    }).join(',');
                })
            ];
            content = csvRows.join('\n');
            filename = `google-search-${searchResults.query.replace(/\s+/g, '-')}.csv`;
            type = 'text/csv';
        } else {
            showError('Neplatný formát pro stažení');
            return;
        }
        
        // Vytvoření a spuštění stahování
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Pomocné funkce pro UI
    // Zobrazení indikátoru načítání
    function showLoading() {
        loading.style.display = 'block';
    }
    
    // Skrytí indikátoru načítání
    function hideLoading() {
        loading.style.display = 'none';
    }
    
    // Zobrazení chybové zprávy
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Skrytí chybové zprávy
    function hideError() {
        errorMessage.style.display = 'none';
    }
});