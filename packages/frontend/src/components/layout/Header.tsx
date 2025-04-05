'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/contexts/RoleContext'
import { useState } from 'react'

const navigation = [
  { name: '首頁', href: '/' },
  { name: '儀表板', href: '/dashboard' },
  { name: '市場', href: '/marketplace' },
  { name: '房東', href: '/landlord' },
  { name: '租客', href: '/tenant' },
]

export function Header() {
  const pathname = usePathname()
  const { activeRole, setActiveRole } = useRole()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">DeWork</span>
            </Link>
            <div className="ml-10 hidden space-x-8 lg:flex">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1'
                      : 'text-gray-600 hover:text-indigo-500 hover:border-b-2 hover:border-indigo-300 pb-1'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4 flex items-center">
            <div className="mr-2">
              <button
                onClick={() => setActiveRole(activeRole === 'landlord' ? 'tenant' : 'landlord')}
                className="bg-indigo-100 hover:bg-indigo-200 px-3 py-2 rounded-md text-sm text-indigo-800 font-medium transition-colors"
              >
                {activeRole === 'landlord' ? '切換到租客視圖' : '切換到房東視圖'}
              </button>
            </div>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                return (
                  <div
                    {...(!mounted && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!mounted || !account || !chain) {
                        return (
                          <button onClick={openConnectModal} type="button" className="connect-wallet-button">
                            Connect Wallet
                          </button>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={openChainModal}
                            className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                          >
                            {chain.name}
                          </button>
                          <button 
                            onClick={openAccountModal} 
                            className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
        
        {/* 移動端導航 */}
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium transition-colors ${
                pathname === link.href
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}