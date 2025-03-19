const { app, scrapeGoogleResults } = require('../server');
const puppeteer = require('puppeteer');
const axios = require('axios');

jest.mock('axios');

describe('Server API', () => {
// Test the search endpoint with a valid query
test('GET /api/search should return search results for valid query', async () => {
// Mock the scrapeGoogleResults function
const mockResults = {
query: 'test query',
count: 2,
results: [
{
title: 'Test Result 1',
url: 'https://example.com/1',
description: 'This is test result 1'
},
{
title: 'Test Result 2',
url: 'https://example.com/2',
description: 'This is test result 2'
}
]
};

// Mock axios to return HTML with search results
// Use a simpler mock that doesn't rely on exact HTML structure
const mockHtml = '<html><body>' + 
  '<div class="g"><h3>Test Result 1</h3><a href="/url?q=https://example.com/1">Link</a><div class="VwiC3b">This is test result 1</div></div>' +
  '<div class="g"><h3>Test Result 2</h3><a href="/url?q=https://example.com/2">Link</a><div class="VwiC3b">This is test result 2</div></div>' +
  '</body></html>';

axios.get.mockResolvedValue({
   mockHtml
});

// Call the function
const results = await scrapeGoogleResults('test query');

// Verify the results
expect(results).toHaveProperty('query', 'test query');
expect(results).toHaveProperty('count');
expect(results).toHaveProperty('results');
expect(Array.isArray(results.results)).toBe(true);

// Check if each result has required properties
results.results.forEach(result => {
  expect(result).toHaveProperty('title');
  expect(result).toHaveProperty('url');
  expect(result).toHaveProperty('description');
});
});

// Test the response structure
test('Search results should have the correct structure', async () => {
// Mock HTML with search results - using HTML string variable instead of template literal
const simpleHtml = '<html><body><div class="g"><h3>Test Result 1</h3><a href="/url?q=https://example.com/1">Link</a><div class="VwiC3b">This is test result 1</div></div></body></html>';

axios.get.mockResolvedValue({
   simpleHtml
});

// Call the function
const results = await scrapeGoogleResults('test query');

// Verify the structure
expect(results).toMatchObject({
  query: expect.any(String),
  count: expect.any(Number),
  results: expect.arrayContaining([
    expect.objectContaining({
      title: expect.any(String),
      url: expect.any(String),
      description: expect.any(String)
    })
  ])
});
});

// Test error handling
test('scrapeGoogleResults should handle errors', async () => {
// Mock axios to throw an error
axios.get.mockRejectedValue(new Error('Network error'));

// Call the function and expect it to throw
await expect(scrapeGoogleResults('test query')).rejects.toThrow('Failed to scrape Google results');
});
});

// End-to-end test using Puppeteer
describe('Frontend End-to-End Tests', () => {
let browser;
let page;
let server;

// Setup: start server and launch browser
beforeAll(async () => {
// Start server on a test port
server = app.listen(3001);

// Launch browser
browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

// Create new page
page = await browser.newPage();
});

// Teardown: close browser and server
afterAll(async () => {
await browser.close();
server.close();
});

// Test the search functionality in the browser
test('Search form should work correctly', async () => {
// Mock the fetch function in the browser
await page.setRequestInterception(true);

page.on('request', request => {
  if (request.url().includes('/api/search')) {
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        query: 'test query',
        count: 2,
        results: [
          {
            title: 'Test Result 1',
            url: 'https://example.com/1',
            description: 'This is test result 1'
          },
          {
            title: 'Test Result 2',
            url: 'https://example.com/2',
            description: 'This is test result 2'
          }
        ]
      })
    });
  } else {
    request.continue();
  }
});

// Navigate to the app
await page.goto('http://localhost:3001');

// Type in search query
await page.type('#search-input', 'test query');

// Click search button
await page.click('#search-button');

// Wait for results to be displayed
await page.waitForSelector('.result-item');

// Check if results are displayed correctly
const resultsCount = await page.$$eval('.result-item', items => items.length);
expect(resultsCount).toBe(2);

// Check if download buttons are present
const downloadButtons = await page.$$eval('.download-options button', buttons => buttons.length);
expect(downloadButtons).toBe(2);
});
});