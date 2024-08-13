import { BuildProductDocumentData } from './base';

export const productToProductDocumentData = (
  product: any,
): BuildProductDocumentData => {
  return product as BuildProductDocumentData;
};
