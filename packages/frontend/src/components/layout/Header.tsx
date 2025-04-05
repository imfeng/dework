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
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-indigo-600">DeWork</span>
            </Link>
            <div className="ml-10 hidden space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium ${
                    pathname === link.href
                      ? 'text-indigo-600'
                      : 'text-gray-500 hover:text-indigo-500'
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
                className="bg-indigo-100 px-3 py-2 rounded-md text-sm text-indigo-800 font-medium"
              >
                {activeRole === 'landlord' ? '切換到租客視圖' : '切換到房東視圖'}
              </button>
            </div>
            <ConnectButton />
          </div>
        </div>
        
        {/* 移動端導航 */}
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {navigation.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-base font-medium ${
                pathname === link.href
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-indigo-500'
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