import { app } from '../dist/index.js';

// Ensure this function runs on the Node.js runtime (not Edge),
// so that Express and Node built-ins are fully supported.
export const config = {
  runtime: 'nodejs',
};

// Vercel serverless function handler
// Express app can be used directly as a request handler
export default app;
