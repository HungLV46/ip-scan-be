import Hapi from '@hapi/hapi';
import { prisma } from '#common/db';
import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const updateUserRoute: Hapi.ServerRoute = {
  method: 'PUT',
  path: '/users/{id}',
  options: {
    description: 'Update user by its ID',
    notes: 'Update user, its attributes and collections',
    tags: ['api', 'user', 'update'],
    plugins: { 'hapi-swagger': {} },
    validate: {
      params: Joi.object({
        id: Joi.number().required().example(1),
      }),
      payload: Joi.object({
        name: Joi.string().optional().example('User name'),
        bio: Joi.string().optional().example('Bio'),
        email: Joi.string().optional().email().example('Hqk7S@example.com'),
        wallet_address: Joi.string().optional().example('0x1234567890'),
        avatar_img: Joi.string()
          .optional()
          .example('https://loremflickr.com/640/480?lock=1572275828555776'),
        banner_img: Joi.string()
          .optional()
          .example('https://loremflickr.com/640/480?lock=1572275828555776'),
        attributes: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required().example('attribute name'),
              value: Joi.string().required().example('attribute value'),
            }),
          )
          .default([]),
        additional_info: Joi.object({
          headline: Joi.string().optional().example('headline'),
          location: Joi.string().optional().example('location'),
          socials: Joi.array()
            .optional()
            .items(
              Joi.object({
                name: Joi.string().required().example('twitter'),
                url: Joi.string().required().example('https://twitter.com'),
              }),
            )
            .default([])
            .optional(),
        }).optional(),
      }),
    },
    // response: { schema: Joi.object({}) }
  },
  handler: async (request: Hapi.Request) => {
    const id = Number(request.params.id);
    const payload = request.payload as any;

    // create new user
    const user = {
      name: payload.name,
      bio: payload.bio,
      avatar_img: payload.avatar_img,
      banner_img: payload.banner_img,
      additional_info: payload.additional_info,
    } as Prisma.UserCreateInput;

    await Promise.all([
      prisma.user.update({
        where: { id: Number(request.params.id) },
        data: user,
      }),
      prisma.$transaction([
        prisma.userAttribute.deleteMany({ where: { user_id: id } }),
        prisma.userAttribute.createMany({
          data: payload.attributes.map((att: any) => ({
            ...att,
            user_id: id,
          })) as Prisma.UserAttributeCreateManyInput[],
        }),
      ]),
    ]);

    return { data: { id } };
  },
};
