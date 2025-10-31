import express from 'express';
import type { Container } from './bootstrap/container';
import { errorHandler } from './middlewares/errorHandler';
import { router } from './routes';

export function createApp(_container?: Container) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api', router);

  app.use(errorHandler);
  return app;
}


