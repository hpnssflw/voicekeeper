import { Router } from 'express';
import { getOrCreateBotByUsername, getTelegramBot, webhookAuth } from '../webhooks/telegram';

export const webhookRouter = Router();

// Single-bot webhook endpoint: /api/webhook/telegram
webhookRouter.post('/telegram', webhookAuth, async (req, res, next) => {
  console.log('Webhook received at /api/webhook/telegram');
  const bot = getTelegramBot();
  if (!bot) {
    console.error('Bot not configured');
    return res.status(503).json({ data: null, error: { code: 'BOT_NOT_CONFIGURED', message: 'TELEGRAM_BOT_TOKEN missing' } });
  }
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error handling update:', err);
    next(err);
  }
});

// Multi-bot: /api/webhook/:botUsername
webhookRouter.post('/:botUsername', webhookAuth, async (req, res, next) => {
  const { botUsername } = req.params as { botUsername: string };
  const bot = await getOrCreateBotByUsername(botUsername);
  if (!bot) return res.status(404).json({ data: null, error: { code: 'BOT_NOT_FOUND', message: 'Unknown or inactive bot' } });
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error handling update:', err);
    next(err);
  }
});


