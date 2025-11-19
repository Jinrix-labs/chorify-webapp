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
    // Wait for app initialization to complete (routes registered)
    await module.initializeApp();
    app = module.default;
    return app;
  })();

  return initPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
