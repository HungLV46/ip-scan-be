import { config } from '#configs/index';
import { getNetworkName } from '#configs/network';

export interface BaseDocument {
  chain: {
    id: number;
    name: string;
  };
  id: string;
  indexed_at: Date;
  created_at: Date;
}

export interface BuildDocumentData {
  id: string;
}

export abstract class DocumentBuilder {
  public buildDocument(data: BuildDocumentData): BaseDocument {
    return {
      chain: {
        id: config.chainId,
        name: getNetworkName(),
      },
      id: data.id,
      indexed_at: new Date(),
      created_at: new Date(),
    };
  }
}
