import { BuildProductDocumentData } from './base';

export const productToProductDocumentData = (
  product: any,
): BuildProductDocumentData => {
  const document = {
    product_id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    avatar_img: product.avatar_img,
    banner_img: product.banner_img,
    metadata: product.metadata,
    owner: product.owner.name,
    featured_at: product.featured_at,
    created_at: product.created_at,

    attributes: product.attributes.map((attribute: any) => ({
      id: attribute.id,
      name: attribute.name,
      value: attribute.value,
    })),
  } as BuildProductDocumentData;

  return document;
};
