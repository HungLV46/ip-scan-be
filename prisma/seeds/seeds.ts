import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as _ from 'underscore';
import ipassetsData from './ipassets.json';

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
              name: 'status',
              value: ['Prototype', 'Alpha', 'Beta', 'Final Product'][index],
              product_id: product.id,
            }),
          ),
          ..._.range(0, faker.number.int({ min: 0, max: 2 })).map(
            (index: number) => ({
              name: 'player info',
              value: ['Singleplayer', 'Multiplayer', 'Massive Multiplayer'][
                index
              ],
              product_id: product.id,
            }),
          ),
          ..._.range(0, faker.number.int({ min: 0, max: 3 })).map(
            (index: number) => ({
              name: 'genre',
              value: ['Action', 'Romance', 'Survival', 'Telltale'][index],
              product_id: product.id,
            }),
          ),
          ..._.range(0, faker.number.int({ min: 0, max: 2 })).map(
            (index: number) => ({
              name: 'game mode',
              value: ['PvE', 'PvP', 'Cooperative'][index],
              product_id: product.id,
            }),
          ),
        ],
      });
    }),
  );

  const collectionAddressToIpassets = _.groupBy(
    ipassetsData,
    (ipasset) => ipasset.nftMetadata.tokenContract,
  );
  const collectionAddresses = Object.keys(collectionAddressToIpassets);
  // Create Collections
  const collections = await Promise.all(
    products.map(async (product: any, index: number) => {
      return prisma.collection
        .create({
          data: {
            chain_id: '11155111',
            contract_address: collectionAddresses[index],
            metadata: {
              rarity: faker.helpers.arrayElement(['common', 'rare', 'epic']),
              releaseDate: faker.date.future(),
            },
          },
        })
        .then(async (response) => {
          await prisma.productCollection.create({
            data: {
              product_id: product.id,
              collection_id: response.id,
            },
          });

          return response;
        });
    }),
  );

  // Create NFTs
  const nfts = await Promise.all(
    collections
      .map((collection) => {
        const nftData = collectionAddressToIpassets[
          collection.contract_address
        ].map((ipasset) => ipasset.nftMetadata);
        return nftData.map((nft) =>
          prisma.nft.create({
            data: {
              collection_id: collection.id,
              chain_id: collection.chain_id,
              contract_address: collection.contract_address,
              token_id: nft.tokenId,
              metadata: {
                attribute: faker.word.sample(),
              },
            },
          }),
        );
      })
      .flat(),
  );

  const generateKey = (address: string, id: string) => address + '|' + id;
  const tokenKeyToIpassets = _.groupBy(ipassetsData, (ipasset) =>
    generateKey(ipasset.nftMetadata.tokenContract, ipasset.nftMetadata.tokenId),
  );
  // Create IPAssets
  await Promise.all(
    nfts.map((nft) => {
      return prisma.ipasset.createMany({
        data: [
          {
            chain_id: '11155111',
            contract_address:
              tokenKeyToIpassets[
                generateKey(nft.contract_address, nft.token_id)
              ][0].id,
            nft_id: nft.id,
            metadata:
              tokenKeyToIpassets[
                generateKey(nft.contract_address, nft.token_id)
              ][0].nftMetadata,
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
