import { MappingTypeMapping } from '@elastic/elasticsearch/lib/api/types';

export const CONFIG = {
  mappings: {
    dynamic: 'false',
    properties: {
      id: {
        type: 'keyword',
      },
      name: {
        type: 'text',
      },
      category: {
        type: 'text',
      },
      description: {
        type: 'text',
      },
      avatar_img: {
        type: 'text',
      },
      banner_img: {
        type: 'text',
      },
      owner: {
        properties: {
          id: {
            type: 'long',
          },
          name: {
            type: 'text',
          },
          bio: {
            type: 'text',
          },
          email: {
            type: 'text',
          },
          wallet_address: {
            type: 'text',
          },
          avatar_img: {
            type: 'text',
          },
          banner_img: {
            type: 'text',
          },
        },
      },
      featured_at: {
        type: 'date',
      },
      created_at: {
        type: 'date',
      },
      updated_at: {
        type: 'date',
      },

      product_collections: {
        type: 'nested',
        properties: {
          collection: {
            type: 'nested',
            properties: {
              id: {
                type: 'keyword',
              },
              name: {
                type: 'keyword',
              },
              chain_id: {
                type: 'keyword',
              },
              contract_address: {
                type: 'keyword',
              },
            },
          },
        },
      },

      attributes: {
        type: 'nested',
        properties: {
          id: {
            type: 'keyword',
          },
          name: {
            type: 'keyword',
          },
          value: {
            type: 'keyword',
          },
        },
      },
    },
  } as MappingTypeMapping,
};
