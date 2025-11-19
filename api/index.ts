// Vercel serverless function wrapper for Express app
import app, { initializeApp } from '../server/index.js';

// Ensure app is initialized before handling requests
await initializeApp();

// Export as Vercel serverless function
export default app;
