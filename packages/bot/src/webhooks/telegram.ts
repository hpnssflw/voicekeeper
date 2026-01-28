import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { Context, Markup, Telegraf } from 'telegraf';
import { env } from '../config/env';
import { SubscribersRepository } from '../repositories/subscribers.repo';
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
    // Register subscriber
    if (ctx.from) {
      const subscribersRepo = new SubscribersRepository();
      // For MVP: use hardcoded botId, in future get from bot token
      const HARDCODED_BOT_ID = '507f1f77bcf86cd799439011';
      try {
        await subscribersRepo.createOrUpdate(HARDCODED_BOT_ID, ctx.from.id, {
          username: ctx.from.username,
          firstName: ctx.from.first_name,
          lastName: ctx.from.last_name,
        });
        console.log(`✓ Subscriber registered: ${ctx.from.id} (@${ctx.from.username || 'no_username'})`);
      } catch (err: any) {
        console.error('Failed to register subscriber:', err.message);
      }
    }

    const imagePath = path.join(__dirname, '..', '..', 'assets', 'start.jpg');
    const hasImage = fs.existsSync(imagePath);
    const caption = [
      '<b>Telegram Funnel Starter</b>\n',
      'Готовая основа для контент‑воронок: бот + админка + рассылки + аналитика.\n',
      '',
      '<b>Что внутри</b>:\n',
      '• Express Telegram Bot (вебхуки, рассылки, события)\n',
      '• Next.js Admin Panel (управление постами/ботами/аналитикой)\n',
      '• MongoDB + Redis + BullMQ (хранилище, кеш, очереди)\n',
      '',
      `Создатель: <a href="${env.CREATOR_LINK}">${env.CREATOR_LINK}</a>`
    ].join('\n');

    // WebApp functionality moved to admin package
    // Use ADMIN_URL if you want to link to admin panel
    const adminUrl = process.env.ADMIN_URL;
    const isHttps = adminUrl?.startsWith('https://') || false;
    const kb = isHttps && adminUrl
      ? Markup.inlineKeyboard([
          [Markup.button.url('📱 Открыть админку', adminUrl)],
        ])
      : Markup.inlineKeyboard([]);

    if (hasImage) {
      await ctx.replyWithPhoto(
        { source: fs.createReadStream(imagePath) },
        { caption: caption, parse_mode: 'HTML', reply_markup: kb.reply_markup }
      );
    } else {
      await ctx.reply(caption, { parse_mode: 'HTML', reply_markup: kb.reply_markup });
    }
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


