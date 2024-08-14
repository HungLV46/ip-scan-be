import { redis } from '#common/redis';
import { Worker, Job, Queue } from 'bullmq';
import * as productsIndex from '#root/elastic-search/indexes/products/index';

const QUEUE_NAME = 'products-queue';
const JOB_NAME = 'products-job';

export const queue = new Queue(QUEUE_NAME, {
  connection: redis.duplicate(),
  defaultJobOptions: {
    attempts: 10,
    backoff: {
      type: 'exponential',
      delay: 200000,
    },
    removeOnComplete: 10,
    removeOnFail: 100,
  },
});

export async function addToQueue() {
  await queue.add(JOB_NAME, { id: Date.now() }, { repeat: { every: 15000 } });
}

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    console.log(
      `Products worker sync missing data  running every 15s job(id: ${job.id}, data: ${JSON.stringify(job.data)}).`,
    );

    await productsIndex.syncDataMissing();
  },
  { connection: redis.duplicate() },
);

worker.on('error', (err) => {
  console.error(err);
});
