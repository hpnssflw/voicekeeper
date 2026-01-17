import { getRedis } from '../infra/redis';
import { createQueue, Worker } from './index';

export type PublishJob = {
  botId: string;
  postId: string;
};

export const publish = createQueue<PublishJob>('publish');

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
      connection: getRedis(),
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


