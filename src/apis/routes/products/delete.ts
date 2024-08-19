import { Prisma, PrismaClient } from '@prisma/client';
import Hapi from '@hapi/hapi';
import Joi from 'joi';
import Boom from '@hapi/boom';

const prisma = new PrismaClient();

export const deleteProductRoute: Hapi.ServerRoute = {
  method: 'DELETE',
  path: '/products/{id}',
  options: {
    description: 'Delete product by its ID',
    notes: 'Delete product from database',
    tags: ['api', 'product', 'delete'],
    plugins: { 'hapi-swagger': {} },
    validate: {
      params: Joi.object({
        id: Joi.number().required().example(1),
      }),
    },
  },
  handler: async (request: Hapi.Request) => {
    try {
      const id = Number(request.params.id);

      await prisma.product.delete({ where: { id } });

      return { data: { id } };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw Boom.badRequest('Product does not exist');
        }
      }
    }
  },
};
