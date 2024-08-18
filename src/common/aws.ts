import { config } from '#configs/index';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import crypto from 'crypto';

const s3 = new S3({
  region: config.s3Region,
  credentials: {
    accessKeyId: config.s3AccessKeyId,
    secretAccessKey: config.s3SecretAccessKey,
  },
});

function getS3Url(fileName: string) {
  return `https://${config.s3DomainName}/${config.s3BucketFolder}/${fileName}`;
}

function generateFilename(filename: string, filedata: any) {
  const hash = crypto.createHash('md5');
  hash.update(filename);
  hash.update(filedata);

  return `${hash.digest('hex')}${path.extname(filename)}`;
}

function generateS3Key(fileName: string) {
  return `${config.s3BucketFolder}/${fileName}`;
}

async function isExit(filename: string): Promise<boolean> {
  try {
    await s3.headObject({
      Bucket: process.env.S3_BUCKET,
      Key: generateS3Key(filename),
    });

    return true;
  } catch (error) {
    return false;
  }
}

async function save(file: any): Promise<string> {
  const filename = generateFilename(file.hapi.filename, file._data);

  const s3Url = getS3Url(filename);
  if (await isExit(filename)) {
    return s3Url;
  }

  const command = new PutObjectCommand({
    Bucket: config.s3BucketName,
    Body: file._data,
    Key: generateS3Key(filename),
    ContentType: file.hapi.headers['content-type'],
  });

  // Upload to s3
  await s3.send(command);

  return s3Url;
}

export { s3, save };
