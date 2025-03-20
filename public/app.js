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
    
    // Add this function before the event listeners
    function displayResults(data) {
        // Update results info
        resultsInfo.textContent = `Nalezeno ${data.count} výsledků pro: "${data.query}"`;
        
        // Clear previous results
        resultsList.innerHTML = '';
        
        // Create and append result items
        data.results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            resultItem.innerHTML = `
                <a href="${result.url}" class="result-title" target="_blank">${result.title}</a>
                <div class="result-url">${result.url}</div>
                <div class="result-description">${result.description}</div>
            `;
            
            resultsList.appendChild(resultItem);
        });
    }
    
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
        const apiUrl = window.location.hostname === 'localhost' 
            ? `/api/search?q=${encodeURIComponent(query)}`
            : `https://${window.location.host}/api/search?q=${encodeURIComponent(query)}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API error: ${response.status}`);
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