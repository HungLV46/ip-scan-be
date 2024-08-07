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
import { initIndexes } from 'elastic-search/indexes';

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
        documentationPage: true,
        documentationPath: '/docs', // This sets the URL path for the Swagger UI
      },
    },
  ]);
}

export function routeApis(server: Hapi.Server): void {
  Object.values(routes).forEach((route) => server.route(route));
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
  });

  await registerPlugins(server);
  await registerAdapters(server);
  await initIndexes();
  await registerJobs();

  routeApis(server);

  await server.start();
}

process.on('unhandledRejection', (error: any) => {
  logger.error(error, 'unhandledRejection');
});

initServer();
