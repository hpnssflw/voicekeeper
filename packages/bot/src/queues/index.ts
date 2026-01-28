import { Queue, QueueEvents, Worker, ConnectionOptions } from 'bullmq';
import { env } from '../config/env';

// Extract connection options from Redis URL to avoid type incompatibility
function getConnectionOptions(): ConnectionOptions {
  const url = new URL(env.REDIS_URL);
  const options: ConnectionOptions = {
    host: url.hostname,
    port: parseInt(url.port || '6379'),
    maxRetriesPerRequest: null,
  };
  
  if (url.password) {
    options.password = url.password;
  }
  
  if (url.pathname && url.pathname.length > 1) {
    const db = parseInt(url.pathname.slice(1));
    if (!isNaN(db)) {
      options.db = db;
    }
  }
  
  return options;
}

const connection = getConnectionOptions();

export function createQueue<T = any>(name: string) {
  const queue = new Queue<T>(name, { connection });
  const events = new QueueEvents(name, { connection });
  return { queue, events };
}

export { Worker };


