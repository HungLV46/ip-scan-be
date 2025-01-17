import Hapi from '@hapi/hapi';
import { prisma } from '#common/db';
import Joi from 'joi';

export const getProductRoute: Hapi.ServerRoute = {
  method: 'GET',
  path: '/products/{id}',
  options: {
    description: 'Get product by its ID',
    notes: 'Just an example demonstrating how to set up an API.',
    tags: ['api', 'Product'],
    plugins: {
      'hapi-swagger': {},
    },
    cache: {
      // client side cache for 30s
      expiresIn: 30 * 1000,
      privacy: 'private',
    },
    validate: {
      params: Joi.object({
        id: Joi.number().integer().min(1).description('ID of production'),
      }),
    },
    // response: { schema: Joi.object({}) }
  },
  handler: (request: Hapi.Request) => {
    return prisma.product.findFirst(request.params.id);
  },
};
