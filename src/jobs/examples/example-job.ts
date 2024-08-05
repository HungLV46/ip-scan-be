import { redis } from '#common/redis';
import { Worker, Job, Queue } from 'bullmq';

import { randomUUID } from 'crypto';

const QUEUE_NAME = 'example-queue';

export const queue = new Queue(QUEUE_NAME, {
  connection: redis.duplicate(),
  defaultJobOptions: {
    attempts: 10,
    backoff: {
      type: 'exponential',
      delay: 200000,
    },
    removeOnComplete: 100,
    removeOnFail: 2000,
  },
});

export async function addToQueue(data: { id: number }) {
  await queue.add(randomUUID(), { id: data.id });
}

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    console.log(
      `Example running job(id: ${job.id}, data: ${JSON.stringify(job.data)}).`,
    );
  },
  { connection: redis.duplicate() },
);

worker.on('error', (err) => {
  console.error(err);
});
