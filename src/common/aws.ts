import { config } from '#configs/index';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import randomstring from 'randomstring';

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

function generateFilename(filename: string) {
  return `${randomstring.generate({ length: 32, charset: 'alphanumeric' })}${path.extname(filename)}`;
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

async function save(fileStream: any): Promise<string> {
  const filename = generateFilename(fileStream.file.hapi.filename);

  if (await isExit(filename)) {
    throw new Error(`Filename (${filename}) is already existed on S3`);
  }

  const command = new PutObjectCommand({
    Bucket: config.s3BucketName,
    Body: fileStream.file._data,
    Key: generateS3Key(filename),
    ContentType: fileStream.file.hapi.headers['content-type'],
  });

  // Upload to s3
  await s3.send(command);

  return getS3Url(filename);
}

export { s3, save };
