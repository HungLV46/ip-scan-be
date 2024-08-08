import { BuildProductDocumentData } from './base';

export const productToProductDocumentData = (
  product: any,
): BuildProductDocumentData => {
  const document = {
    product_id: product.id,
    name: product.owner.name,
    category: product.category,
    description: product.description,
    avatar_img: product.avatar_img,
    banner_img: product.banner_img,
    metadata: product.metadata,
    owner: product.owner,
    featured_at: product.featured_at,
    updated_at: product.updated_at,

    collections: product.collections.map((collection: any) => ({
      id: collection.id,
      name: collection.name,
      chain_id: collection.chain_id,
      contract_address: collection.contract_address,
    })),
    attributes: product.attributes.map((attribute: any) => ({
      id: attribute.id,
      name: attribute.name,
      value: attribute.value,
    })),
  } as BuildProductDocumentData;

  return document;
};
