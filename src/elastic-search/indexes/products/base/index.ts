import { BuildDocumentData, DocumentBuilder } from './../../base/index';
import { BaseDocument } from 'elastic-search/indexes/base';

export interface ProductDocument extends BaseDocument {
  product_id: number; // id in postgres database
  name: string;
  category: string;
  description: string;
  avatar_img: string;
  banner_img: string;
  metadata: JSON;
  owner: string;
  featured_at: Date;
  updated_at: Date;

  collections: CollectionDocument[];
  attributes: ProductAttributeDocument[];
}

interface CollectionDocument {
  id: number;
  name: string;
  chain_id: number;
  contract_address: string;
}

interface ProductAttributeDocument {
  id: number;
  name: string;
  value: string;
}

export interface BuildProductDocumentData extends BuildDocumentData {
  product_id: number; // id in postgres database
  chain_id?: number;
  name: string;
  category: string;
  description: string;
  avatar_img: string;
  banner_img: string;
  metadata: JSON;
  owner: string;
  featured_at: Date;
  updated_at: Date;

  collections: CollectionDocument[];
  attributes: ProductAttributeDocument[];
}

export class ProductDocumentBuilder extends DocumentBuilder {
  public buildDocument(data: BuildProductDocumentData): ProductDocument {
    try {
      const baseDocument = super.buildDocument(data);

      const document = {
        ...baseDocument,
        ...data,
      } as ProductDocument;

      return document;
    } catch (error) {
      console.error(
        'ProductDocumentBuilder',
        JSON.stringify({
          message: `buildDocument Error. product id = ${data.product_id}, error=${error}`,
          data,
          error,
        }),
      );

      throw error;
    }
  }
}
