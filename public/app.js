// Get DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const resultsList = document.getElementById('results-list');
const resultsInfo = document.getElementById('results-info');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Helper functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function displayResults(data) {
    resultsInfo.textContent = `Nalezeno ${data.count} výsledků pro: "${data.query}"`;
    resultsList.innerHTML = '';
    
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
        const apiUrl = `/api/search?q=${encodeURIComponent(query)}`;
        console.log('Sending request to:', apiUrl); // Debug log

        const response = await fetch(apiUrl);
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        displayResults(data);
        hideLoading();
        resultsContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Search error:', error);
        hideLoading();
        showError('Nepodařilo se načíst výsledky vyhledávání');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});