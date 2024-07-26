import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

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
            twitter: faker.internet.userName(),
            github: faker.internet.userName(),
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
          category: faker.commerce.department(),
          description: faker.lorem.paragraph(),
          avatar_img: faker.image.url(),
          banner_img: faker.image.url(),
          metadata: {
            warranty: `${faker.number.int({ min: 1, max: 5 })} years`,
            brand: faker.company.name(),
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
          { name: 'Color', value: faker.color.human(), product_id: product.id },
          {
            name: 'Size',
            value: faker.commerce.productAdjective(),
            product_id: product.id,
          },
          {
            name: 'Material',
            value: faker.commerce.productMaterial(),
            product_id: product.id,
          },
          {
            name: 'Weight',
            value: `${faker.number.int({ min: 1, max: 100 })}kg`,
            product_id: product.id,
          },
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
