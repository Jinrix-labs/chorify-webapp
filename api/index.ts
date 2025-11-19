// Vercel serverless function wrapper for Express app
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import and ensure app is initialized
let app: any;
let initPromise: Promise<any> | null = null;

async function getApp() {
  if (app) return app;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const module = await import("../server/index.js");
    // Import the initialization function to ensure routes are registered
    // The server/index.ts will initialize routes when imported
    app = module.default;
    
    // Give a moment for async initialization to complete
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return app;
  })();

  return initPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp();
  return expressApp(req, res);
}
