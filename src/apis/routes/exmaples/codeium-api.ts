import Hapi from '@hapi/hapi';
import { Prisma } from '@prisma/client';

import { prisma } from '#common/db';
import Joi from 'joi';

export const updateProductRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/productions/{id}',
  options: {
    description: 'Update product by its ID',
    notes: 'Just an example demonstrating how to set up an API.',
    tags: ['api', 'Product'],
    plugins: {
      'hapi-swagger': {},
    },
    validate: {
      params: Joi.object({
        id: Joi.number().integer().min(1).description('ID of production'),
      }),
      payload: Joi.object({
        name: Joi.string().allow(''),
        category: Joi.string().allow(''),
        description: Joi.string().allow(''),
        avatar_img: Joi.string().allow(''),
        banner_img: Joi.string().allow(''),
        metadata: Joi.object().allow(null),
      }),
    },
  },
  /**
   * Handles the update product request.
   *
   * @param {Hapi.Request} request - The incoming request object.
   * @return {Promise} The updated product data.
   */
  handler: async (request: Hapi.Request): Promise<any> => {
    const { id } = request.params;
    const { payload } = request as { payload: Prisma.ProductUpdateInput };
    const where = { id: parseInt(id) };
    const updated = await prisma.product.update({ data: payload, where });
    return updated;
  },
};
