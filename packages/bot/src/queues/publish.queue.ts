import { createQueue, Worker } from './index';

export type PublishJob = {
  botId: string;
  postId: string;
};

export const publish = createQueue<PublishJob>('publish');

export function createPublishWorker(handler: (data: PublishJob) => Promise<void>) {
  return new Worker<PublishJob>('publish', async job => {
    await handler(job.data);
  });
}


