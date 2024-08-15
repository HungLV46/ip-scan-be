import Hapi from '@hapi/hapi';
import { filter } from '#common/elastic-search';
import Joi from 'joi';

export const searchProductionRoute: Hapi.ServerRoute = {
  method: 'GET',
  path: '/filter',
  options: {
    description: 'Filter data',
    notes: 'Filter data',
    tags: ['api', 'Product'],
    plugins: {
      'hapi-swagger': {},
    },
    validate: {
      query: Joi.object({
        chainId: Joi.number().optional().example(1),
        category: Joi.string().optional().example('game'),
        playerInfo: Joi.string().optional().example('Singleplayer'),
        gameStatus: Joi.string().optional().example('Alpha'),
        gameGenre: Joi.string().optional().example('Action'),
        gameMode: Joi.string().optional().example('PvE'),
        mangaStatus: Joi.string().optional().example('Beta'),
        mangaGenre: Joi.string().optional().example('Survival'),
        artGenre: Joi.string().optional().example('Romance'),
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
    const query = request.query;
    console.log('request.query: ', request.query);
    return filter(query);
  },
};
