'use client'

import { useState, useEffect } from 'react'
import './globals.css'
import { Providers } from './providers'
import { useRouter } from 'next/navigation'
import { RoleProvider } from '@/contexts/RoleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { KycProvider } from '@/contexts/KycContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>
          <AuthProvider>
            <KycProvider>
              <RoleProvider>
                <main>{children}</main>
              </RoleProvider>
            </KycProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
