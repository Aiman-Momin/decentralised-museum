import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
registerRoutes(app);

// Error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Export the app for serverless environments
export { app };

// For local development only
if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
  (async () => {
    try {
      const { createServer } = await import('http');
      const server = createServer(app);
      const port = parseInt(process.env.PORT || '5000', 10);
      server.listen(port, '0.0.0.0', () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (err) {
      console.error('Failed to start dev server:', err);
    }
  })();
}
