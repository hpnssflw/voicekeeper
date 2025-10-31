import type { NextFunction, Request, Response } from 'express';
import { Context, Telegraf } from 'telegraf';
import { env } from '../config/env';
import { BotsService } from '../services/bots.service';

let singletonBot: Telegraf<Context> | null = null;
const botCache = new Map<string, Telegraf<Context>>(); // username -> bot

export function getTelegramBot(): Telegraf<Context> | null {
  if (singletonBot) return singletonBot;
  if (!env.TELEGRAM_BOT_TOKEN) return null;

  singletonBot = configureBot(new Telegraf(env.TELEGRAM_BOT_TOKEN));
  return singletonBot;
}

function configureBot(bot: Telegraf<Context>) {

  bot.start(async (ctx) => {
    await ctx.reply('Welcome!');
  });

  bot.on('callback_query', async (ctx) => {
    await ctx.answerCbQuery();
  });

  bot.on('message', async (ctx) => {
    // basic echo placeholder
    if ('text' in ctx.message) {
      await ctx.reply(`You said: ${ctx.message.text}`);
    }
  });

  return bot;
}

export function webhookAuth(req: Request, res: Response, next: NextFunction) {
  if (!env.WEBHOOK_SECRET) return next();
  const token = (req.query.token as string) || req.headers['x-webhook-token'];
  if (token !== env.WEBHOOK_SECRET) {
    return res.status(401).json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Bad webhook token' } });
  }
  return next();
}

export async function getOrCreateBotByUsername(botUsername: string) {
  if (botCache.has(botUsername)) return botCache.get(botUsername)!;
  const service = new BotsService();
  const token = await service.resolveTokenByUsername(botUsername);
  if (!token) return null;
  const bot = configureBot(new Telegraf(token));
  botCache.set(botUsername, bot);
  return bot;
}


