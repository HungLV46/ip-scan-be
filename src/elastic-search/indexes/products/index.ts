import { prisma } from '#common/db';
import { elasticsearch } from '#common/elastic-search';
import { getLastIndexedTime, setLastIndexedTime } from '#common/redis';
import { ATTRIBUTES_NAME } from '#root/common/const';
import {
  BuildProductDocumentData,
  ProductDocument,
  ProductDocumentBuilder,
} from './base';
import { productToProductDocumentData } from './utils';

const INDEX_NAME = 'products';

export const save = async (
  data: BuildProductDocumentData,
  upsert = true,
): Promise<void> => {
  try {
    let document: ProductDocument;
    if (upsert) {
      document = data as ProductDocument;
      document.indexed_at = new Date();
    } else {
      document = new ProductDocumentBuilder().buildDocument(data);
    }
    const response = await elasticsearch.bulk({
      body: [
        {
          [upsert ? 'index' : 'create']: {
            _index: INDEX_NAME,
            _id: document.id,
          },
        },
        document,
      ],
    });

    console.log('elasticsearch-products', JSON.stringify(response));
  } catch (error) {
    console.error(
      'elasticsearch-products',
      JSON.stringify({
        topic: 'save',
        upsert,
        data: {
          product: JSON.stringify(data),
        },
        error,
      }),
    );

    throw error;
  }
};

export const getIndexName = (): string => {
  return INDEX_NAME;
};

export const initIndex = async (): Promise<void> => {
  try {
    if (await elasticsearch.indices.exists({ index: INDEX_NAME })) {
      console.info(
        'elasticsearch-products',
        JSON.stringify({
          topic: 'initIndex',
          message: 'Index already exists.',
          indexName: INDEX_NAME,
        }),
      );
    } else {
      console.info(
        'elasticsearch-products',
        JSON.stringify({
          topic: 'initIndex',
          message: 'Creating Index.',
          indexName: INDEX_NAME,
        }),
      );

      const params = {
        aliases: {
          [INDEX_NAME]: {},
        },
        index: `${INDEX_NAME}-${Date.now()}`,
      };

      const createIndexResponse = await elasticsearch.indices.create(params);

      console.info(
        'elasticsearch-products',
        JSON.stringify({
          topic: 'initIndex',
          message: 'Index Created!',
          indexName: INDEX_NAME,
          params,
          createIndexResponse,
        }),
      );
    }
  } catch (error) {
    console.error(
      'elasticsearch-products',
      JSON.stringify({
        topic: 'initIndex',
        message: 'Error.',
        indexName: INDEX_NAME,
        error,
      }),
    );

    throw error;
  }
};

export const querySearch = async (params: {
  keyword?: string;
  limit?: number;
}): Promise<any> => {
  let esQuery = undefined;

  esQuery = {
    query_string: {
      query: `*${params.keyword || ''}*`,
      fields: ['name', 'owner.name'],
    },
  };

  const esSearchParams = {
    index: INDEX_NAME,
    query: esQuery,
    size: params.limit || 10,
  };

  const esResult = await elasticsearch.search<ProductDocument>(esSearchParams);
  const results = esResult.hits.hits.map((hit) => hit._source!);

  return results;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _getAllData = async (): Promise<ProductDocument[]> => {
  const esResult = await elasticsearch.search<ProductDocument>({
    index: INDEX_NAME,
  });
  const results = esResult.hits.hits.map((hit) => hit._source!);
  return results;
};

const getDataByProductId = async (
  productId: number,
): Promise<ProductDocument | null> => {
  const query = {
    bool: {
      must: [
        {
          term: { id: productId },
        },
      ],
    },
  };
  const esResult = await elasticsearch.search<ProductDocument>({
    index: INDEX_NAME,
    query,
    size: 1,
  });

  const results = esResult.hits.hits.map((hit) => hit._source!);
  if (results.length === 0) {
    return null;
  }
  return results[0];
};

export const syncDataMissing = async (): Promise<void> => {
  try {
    const lastIndexedTime = await getLastIndexedTime();

    const postgresData = await prisma.product.findMany({
      where: {
        updated_at: {
          gt: new Date(lastIndexedTime),
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            bio: true,
            email: true,
            wallet_address: true,
            avatar_img: true,
            banner_img: true,
            additional_info: true,
          },
        },
        product_collections: {
          include: {
            collection: {
              select: {
                id: true,
                name: true,
                chain_id: true,
                contract_address: true,
              },
            },
          },
        },
        attributes: { select: { id: true, name: true, value: true } },
      },
    });

    console.log(
      'syncDataMissing-postgresData: ',
      JSON.stringify(postgresData.length),
    );

    for (const data of postgresData) {
      const elasticData = await getDataByProductId(data.id);
      let upsert = false;
      if (!elasticData) {
        upsert = false;
      } else {
        console.log(
          `syncDataMissing product id: ${JSON.stringify(data.updated_at)} with elasticData: ${elasticData.updated_at}`,
        );
        data.created_at = elasticData.created_at;
        upsert = true;
      }

      const document = productToProductDocumentData(data);
      await save(document, upsert);

      // update last indexed time
      if (lastIndexedTime < data.updated_at.getTime()) {
        await setLastIndexedTime(data.updated_at.getTime());
      }

      console.log(
        `syncDataMissing product id: ${JSON.stringify(data.id)} with upsert: ${upsert}`,
      );
    }
  } catch (error) {
    console.error(
      'elasticsearch-products',
      JSON.stringify({
        topic: 'syncDataMissing',
        message: 'Error.',
        indexName: INDEX_NAME,
        error,
      }),
    );
  }
};

