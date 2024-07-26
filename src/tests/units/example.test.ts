import * as Code from '@hapi/code';
import { Server } from '@hapi/hapi';
import * as Lab from '@hapi/lab';

import { initApiServer } from '../ultil';

const { expect } = Code;
const lab = Lab.script();

const { afterEach, beforeEach, describe, it } = lab;

describe('Test example API', () => {
  let server: Server;

  beforeEach(async () => {
    server = await initApiServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('Resposne with status 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/',
    });
    expect(res.statusCode).to.equal(404);
  });
});

export { lab };
