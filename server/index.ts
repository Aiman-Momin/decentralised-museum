import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

let initialized = false;

// Initialize routes immediately (synchronously register them)
try {
  registerRoutes(app).catch(err => {
    console.error('Failed to register routes:', err);
  });
  initialized = true;
} catch (err) {
  console.error('Error during route registration:', err);
}

// Error handler - must come after all routes
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  log(`ERROR ${req.method} ${req.path} ${status}: ${message}`);
  console.error('Full error:', err);

  res.status(status).json({ message, error: message });
});

// Setup static file serving AFTER routes so routes take priority
if (process.env.NODE_ENV !== 'development') {
  serveStatic(app);
}

// Export the app for serverless environments
export { app };

// For local development - start the server
if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
  (async () => {
    try {
      // Setup Vite for development
      const { createServer: createViteServer } = await import('vite');
      const server = require('http').createServer(app);
      
      if (process.env.NODE_ENV === 'development') {
        await setupVite(app, server);
      }
      
      const port = parseInt(process.env.PORT || '5000', 10);
      server.listen(port, '0.0.0.0', () => {
        log(`serving on port ${port}`);
      });
    } catch (err) {
      console.error('Failed to start dev server:', err);
      process.exit(1);
    }
  })();
}
