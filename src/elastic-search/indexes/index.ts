import * as productsIndex from './products/';

export const initIndexes = async (): Promise<void> => {
  await Promise.all([productsIndex.initIndex()]);
};
