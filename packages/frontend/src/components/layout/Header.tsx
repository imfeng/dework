'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Tenant', href: '/tenant' },
  { name: 'Landlord', href: '/landlord' },
  { name: 'Admin', href: '/admin' },
]

export function Header() {
  const pathname = usePathname()

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
          <div className="ml-10 space-x-4">
            <ConnectButton />
          </div>
        </div>
      </nav>
    </header>
  )
} 