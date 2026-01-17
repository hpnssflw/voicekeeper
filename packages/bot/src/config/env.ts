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
  CREATOR_LINK: string;
  WEBAPP_URL?: string;
  CLOUDFLARED_PATH?: string;
  TELEGRAM_CHANNEL_ID?: string; // Channel ID, @username, or URL (https://t.me/channel) for publishing posts
  PUBLISH_MODE?: 'channel' | 'subscribers'; // How to publish: 'channel' or 'subscribers'
  
  // MTProto (gramjs) settings for full Telegram API access
  // Get these from https://my.telegram.org/apps
  TELEGRAM_API_ID?: string;
  TELEGRAM_API_HASH?: string;
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
  CREATOR_LINK: process.env.CREATOR_LINK || 'https://github.com/hpnssflw',
  WEBAPP_URL: process.env.WEBAPP_URL,
  CLOUDFLARED_PATH: process.env.CLOUDFLARED_PATH,
  // Support both TELEGRAM_CHANNEL_ID and TELEGRAM_CHANNEL_LINK
  // Extract username from URL if provided (e.g., https://t.me/hf_develop -> @hf_develop)
  TELEGRAM_CHANNEL_ID: (() => {
    const channelId = process.env.TELEGRAM_CHANNEL_ID;
    const channelLink = process.env.TELEGRAM_CHANNEL_LINK;
    const value = channelId || channelLink;
    if (!value) return undefined;
    // If it's a URL, extract username
    const urlMatch = value.match(/t\.me\/([@\w]+)/);
    if (urlMatch) {
      const username = urlMatch[1];
      return username.startsWith('@') ? username : `@${username}`;
    }
    // If it already starts with @ or is a numeric ID, use as-is
    return value;
  })(),
  PUBLISH_MODE: (process.env.PUBLISH_MODE as 'channel' | 'subscribers' | undefined) || 'channel',
  
  // MTProto settings
  TELEGRAM_API_ID: process.env.TELEGRAM_API_ID,
  TELEGRAM_API_HASH: process.env.TELEGRAM_API_HASH,
};


