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
  chain_id?: number;
}

export abstract class DocumentBuilder {
  public buildDocument(data: BuildDocumentData): BaseDocument {
    const chainId = data.chain_id ?? config.chainId;
    return {
      chain: {
        id: chainId,
        name: getNetworkName(chainId),
      },
      id: data.id,
      indexed_at: new Date(),
      created_at: new Date(),
    };
  }
}
