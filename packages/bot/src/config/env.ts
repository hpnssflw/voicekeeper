import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

type Env = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  MONGO_URI: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  WEBHOOK_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string; // single-bot mode token (optional)
  ENABLE_POLLING: boolean;
};

function requireEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export const env: Env = {
  NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
  PORT: Number(process.env.PORT || 8080),
  MONGO_URI: requireEnv('MONGO_URI', 'mongodb://localhost:27017/app'),
  REDIS_URL: requireEnv('REDIS_URL', 'redis://localhost:6379'),
  JWT_SECRET: requireEnv('JWT_SECRET', 'dev_secret'),
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  ENABLE_POLLING: String(process.env.ENABLE_POLLING || '').toLowerCase() === 'true',
};


