import Joi from 'joi';
import Hapi from '@hapi/hapi';
import { prisma } from '#common/db';
import { Prisma } from '@prisma/client';
import Boom from '@hapi/boom';

export const deleteUserRoute: Hapi.ServerRoute = {
  method: 'DELETE',
  path: '/users/{id}',
  options: {
    description: 'Delete user by its ID',
    notes: 'Delete user from database',
    tags: ['api', 'user', 'delete'],
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

      await prisma.user.delete({ where: { id } });

      return { data: { id } };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw Boom.badRequest('Related product exists');
        }

        if (error.code === 'P2025') {
          throw Boom.badRequest('User does not exist');
        }
      }

      throw error;
    }
  },
};
