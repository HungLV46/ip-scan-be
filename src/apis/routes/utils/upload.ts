import { save } from '#common/aws';
import Hapi from '@hapi/hapi';
import Joi from 'joi';

export const uploadFileRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/upload',
  options: {
    description: 'File upload',
    notes: 'Upload file',
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
    // parse = true, will load the whole file to memory
    payload: {
      multipart: true,
      maxBytes: 1048576,
      parse: true,
      output: 'stream',
    },
  },
  handler: async (request: Hapi.Request) => {
    const file = request.payload as any;

    const s3Url = await save(file);

    return { data: { s3_url: s3Url } };
  },
};
