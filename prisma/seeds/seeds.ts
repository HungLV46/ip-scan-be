import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as _ from 'underscore';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      return prisma.user.create({
        data: {
          name: faker.person.fullName(),
          bio: faker.lorem.sentence(),
          email: faker.internet.email(),
          wallet_address: faker.finance.ethereumAddress(),
          avatar_img: faker.image.avatar(),
          banner_img: faker.image.url(),
          additional_info: {
            discord: faker.internet.url(),
            x: faker.internet.url(),
            telegram: faker.internet.url(),
          },
        },
      });
    }),
  );

  // Create Products
  const products = await Promise.all(
    users.map((user) => {
      return prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          category: faker.helpers.arrayElement([
            'game',
            'manga',
            'anime',
            'art',
          ]),
          description: faker.lorem.paragraph(),
          avatar_img: faker.image.url(),
          banner_img: faker.image.url(),
          metadata: {
            main_preview: faker.image.url(),
            other_previews: _.range(
              0,
              faker.number.int({ min: 0, max: 6 }),
            ).map(() => faker.image.url()),
          },
          owner_id: user.id,
        },
      });
    }),
  );

  // Create Product Attributes
  await Promise.all(
    products.map((product) => {
      return prisma.productAttribute.createMany({
        data: [
          ..._.range(0, faker.number.int({ min: 0, max: 4 })).map(
            (index: number) => ({
              name: 'Chain',
              value: [
                'Aura network',
                'Ethereum',
                'Arbitrum One',
                'Avalanche C-Chain',
                'Blast',
              ][index],
              product_id: product.id,
            }),
          ),
          {
            name: 'Game status',
            value: faker.helpers.arrayElement([
              'Prototype',
              'Alpha',
              'Beta',
              'Final Product',
            ]),
            product_id: product.id,
          },
          ..._.range(0, faker.number.int({ min: 0, max: 2 })).map(
            (index: number) => ({
              name: 'Player info',
              value: ['Singleplayer', 'Multiplayer', 'Massive Multiplayer'][
                index
              ],
              product_id: product.id,
            }),
          ),
          ..._.range(0, faker.number.int({ min: 0, max: 3 })).map(
            (index: number) => ({
              name: 'Genre',
              value: ['Action', 'Romance', 'Survival', 'Telltale'][index],
              product_id: product.id,
            }),
          ),
          ..._.range(0, faker.number.int({ min: 0, max: 2 })).map(
            (index: number) => ({
              name: 'Game mode',
              value: ['PvE', 'PvP', 'Cooperative'][index],
              product_id: product.id,
            }),
          ),
        ],
      });
    }),
  );

  // Create Collections
  const collections = await Promise.all(
    products.map((product) => {
      return prisma.collection.create({
        data: {
          chain_id: faker.string.uuid(),
          contract_address: faker.finance.ethereumAddress(),
          product_id: product.id,
          metadata: {
            rarity: faker.helpers.arrayElement(['common', 'rare', 'epic']),
            releaseDate: faker.date.future(),
          },
        },
      });
    }),
  );

  // Create NFTs
  const nfts = await Promise.all(
    collections.map((collection) => {
      return prisma.nft.create({
        data: {
          collection_id: collection.id,
          token_id: faker.string.uuid(),
          metadata: {
            attribute: faker.word.sample(),
          },
        },
      });
    }),
  );

  // Create IPAssets
  await Promise.all(
    nfts.map((nft) => {
      return prisma.ipasset.createMany({
        data: [
          {
            chain_id: faker.string.uuid(),
            contract_address: faker.finance.ethereumAddress(),
            token_id: faker.string.uuid(),
            nft_id: nft.id,
            metadata: { attr: faker.word.sample() },
          },
        ],
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
