import { createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { arbitrum, arbitrumSepolia, hardhat, Chain } from 'wagmi/chains';
import { connectorsForWallets } from 'connectkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet
} from 'connectkit/wallets';

// Custom HashKey Chain configuration
const hashkeyChain: Chain = {
  id: 1506,
  name: 'HashKey Chain',
  network: 'hashkey',
  nativeCurrency: {
    name: 'HashKey Token',
    symbol: 'HSK',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-mainnet.hashkey.com'],
    },
    public: {
      http: ['https://rpc-mainnet.hashkey.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashKey Explorer',
      url: 'https://explorer.hashkey.com',
    },
  },
  testnet: false,
};

// Configure supported chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrumSepolia, arbitrum, hardhat, hashkeyChain],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_API_KEY || 'demo' }),
    publicProvider()
  ]
);

// Configure connectors
const connectors = connectorsForWallets([
  {
    groupName: '推薦',
    wallets: [
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains }),
      walletConnectWallet({ chains }),
      injectedWallet({ chains }),
    ],
  },
]);

// Create Wagmi configuration
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains }; 