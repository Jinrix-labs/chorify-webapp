// Vercel serverless function wrapper for Express app
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import the Express app - use .js extension as Vercel compiles TS to JS
let app: any;
let initPromise: Promise<any> | null = null;

async function getApp() {
  if (app) return app;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Import from the compiled server - Vercel will compile TypeScript
      // Use .js extension as that's what the compiled output will be
      const module = await import("../server/index.js");
      // Wait for app initialization to complete (routes registered)
      await module.initializeApp();
      app = module.default;
      return app;
    } catch (error) {
      console.error("Failed to initialize app:", error);
      console.error("Error details:", error instanceof Error ? error.stack : error);
      throw error;
    }
  })();

  return initPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
