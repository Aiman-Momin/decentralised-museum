import { app } from '../dist/index.js';

// Vercel Node serverless functions expect a (req, res) handler.
// Wrap the Express app so it can be invoked correctly.
export default function handler(req, res) {
  return app(req, res);
}
