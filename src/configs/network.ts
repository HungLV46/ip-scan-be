export const getNetworkName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'mainnet';

    case 5:
      return 'goerli';

    case 10:
      return 'optimism';

    case 56:
      return 'bsc';

    case 137:
      return 'polygon';

    case 42161:
      return 'arbitrum';

    case 11155111:
      return 'sepolia';

    case 8453:
      return 'base';

    case 28122024:
      return 'ancient8-testnet';

    case 888888888:
      return 'ancient8';

    case 84532:
      return 'base-sepolia';

    case 1236:
      return 'aura-serenity';

    case 6321:
      return 'aura-euphoria';

    case 6222:
      return 'aura-xstasy-1';

    default:
      return 'unknown';
  }
};
