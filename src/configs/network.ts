import { defineChain } from 'viem';

export const aura_testnet = defineChain({
  id: 1235,
  name: 'Aura EVM Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'test-Aura',
    symbol: 'tAURA',
  },
  testnet: true,
  rpcUrls: {
    default: {
      http: ['https://rpc.dev.aura.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Testnet',
      url: 'https://explorer.dev.aura.network/',
    },
  },
});

export const aura_serenity = defineChain({
  id: 1236,
  name: 'Aura EVM Serenity',
  nativeCurrency: {
    decimals: 18,
    name: 'test-Aura',
    symbol: 'AURA',
  },
  testnet: true,
  rpcUrls: {
    default: {
      http: ['https://rpc.serenity.aura.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Serenity Testnet',
      url: 'https://serenity.aurascan.io/',
    },
  },
});

export const aura_euphoria = defineChain({
  id: 6321,
  name: 'Aura EVM Euphoria',
  nativeCurrency: {
    decimals: 18,
    name: 'test-EAura',
    symbol: 'eAURA',
  },
  testnet: true,
  rpcUrls: {
    default: {
      http: ['https://rpc.euphoria.aura.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Euphoria Testnet',
      url: 'https://euphoria.aurascan.io/',
    },
  },
});

export const aura_mainnet = defineChain({
  id: 6322,
  name: 'Aura EVM Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Aura',
    symbol: 'AURA',
  },
  testnet: true,
  rpcUrls: {
    default: {
      http: ['https://rpc.aura.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Aura Explorer (Aurascan)',
      url: 'https://aurascan.io/',
    },
  },
});

type NetworkSetting = {
  elasticSearch?: {
    numberOfShards?: number;
    indexes?: { [index: string]: ElasticsearchIndexSettings };
  };
};

type ElasticsearchIndexSettings = {
  numberOfShards?: number;
  disableMappingsUpdate?: boolean;
  configName?: string;
};

const defaultNetworkSettings: NetworkSetting = {
  elasticSearch: {
    numberOfShards: 2,
    indexes: {
      products: {
        numberOfShards: 2,
        disableMappingsUpdate: false,
      },
    },
  },
};

export const getNetworkSettings = () => {
  return defaultNetworkSettings;
};
