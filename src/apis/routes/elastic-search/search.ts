import Hapi from '@hapi/hapi';
import { query } from '#common/elastic-search';
import Joi from 'joi';

export const searchProductionRoute: Hapi.ServerRoute = {
  method: 'GET',
  path: '/search',
  options: {
    description: 'Search product by name, owner',
    notes: 'Search product by name, owner',
    tags: ['api', 'Product'],
    plugins: {
      'hapi-swagger': {},
    },
    validate: {
      query: Joi.object({
        name: Joi.string().required().example('Product name'),
      }),
    },
    cache: {
      // client side cache for 30s
      expiresIn: 30 * 1000,
      privacy: 'private',
    },
    // response: { schema: Joi.object({}) },
  },
  handler: (request: Hapi.Request) => {
    const { name } = request.query;
    console.log('request.query', request.query);
    return query({ keyword: name });
  },
};
