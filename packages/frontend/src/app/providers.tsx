'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// TODO: Replace with your WalletConnect project ID
// Get one from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Dework',
  projectId,
  chains,
})

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
} 