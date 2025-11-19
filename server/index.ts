import "dotenv/config";
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

// Initialize app - ensure routes are registered before export
let appInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initializeApp() {
  if (appInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      // Don't throw in serverless - just log
      console.error("Error:", err);
    });

    // For Vercel/serverless, don't serve static files (Vercel handles that)
    // Only setup static/Vite for non-serverless environments
    if (process.env.VERCEL) {
      // In Vercel, static files are served separately, we only handle API routes
      // Don't add any static file serving middleware
    } else if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      // Production but not Vercel - serve static files
      serveStatic(app);
    }

    // Only listen on port if not in Vercel (serverless)
    if (!process.env.VERCEL) {
      const port = parseInt(process.env.PORT || '5000', 10);
      const host = process.env.HOST || 'localhost';
      server.listen(port, host, () => {
        log(`serving on port ${port}`);
      });
    }

    appInitialized = true;
  })();

  return initPromise;
}

// Initialize immediately
initializeApp();

// Export app for Vercel serverless functions
export default app;
