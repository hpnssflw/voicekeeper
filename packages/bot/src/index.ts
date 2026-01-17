import { createApp } from './app';
import { buildContainer } from './bootstrap/container';
import { env } from './config/env';
import { connectMongo, disconnectMongo } from './infra/mongo';
import { closeRedis, getRedis } from './infra/redis';
import { createPublishWorker } from './queues/publish.queue';
import { getTelegramBot } from './webhooks/telegram';
import { handlePublishJob } from './workers/publish.worker';

async function start() {
  try {
    await connectMongo();
    getRedis();

    const container = buildContainer();
    const app = createApp(container);

    // Initialize bot handlers
    const bot = getTelegramBot();
    if (bot) {
      console.log('Telegram bot initialized');
    } else {
      console.warn('Warning: TELEGRAM_BOT_TOKEN not set, bot handlers disabled');
    }

    // Start BullMQ workers
    const publishWorker = createPublishWorker(handlePublishJob);
    console.log('Publish worker started');

    const server = app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Bot API listening on :${env.PORT}`);
    });

    // Start polling in dev if enabled
    let stopPolling: (() => void) | null = null;
    if (env.ENABLE_POLLING && bot) {
      await bot.launch();
      console.log('Telegram bot started in polling mode');
      stopPolling = () => bot?.stop('SIGTERM');
    }

    const shutdown = async (signal: string) => {
      // eslint-disable-next-line no-console
      console.log(`\nReceived ${signal}. Shutting down...`);
      await new Promise<void>(resolve => server.close(() => resolve()));
      if (stopPolling) stopPolling();
      await publishWorker.close();
      await disconnectMongo();
      await closeRedis();
      // eslint-disable-next-line no-console
      console.log('Cleanup done. Bye.');
      process.exit(0);
    };

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('uncaughtException', err => {
      console.error('UncaughtException:', err);
      void shutdown('uncaughtException');
    });
    process.on('unhandledRejection', reason => {
      console.error('UnhandledRejection:', reason);
      void shutdown('unhandledRejection');
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
}

void start();
