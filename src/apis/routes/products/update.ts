import Hapi from '@hapi/hapi';
import { prisma } from '#common/db';
import { Prisma } from '@prisma/client';
import Joi from 'joi';

export const updateProductionRoute: Hapi.ServerRoute = {
  method: 'PUT',
  path: '/products/{id}',
  options: {
    description: 'Update product by its ID',
    notes: 'Update product, its attributes and collections',
    tags: ['api', 'product', 'update'],
    plugins: { 'hapi-swagger': {} },
    validate: {
      params: Joi.object({
        id: Joi.number().required().example(1),
      }),
      payload: Joi.object({
        // TODO make optional
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
    // response: { schema: Joi.object({}) }
  },
  handler: async (request: Hapi.Request) => {
    const payload = request.payload as any;
    const product = {
      name: payload.name,
      owner: { connect: { id: payload.owner_id } },
      avatar_img: payload.avatar_img,
      banner_img: payload.banner_img,
      category: payload.category,
      description: payload.description,
      metadata: payload.metadata,
      featured_at: payload.featured ? new Date() : undefined,
    } as Prisma.ProductUpdateInput;
    const id = request.params.id;

    // create new collections
    const existingCollections = await prisma.collection.findMany({
      where: { OR: payload.collections as any /** TODO use where in */ },
    });
    const newCollectionData = payload.collections.filter((item: any) => {
      return !existingCollections.find(
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

    // update product & create new product - collection relation
    await Promise.all([
      prisma.product.update({
        where: { id: Number(request.params.id) },
        data: product,
      }),
      prisma.$transaction([
        prisma.productAttribute.deleteMany({ where: { product_id: id } }),
        prisma.productAttribute.createMany({
          data: payload.attributes.map((att: any) => ({
            ...att,
            product_id: id,
          })) as Prisma.ProductAttributeCreateManyInput[],
        }),
      ]),
      prisma.$transaction([
        prisma.productCollection.deleteMany({ where: { product_id: id } }),
        prisma.productCollection.createMany({
          data: [...existingCollections, ...newCollections].map((col: any) => ({
            product_id: id,
            collection_id: col.id,
          })) as Prisma.ProductCollectionCreateManyInput[],
        }),
      ]),
    ]);

    return { data: { id } };
  },
};
