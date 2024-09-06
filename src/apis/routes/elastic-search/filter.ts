import Hapi from '@hapi/hapi';
import { filter } from '#common/elastic-search';
import Joi from 'joi';
import { transformToArray } from '#root/common/utils';

export const filterProductionRoute: Hapi.ServerRoute = {
  method: 'GET',
  path: '/filter',
  options: {
    description: 'Filter data',
    notes: 'Filter data',
    tags: ['api', 'product', 'filter'],
    plugins: {
      'hapi-swagger': {},
    },
    validate: {
      query: Joi.object({
        chainIds: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        categories: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        playerInfos: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        gameStatuses: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        gameGenres: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        gameModes: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        mangaStatuses: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        mangaGenres: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        artGenres: Joi.alternatives().try(
          Joi.array().items(Joi.string()),
          Joi.string(),
        ),
        limit: Joi.number().max(100).default(10).example(10),
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
    const query = request.query as any;

    if (query.chainIds) {
      query.chainIds = transformToArray(query.chainIds);
    }

    if (query.categories) {
      query.categories = transformToArray(query.categories);
    }

    if (query.playerInfos) {
      query.playerInfos = transformToArray(query.playerInfos);
    }

    if (query.gameStatuses) {
      query.gameStatuses = transformToArray(query.gameStatuses);
    }

    if (query.gameGenres) {
      query.gameGenres = transformToArray(query.gameGenres);
    }

    if (query.gameModes) {
      query.gameModes = transformToArray(query.gameModes);
    }

    if (query.mangaStatuses) {
      query.mangaStatuses = transformToArray(query.mangaStatuses);
    }

    if (query.mangaGenres) {
      query.mangaGenres = transformToArray(query.mangaGenres);
    }

    if (query.artGenres) {
      query.artGenres = transformToArray(query.artGenres);
    }

    console.log('request.query: ', request.query);
    return filter(query);
  },
};
