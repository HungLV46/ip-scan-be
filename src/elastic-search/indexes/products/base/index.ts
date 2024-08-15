import { BuildDocumentData, DocumentBuilder } from './../../base/index';
import { BaseDocument } from '#root/elastic-search/indexes/base/index';

export interface ProductDocument extends BaseDocument {
  name: string;
  category: string;
  description: string;
  avatar_img: string;
  banner_img: string;
  metadata: JSON;
  owner: UserDocument;
  featured_at: Date;
  updated_at: Date;

  product_collections: CollectionDocument[];
  attributes: ProductAttributeDocument[];
}

interface UserDocument {
  id: number;
  name: string;
  bio: string;
  email: string;
  wallet_address: string;
  avatar_img: string;
  banner_img: string;
  additional_info: JSON;
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
  chain_id?: number;
  name: string;
  category: string;
  description: string;
  avatar_img: string;
  banner_img: string;
  metadata: JSON;
  owner: UserDocument;
  featured_at: Date;
  updated_at: Date;

  product_collections: CollectionDocument[];
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
          message: `buildDocument Error. product id = ${data.id}, error=${error}`,
          data,
          error,
        }),
      );

      throw error;
    }
  }
}
