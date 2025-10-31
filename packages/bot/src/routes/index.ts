import { Router } from 'express';
import { postsRouter } from './posts.routes';
import { webhookRouter } from './webhook.routes';

export const router = Router();

// Mount feature routers here, e.g.
// router.use('/posts', postsRouter)

router.get('/', (_req, res) => {
  res.json({ ok: true, service: 'bot-api' });
});

router.use('/posts', postsRouter);
router.use('/webhook', webhookRouter);


