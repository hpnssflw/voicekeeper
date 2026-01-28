import { ConnectionOptions } from 'bullmq';
import { env } from '../config/env';
import { createQueue, Worker } from './index';

export type PublishJob = {
  botId: string;
  postId: string;
};

export const publish = createQueue<PublishJob>('publish');

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

export function createPublishWorker(handler: (data: PublishJob) => Promise<void>) {
  const worker = new Worker<PublishJob>(
    'publish',
    async job => {
      try {
        await handler(job.data);
      } catch (err: any) {
        console.error(`Publish job ${job.id} failed:`, err.message);
        throw err; // Re-throw to mark as failed
      }
    },
    {
      connection: getConnectionOptions(),
      concurrency: 1, // Process one job at a time
    }
  );
  
  worker.on('completed', (job) => {
    console.log(`✅ Publish job ${job.id} completed successfully`);
  });
  
  worker.on('failed', (job, err) => {
    console.error(`❌ Publish job ${job?.id} failed:`, err.message);
    if (err.stack) {
      console.error('Stack trace:', err.stack);
    }
  });
  
  worker.on('error', (err) => {
    console.error('🔴 Publish worker error:', err);
  });
  
  worker.on('active', (job) => {
    console.log(`🔄 Publish job ${job.id} is now active`);
  });
  
  console.log(`📋 Publish worker initialized and listening for jobs...`);
  
  return worker;
}


