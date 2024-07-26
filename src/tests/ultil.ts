import Hapi from '@hapi/hapi';
// import { routeApis } from '#apis/index';

export async function initApiServer() {
  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
  });

  return server;
}
