// Vercel serverless function handler for Express app
export const config = {
  runtime: 'nodejs',
};

// Import the Express app synchronously
import { app } from '../dist/index.js';

// Vercel expects a default export that handles (req, res)
// Express app can be used directly as a request handler
export default app;
