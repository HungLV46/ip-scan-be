import { config } from '#configs/index';
import { Client } from '@elastic/elasticsearch';
import * as productIndex from 'elastic-search/indexes/products';

let elasticsearch: Client;
if (config.elasticsearchUrl) {
  elasticsearch = new Client({
    node: config.elasticsearchUrl,
    requestTimeout: 10000,
  });
}

export const filter = async (query: any) => {
  productIndex.filter(query);
};

export { elasticsearch };
