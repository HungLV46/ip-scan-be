import { logger } from '#common/loggger';
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
    payload: {
      multipart: true,
      maxBytes: 1048576,
      parse: true,
      output: 'file',
    },
  },
  handler: async (request: Hapi.Request) => {
    const file = request.payload;
    logger.warn(file);
    return {
      message: 'Uploaded',
    };
  },
};
