'use client'

import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { AuthProvider } from '@/contexts/AuthContext'
import { KycProvider } from '@/contexts/KycContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { RoleProvider } from '@/contexts/RoleContext'
import { config, chains } from '@/config/wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: any) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <AuthProvider>
          <KycProvider>
            <NotificationProvider>
              <RoleProvider>
                <Component {...pageProps} />
              </RoleProvider>
            </NotificationProvider>
          </KycProvider>
        </AuthProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
} 