import { prisma } from '#common/db';
import { elasticsearch } from '#common/elastic-search';
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
    const document = new ProductDocumentBuilder().buildDocument(data);
    const response = await elasticsearch.create({
      index: INDEX_NAME,
      id: document.id,
      document,
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

export const query = async (params: {
  keyword?: string;
  limit?: number;
}): Promise<any> => {
  let esQuery = undefined;

  esQuery = {
    bool: {
      filter: [
        {
          term: { category: params.keyword },
        },
      ],
    },
  };

  const esSearchParams = {
    index: INDEX_NAME,
    query: esQuery,
    size: params.limit,
  };

  const esResult = await elasticsearch.search<ProductDocument>(esSearchParams);
  console.log('elasticsearch-products', JSON.stringify(esResult));

  return { esResult };
};

export const getAllData = async (): Promise<ProductDocument[]> => {
  const esResult = await elasticsearch.search<any>({
    index: INDEX_NAME,
  });
  const results = esResult.hits.hits.map((hit) => hit._source!);
  return results;
};

export const syncDataMissing = async (): Promise<void> => {
  try {
    const productIds = (await getAllData()).map((data) => data.product_id);
    console.log(
      'syncDataMissing-product indexed: ',
      JSON.stringify(productIds),
    );
    const postgresData = await prisma.product.findMany({
      where: {
        id: {
          notIn: productIds,
        },
      },
      include: {
        owner: true,
        attributes: true,
      },
    });

    console.log(
      'syncDataMissing-postgresData: ',
      JSON.stringify(postgresData.length),
    );

    if (postgresData.length === 0) {
      return;
    }

    const documents = postgresData
      .map((data) => productToProductDocumentData(data))
      .map((data) => new ProductDocumentBuilder().buildDocument(data));

    await elasticsearch.bulk({
      body: documents.flatMap((document) => [
        { ['create']: { _index: INDEX_NAME, _id: document.id } },
        document,
      ]),
    });
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
