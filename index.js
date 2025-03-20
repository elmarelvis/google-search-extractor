// index.js
// This file is a simple proxy to either use server.js for local development
// or the API endpoints for serverless deployment

// For Vercel, we'll use the API endpoints directly
// For local development, we'll import the server
if (process.env.VERCEL) {
  // When running on Vercel, this file won't be executed
  console.log('Running on Vercel - using serverless functions');
} else {
  // When running locally, use the server
  console.log('Running locally - using Express server');
  require('./server');
}

// Make the app available for Vercel 
export { default } from "./server";