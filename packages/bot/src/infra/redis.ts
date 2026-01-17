import { Redis } from 'ioredis';
import { env } from '../config/env';

let client: Redis | null = null;

export function getRedis(): Redis {
  if (!client) {
    // Validate REDIS_URL format
    if (!env.REDIS_URL.startsWith('redis://') && !env.REDIS_URL.startsWith('rediss://')) {
      throw new Error(`Invalid REDIS_URL format: ${env.REDIS_URL}. Must start with redis:// or rediss://`);
    }
    
    client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null, // Required for BullMQ
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        console.warn(`Redis connection retry ${times}, waiting ${delay}ms...`);
        return delay;
      },
      connectTimeout: 10000,
    });
    
    client.on('error', (err) => {
      console.error('Redis connection error:', err.message);
      if (err.message.includes('ECONNREFUSED')) {
        console.error('→ Redis is not running or REDIS_URL is incorrect');
        console.error(`→ Current REDIS_URL: ${env.REDIS_URL}`);
        console.error('→ Expected format: redis://localhost:6379');
      }
    });
    
    client.on('connect', () => {
      console.log(`✓ Redis connected: ${env.REDIS_URL}`);
    });
  }
  return client;
}

export async function closeRedis(): Promise<void> {
  if (client) {
    try {
      await client.quit();
    } catch {
      // ignore
    }
    client = null;
  }
}


