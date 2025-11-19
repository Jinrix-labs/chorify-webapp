// Vercel serverless function wrapper for Express app
import type { VercelRequest, VercelResponse } from "@vercel/node";

// Import the Express app - it's exported from server/index.ts
let app: any;

async function getApp() {
  if (!app) {
    const module = await import("../server/index.js");
    app = module.default;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await getApp();
  return expressApp(req, res);
}
