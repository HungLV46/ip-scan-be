import { save } from '#common/aws';
import Hapi from '@hapi/hapi';
import Joi from 'joi';

export const uploadFileRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/upload',
  options: {
    description: 'File upload',
    notes:
      'This API uses MD5 hash of filename & file content for s3 key as a duplication avoidance mechanism.',
    tags: ['api', 'upload'],
    plugins: {
      'hapi-swagger': {
        payloadType: 'form',
      },
    },
    validate: {
      payload: Joi.object({
        file: Joi.any()
          .meta({ swaggerType: 'file' })
          .description('file to upload'),
      }),
    },
    // load the whole file to memory
    payload: {
      multipart: true,
      maxBytes: 1048576,
      parse: true,
      output: 'stream',
    },
  },
  handler: async (request: Hapi.Request) => {
    const s3Url = await save((request.payload as any).file);

    return { data: { s3_url: s3Url } };
  },
};
