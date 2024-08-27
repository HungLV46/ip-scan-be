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

  // Network
  chainId: Number(process.env.CHAIN_ID || 1),

  // AWS
  s3Region: String(process.env.S3_REGION || 'region'),
  s3AccessKeyId: String(process.env.S3_ACCESS_KEY_ID || 'id'),
  s3SecretAccessKey: String(process.env.S3_ACCESS_KEY || 'secret'),
  s3DomainName: String(process.env.S3_DOMAIN_NAME || 'name'),
  s3BucketName: String(process.env.S3_BUCKET_NAME || 'name'),
  s3BucketFolder: String(process.env.S3_BUCKET_FOLDER || 'folder'),
};
