import { Router } from 'express';
import { postsRouter } from './posts.routes';
import { webhookRouter } from './webhook.routes';
import { botsRouter } from './bots.routes';
import { channelsRouter } from './channels.routes';
import { mtprotoRouter } from './mtproto.routes';

export const router = Router();

// Mount feature routers here, e.g.
// router.use('/posts', postsRouter)

router.get('/', (_req, res) => {
  res.json({ ok: true, service: 'bot-api' });
});

router.use('/bots', botsRouter);
router.use('/channels', channelsRouter);
router.use('/posts', postsRouter);
router.use('/webhook', webhookRouter);
router.use('/mtproto', mtprotoRouter);