export async function queryFilter(params: {
  chainIds?: number[];
  categories?: string[];
  playerInfos?: string[];
  gameStatuses?: string[];
  gameGenres?: string[];
  gameModes?: string[];
  mangaStatuses?: string[];
  mangaGenres?: string[];
  artGenres?: string[];
  limit?: number;
}) {
  let esQuery = undefined;

  esQuery = {
    bool: {
      filter: [],
    },
  };

  if (params.chainIds?.length) {
    (esQuery as any).bool.filter.push({
      terms: { 'product_collections.chain_id': params.chainIds },
    });
  }

  if (params.categories?.length) {
    (esQuery as any).bool.filter.push({
      terms: { category: params.categories },
    });
  }

  if (params.playerInfos?.length) {
    (esQuery as any).bool.filter.push({
      terms: { 'attribute.name': ATTRIBUTES_NAME.PlayerInfo },
    });

    (esQuery as any).bool.filter.push({
      terms: { player_info: params.playerInfos },
    });
  }

  if (params.gameStatuses?.length) {
    (esQuery as any).bool.filter
      .push({
        terms: { 'attribute.name': ATTRIBUTES_NAME.Status },
      })(esQuery as any)
      .bool.filter.push({
        terms: { game_status: params.gameStatuses },
      });
  }

  if (params.gameGenres?.length) {
    (esQuery as any).bool.filter.push({
      terms: { 'attribute.name': ATTRIBUTES_NAME.Genre },
    });

    (esQuery as any).bool.filter.push({
      terms: { game_genre: params.gameGenres },
    });
  }

  if (params.gameModes?.length) {
    (esQuery as any).bool.filter.push({
      terms: { 'attribute.name': ATTRIBUTES_NAME.GameMode },
    });

    (esQuery as any).bool.filter.push({
      terms: { game_mode: params.gameModes },
    });
  }

  if (params.mangaStatuses?.length) {
    (esQuery as any).bool.filter.push({
      terms: { 'attribute.name': ATTRIBUTES_NAME.Status },
    });

    (esQuery as any).bool.filter.push({
      terms: { manga_status: params.mangaStatuses },
    });
  }

  if (params.mangaGenres?.length) {
    (esQuery as any).bool.filter.push({
      terms: { 'attribute.name': ATTRIBUTES_NAME.Genre },
    });

    (esQuery as any).bool.filter.push({
      terms: { manga_genre: params.mangaGenres },
    });
  }

  if (params.artGenres?.length) {
    (esQuery as any).bool.filter.push({
      terms: { 'attribute.name': ATTRIBUTES_NAME.Genre },
    });

    (esQuery as any).bool.filter.push({
      terms: { art_genre: params.artGenres },
    });
  }
  console.log(`esQuery: ${JSON.stringify(esQuery)}`);

  const esSearchParams = {
    index: INDEX_NAME,
    query: esQuery,
    size: params.limit || 10,
  };

  const esResult = await elasticsearch.search<ProductDocument>(esSearchParams);
  const results = esResult.hits.hits.map((hit) => hit._source!);
  const count = (esResult.hits.total as any).value || 0;

  return { results, count };
}
