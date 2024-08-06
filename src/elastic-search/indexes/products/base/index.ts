import { config } from '#configs/index';
import { getNetworkName } from '#configs/network';
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
  owner_id: number;
  featured_at: Date;
  created_at: Date;

  stat_total_collection: number;
  stat_total_items: number;
  stat_total_activities: number;

  stat_total_volume_all: number;
  stat_total_volume_12m: number;
  stat_total_volume_30d: number;
  stat_total_volume_7d: number;

  stat_floor_price_all: number;
  stat_floor_price_12m: number;
  stat_floor_price_30d: number;
  stat_floor_price_7d: number;

  collections: CollectionDocument[];
  attributes: ProductAttributeDocument[];
}

interface ProductAttributeDocument {
  id: number;
  name: string;
  value: string;
}

interface CollectionDocument {
  id: number;
  chain_id: string;
  contract_address: string;
  metadata: JSON;
  nfts: NftDocument[];
}
interface NftDocument {
  id: number;
  token_id: string;
  metadata: JSON;

  ip_assets: IpAssetDocument[];
}

interface IpAssetDocument {
  id: number;
  chain_id: string;
  contract_address: string;
  parent_ipasset_id: number;
  nft_id: number;
  metadata: JSON;

  licenses: LicenseDocument[];
}

interface LicenseDocument {
  id: number;
  name: string;
  metadata: JSON;
}

export interface BuildProductDocumentData extends BuildDocumentData {
  product_id: number; // id in postgres database
  name: string;
  category: string;
  description: string;
  avatar_img: string;
  banner_img: string;
  metadata: JSON;
  owner_id: number;
  featured_at: Date;
  created_at: Date;

  stat_total_collection: number;
  stat_total_items: number;
  stat_total_activities: number;

  stat_total_volume_all: number;
  stat_total_volume_12m: number;
  stat_total_volume_30d: number;
  stat_total_volume_7d: number;

  stat_floor_price_all: number;
  stat_floor_price_12m: number;
  stat_floor_price_30d: number;
  stat_floor_price_7d: number;

  collections: CollectionDocument[];
  attributes: ProductAttributeDocument[];
}

export class ProductDocumentBuilder extends DocumentBuilder {
  public buildDocument(data: BuildProductDocumentData): ProductDocument {
    try {
      const baseDocument = super.buildDocument(data);

      const document = {
        ...baseDocument,
        chain: {
          id: config.chainId,
          name: getNetworkName(),
        },

        name: data.name,
        category: data.category,
        description: data.description,
        avatar_img: data.avatar_img,
        banner_img: data.banner_img,
        metadata: data.metadata,
        owner_id: data.owner_id,
        featured_at: data.featured_at,

        stat_total_collection: data.stat_total_collection,
        stat_total_items: data.stat_total_items,
        stat_total_activities: data.stat_total_activities,

        stat_total_volume_all: data.stat_total_volume_all,
        stat_total_volume_12m: data.stat_total_volume_12m,
        stat_total_volume_30d: data.stat_total_volume_30d,
        stat_total_volume_7d: data.stat_total_volume_7d,

        stat_floor_price_all: data.stat_floor_price_all,
        stat_floor_price_12m: data.stat_floor_price_12m,
        stat_floor_price_30d: data.stat_floor_price_30d,
        stat_floor_price_7d: data.stat_floor_price_7d,

        collections: data.collections,
        attributes: data.attributes,
      } as ProductDocument;

      return document;
    } catch (error) {
      console.error(
        'CollectionDocumentBuilder',
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
