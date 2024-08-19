import Hapi from '@hapi/hapi';

import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import HapiPino from 'hapi-pino';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HapiAdapter } from '@bull-board/hapi';

import { config } from '#configs/index';
import { loggerSetting, logger } from '#common/loggger';
import * as routes from './routes';
import { getAllQueues } from '#jobs/index';
import * as elasticSearchJob from '#jobs/elastic-search/elastic-search-job';
import { initIndexes } from '#root/elastic-search/indexes/index';
import { Prisma } from '@prisma/client';
import Boom from '@hapi/boom';

async function registerPlugins(server: Hapi.Server): Promise<void> {
  // log
  await server.register({
    plugin: HapiPino,
    options: {
      ...loggerSetting,
      redact: ['req.headers.authorization'], // Redact Authorization headers, see https://getpino.io/#/docs/redaction
    },
  });

  // swagger
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Test API Documentation',
          version: '1.0.0',
        },
        schemes: ['http', 'https'],
        documentationPage: true,
        documentationPath: '/docs', // This sets the URL path for the Swagger UI
      },
    },
  ]);
}

export function routeApis(server: Hapi.Server): void {
  Object.values(routes).forEach((route) => server.route(route));
}

function setupServerResponseTransformation(server: Hapi.Server): void {
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    // DB: unique constraint
    if (response instanceof Prisma.PrismaClientKnownRequestError) {
      if (response.code === 'P2002') {
        throw Boom.badRequest(
          `${response.meta?.modelName} (${((response.meta?.target as Array<string>) || []).join(',')}) must be unique!`,
        );
      }
    }

    return h.continue;
  });
}

async function registerAdapters(server: Hapi.Server) {
  // bull board
  const serverAdapter = new HapiAdapter();
  serverAdapter.setBasePath('/bullboard');
  createBullBoard({
    queues: getAllQueues().map((queue) => new BullMQAdapter(queue)),
    serverAdapter,
  });
  await server.register(serverAdapter.registerPlugin(), {
    routes: { prefix: '/bullboard' },
  });
}

async function registerJobs() {
  await elasticSearchJob.addToQueue();
}

async function initServer(): Promise<void> {
  const server: Hapi.Server = Hapi.server({
    port: config.port,
    host: config.host,
    debug: false,
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          // https://github.com/hapijs/hapi/issues/3658
          // as mentioned in above "Input validation errors are no longer passed directly from joi to the client."
          // So a general message will be returned, which doesn't sufficient to debug API call
          if (err) throw Boom.boomify(err); // TODO check if resposne error is HTML escaped
        },
      },
    },
  });

  await registerPlugins(server);
  await registerAdapters(server);
  await initIndexes();
  await registerJobs();

  routeApis(server);
  setupServerResponseTransformation(server);

  await server.start();
}

process.on('unhandledRejection', (error: any) => {
  logger.error(error, 'unhandledRejection');
});

initServer();
