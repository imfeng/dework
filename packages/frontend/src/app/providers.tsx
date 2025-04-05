'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { arbitrum, arbitrumSepolia, hardhat } from 'wagmi/chains'
import { RainbowKitProvider, getDefaultWallets, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// 定義 HashKey Chain
const hashkeyChain = {
  id: 1506,
  name: 'HashKey Chain',
  network: 'hashkey',
  nativeCurrency: {
    decimals: 18,
    name: 'HashKey',
    symbol: 'HSK',
  },
  rpcUrls: {
    public: { http: ['https://mainnet-rpc.hashkey.com'] },
    default: { http: ['https://mainnet-rpc.hashkey.com'] },
  },
  blockExplorers: {
    default: { name: 'HashKeyScan', url: 'https://explorer.hashkey.com' },
  },
}

// 配置網絡
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum, arbitrumSepolia, hashkeyChain, hardhat],
  [publicProvider()]
)

// 配置 RainbowKit
const { connectors } = getDefaultWallets({
  appName: 'Dework',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains,
})

// 配置 Wagmi
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider 
        chains={chains}
        theme={darkTheme({
          accentColor: '#6366f1',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
