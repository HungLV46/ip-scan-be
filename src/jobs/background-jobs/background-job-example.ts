import { redis } from '#common/redis';
import { Worker, Job, Queue } from 'bullmq';

const QUEUE_NAME = 'example-background-queue';
const JOB_NAME = 'example-background-job';

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
  await queue.add(JOB_NAME, { id: Date.now() }, { repeat: { every: 5000 } });
}

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    console.log(
      `Example background worker running every 5s job(id: ${job.id}, data: ${JSON.stringify(job.data)}).`,
    );
  },
  { connection: redis.duplicate() },
);

worker.on('error', (err) => {
  console.error(err);
});
