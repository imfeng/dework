import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              歡迎使用 <span className="text-indigo-600">DeWork</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              以區塊鏈技術重新定義租賃體驗 - 安全透明、創造收益、去中心化信任
            </p>
            <Link
              href="/dashboard"
              className="connect-wallet-button inline-block mx-2"
            >
              開始使用
            </Link>
            <Link
              href="/marketplace"
              className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-md transition-colors shadow-md text-center inline-block mx-2"
            >
              瀏覽市場
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
            <Link
              href="/dashboard"
              className="card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">儀表板</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 租賃合約統計
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 角色切換
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 收益概覽
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 快速導航
                </li>
              </ul>
            </Link>

            <Link
              href="/tenant"
              className="card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">租客</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 押金存入與管理
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 租約資訊查看
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 押金及利息追蹤
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 爭議提出功能
                </li>
              </ul>
            </Link>

            <Link
              href="/landlord"
              className="card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">房東</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 租約管理
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 押金狀態監控
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 利息收益查看
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 押金結算申請
                </li>
              </ul>
            </Link>

            <Link
              href="/marketplace"
              className="card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">市場</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 可租賃物件瀏覽
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 物件搜索與篩選
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 租賃申請功能
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> ENS名稱整合
                </li>
              </ul>
            </Link>
          </div>
          
          {/* Features Section */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-lg shadow-md text-white mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Web3租賃押金管理的未來</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-semibold mb-3">安全透明</h3>
                <p className="text-gray-100">
                  所有押金都存儲在智能合約中，自動化執行租賃條款，無需信任第三方。完全透明的資金流動，任何人都可以在鏈上驗證。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-4xl mb-3">💸</div>
                <h3 className="text-xl font-semibold mb-3">創造收益</h3>
                <p className="text-gray-100">
                  閒置的押金資金會自動投入DeFi協議，產生利息收益。利息按比例分配給房東和平台，創造共贏局面。
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="text-xl font-semibold mb-3">去中心化身份</h3>
                <p className="text-gray-100">
                  整合World ID和Self Protocol，提供去中心化身份驗證和信用評分系統，增強信任度並降低欺詐風險。
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">準備好開始使用了嗎？</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              加入數千名使用DeWork平台的房東和租客，體驗Web3時代的租賃新模式。
            </p>
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-md inline-block shadow-md transition-colors mx-2"
            >
              立即開始
            </Link>
            <Link
              href="/how-it-works"
              className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-md inline-block shadow-md transition-colors mx-2"
            >
              了解更多
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}