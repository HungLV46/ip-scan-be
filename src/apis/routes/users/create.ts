import Hapi from '@hapi/hapi';
import { prisma } from '#common/db';
import Joi from 'joi';
import { Prisma } from '@prisma/client';

export const createUserRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/users',
  options: {
    description: 'Create a new user',
    notes: 'Create user and its attributes',
    tags: ['api', 'user', 'create'],
    plugins: { 'hapi-swagger': {} },
    validate: {
      payload: Joi.object({
        name: Joi.string().required().example('User name'),
        bio: Joi.string().required().example('Bio'),
        email: Joi.string().required().email().example('Hqk7S@example.com'),
        wallet_address: Joi.string().required().example('0x1234567890'),
        avatar_img: Joi.string()
          .required()
          .example('https://loremflickr.com/640/480?lock=1572275828555776'),
        banner_img: Joi.string()
          .required()
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
            .items(
              Joi.object({
                name: Joi.string().required().example('twitter'),
                url: Joi.string().required().example('https://twitter.com'),
              }),
            )
            .default([]),
        })
          .optional()
          .default({}),
      }),
    },
    // TODO validate response: { schema: Joi.object({}) }
  },
  handler: async (request: Hapi.Request) => {
    const payload = request.payload as any;

    // create new user
    const userData = {
      name: payload.name,
      bio: payload.bio,
      email: payload.email,
      wallet_address: payload.wallet_address,
      avatar_img: payload.avatar_img,
      banner_img: payload.banner_img,
      additional_info: payload.additional_info,
      attributes: { create: payload.attributes },
    } as Prisma.UserCreateInput;
    const user = await prisma.user.create({ data: userData });

    return { data: { id: user.id } };
  },
};
