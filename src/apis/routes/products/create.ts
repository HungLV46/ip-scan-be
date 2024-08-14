import Hapi from '@hapi/hapi';
import { prisma } from '#common/db';
import Joi from 'joi';
import { Prisma } from '@prisma/client';

export const createProductionRoute: Hapi.ServerRoute = {
  method: 'POST',
  path: '/products',
  options: {
    description: 'Create a new product',
    notes: 'Create product, its attributes and collections',
    tags: ['api', 'product', 'create'],
    plugins: { 'hapi-swagger': {} },
    validate: {
      payload: Joi.object({
        name: Joi.string().required().example('Product name'),
        owner_id: Joi.number().required().example(1),
        avatar_img: Joi.string()
          .required()
          .example('https://loremflickr.com/640/480?lock=1572275828555776'),
        banner_img: Joi.string()
          .required()
          .example('https://loremflickr.com/640/480?lock=1572275828555776'),
        category: Joi.string().required().example('game'),
        description: Joi.string().required().example('description of product'),
        featured: Joi.boolean().default(false),
        attributes: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required().example('attribute name'),
              value: Joi.string().required().example('attribute value'),
            }),
          )
          .default([]),
        metadata: Joi.object({
          previews: Joi.array()
            .items(Joi.string())
            .default([])
            .example([
              'https://loremflickr.com/640/480?lock=1572275828555776',
              'https://loremflickr.com/640/480?lock=1572275828555776',
            ]),
          cta_url: Joi.string().default('').example('https://www.google.com'),
        }).required(),
        collections: Joi.array()
          .items(
            Joi.object({
              chain_id: Joi.string().required(),
              contract_address: Joi.string().required(),
            }),
          )
          .default([])
          .example([
            { chain_id: '1', contract_address: '0x1234x' },
            { chain_id: '2', contract_address: '0x1233x' },
          ]),
      }),
    },
    // TODO validate response: { schema: Joi.object({}) }
  },
  handler: async (request: Hapi.Request) => {
    const payload = request.payload as any;

    // create new product
    const productData = {
      name: payload.name,
      owner: { connect: { id: payload.owner_id } },
      avatar_img: payload.avatar_img,
      banner_img: payload.banner_img,
      category: payload.category,
      description: payload.description,
      metadata: payload.metadata,
      attributes: { create: payload.attributes },
      featured_at: payload.featured ? new Date() : undefined,
    } as Prisma.ProductCreateInput;
    const product = await prisma.product.create({ data: productData });

    // create new collections
    const existingCollections = await prisma.collection.findMany({
      where: {
        OR: payload.collections as any, // TODO change to where in
      },
    });
    const newCollectionData = payload.collections.filter((item: any) => {
      return !existingCollections.find(
        // exceptable with low number of existing collections
        (col: any) =>
          col.chain_id === item.chain_id &&
          col.contract_address === item.contract_address,
      );
    });
    let newCollections = [] as Prisma.CollectionGetPayload<any>[];
    if (newCollectionData.length > 0) {
      newCollections = await prisma.collection.createManyAndReturn({
        data: newCollectionData.map((col: any) => ({
          chain_id: col.chain_id,
          contract_address: col.contract_address,
        })) as Prisma.CollectionCreateManyInput[],
      });
    }

    // create new product - collection relation
    await prisma.productCollection.createMany({
      data: [...existingCollections, ...newCollections].map((col: any) => ({
        product_id: product.id,
        collection_id: col.id,
      })) as Prisma.ProductCollectionCreateManyInput[],
    });

    return { data: { id: product.id } };
  },
};
