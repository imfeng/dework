import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatAddress, getNetworkName } from '../utils/helpers';
import useWeb3 from '../hooks/useWeb3';

const Header = () => {
  const router = useRouter();
  const { isConnected, address, connectWallet, disconnectWallet, chain } = useWeb3();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // 導航鏈接
  const navLinks = [
    { name: '首頁', path: '/' },
    { name: '儀表板', path: '/dashboard' },
    { name: '創建租賃', path: '/create-rental' },
    { name: '如何使用', path: '/how-it-works' },
    { name: '市場', path: '/marketplace' }
  ];
  
  // 檢查鏈接是否活躍
  const isActive = (path) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };
  
  // 切換菜單
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // 關閉菜單
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">DeWork</span>
          </Link>
          
          {/* 桌面導航 */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium ${
                  isActive(link.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* 錢包連接/用戶信息 */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center">
                {chain && (
                  <span className="text-xs bg-gray-100 py-1 px-2 rounded mr-2">
                    {getNetworkName(chain.id)}
                  </span>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">
                      {formatAddress(address)}
                    </span>
                  </button>
                  
                  {/* 下拉菜單 */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      儀表板
                    </Link>
                    <Link
                      href="/landlord"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      我是房東
                    </Link>
                    <Link
                      href="/tenant"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      我是租客
                    </Link>
                    <button
                      onClick={disconnectWallet}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      斷開連接
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                連接錢包
              </button>
            )}
          </div>
          
          {/* 移動端菜單按鈕 */}
          <button
            className="md:hidden text-gray-600"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* 移動端導航菜單 */}
        {menuOpen && (
          <nav className="md:hidden py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            {isConnected ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {chain && (
                    <span className="text-xs bg-gray-100 py-1 px-2 rounded">
                      {getNetworkName(chain.id)}
                    </span>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {formatAddress(address)}
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <Link
                    href="/dashboard"
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    onClick={closeMenu}
                  >
                    儀表板
                  </Link>
                  <Link
                    href="/landlord"
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    onClick={closeMenu}
                  >
                    我是房東
                  </Link>
                  <Link
                    href="/tenant"
                    className="block py-2 text-sm text-gray-700 hover:text-blue-600"
                    onClick={closeMenu}
                  >
                    我是租客
                  </Link>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      closeMenu();
                    }}
                    className="block w-full text-left py-2 text-sm text-gray-700 hover:text-blue-600"
                  >
                    斷開連接
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  closeMenu();
                }}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                連接錢包
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
