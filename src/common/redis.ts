import Redis from 'ioredis';
import { config } from '#configs/index';
import { LAST_INDEXED_TIME } from './const';

export const redis = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
});

export const getLastIndexedTime = async () => {
  const lastIndexedTime = await redis.get(LAST_INDEXED_TIME);
  return Number(lastIndexedTime || 0);
};

export const setLastIndexedTime = async (time: number) => {
  await redis.set(LAST_INDEXED_TIME, time);
};
