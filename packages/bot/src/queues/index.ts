import { Queue, QueueEvents, Worker } from 'bullmq';
import { getRedis } from '../infra/redis';

const connection = getRedis();

export function createQueue<T = any>(name: string) {
  const queue = new Queue<T>(name, { connection });
  const events = new QueueEvents(name, { connection });
  return { queue, events };
}

export { Worker };


