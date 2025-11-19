import type { VercelRequest, VercelResponse } from '@vercel/node';

let appInstance: any = null;

const initApp = async () => {
  const { default: app, initializeApp } = await import('../server/index.js');
  await initializeApp();
  return app;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appInstance) {
      appInstance = await initApp();
    }
    
    // Pass to Express app
    appInstance(req, res);
  } catch (error: any) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Function failed',
      message: error.message 
    });
  }
}
