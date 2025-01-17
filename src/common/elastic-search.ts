import { config } from '#configs/index';
import { Client } from '@elastic/elasticsearch';
import * as productIndex from '#root/elastic-search/indexes/products/index';

let elasticsearch: Client;
if (config.elasticsearchUrl) {
  elasticsearch = new Client({
    node: config.elasticsearchUrl,
    requestTimeout: 10000,
  });
}

export const queryProducts = async (params: any) => {
  return await productIndex.querySearch(params);
};

export { elasticsearch };
