import Redis from 'ioredis';
import { config } from '#configs/index';

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
});
