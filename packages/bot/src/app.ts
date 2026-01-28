import express from 'express';
import type { Container } from './bootstrap/container';
import { errorHandler } from './middlewares/errorHandler';
import { router } from './routes';

export function createApp(_container?: Container) {
  const app = express();
  
  // CORS for admin panel (localhost in dev, actual domain in prod)
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && (origin.includes('localhost:3001') || origin.includes('localhost:3000') || origin.includes('trycloudflare.com'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });
  
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api', router);

  app.use(errorHandler);
  return app;
}


