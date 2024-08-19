export const config = {
  // server configuration
  host: String(process.env.HOST || 'localhost'),
  port: Number(process.env.PORT || 3000),

  // redis configuration
  redisUrl: String(process.env.REDIS_URL || 'localhost:6379'),

  logLevel: String(process.env.LOG_LEVEL || 'info'),

  // Elasticsearch
  elasticsearchUrl: String(process.env.ELASTICSEARCH_URL || ''),
  doElasticsearchWork: Boolean(Number(process.env.DO_ELASTICSEARCH_WORK)),
  clear_indexes: process.env.ELASTICSEARCH_CLEAR_INDEXES?.split(',') || [],

  // Network
  chainId: Number(process.env.CHAIN_ID || 1),
};
