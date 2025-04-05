import { Header } from '@/components/layout/Header'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              歡迎使用 DeWork
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Web3押金代管平台 - 安全、透明、高效
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">儀表板</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 租賃合約統計</li>
                <li>✓ 角色切換</li>
                <li>✓ 收益概覽</li>
                <li>✓ 快速導航</li>
              </ul>
            </Link>

            <Link
              href="/tenant"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">租客</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 押金存入與管理</li>
                <li>✓ 租約資訊查看</li>
                <li>✓ 押金及利息追蹤</li>
                <li>✓ 爭議提出功能</li>
              </ul>
            </Link>

            <Link
              href="/landlord"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">房東</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 租約管理</li>
                <li>✓ 押金狀態監控</li>
                <li>✓ 利息收益查看</li>
                <li>✓ 押金結算申請</li>
              </ul>
            </Link>

            <Link
              href="/marketplace"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">市場</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 可租賃物件瀏覽</li>
                <li>✓ 物件搜索與篩選</li>
                <li>✓ 租賃申請功能</li>
                <li>✓ ENS名稱整合</li>
              </ul>
            </Link>
          </div>
          
          <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Web3租賃押金管理的未來</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">🔒 安全透明</h3>
                <p className="text-gray-600">
                  所有押金都存儲在智能合約中，自動化執行租賃條款，無需信任第三方。完全透明的資金流動，任何人都可以在鏈上驗證。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">💸 創造收益</h3>
                <p className="text-gray-600">
                  閒置的押金資金會自動投入DeFi協議，產生利息收益。利息按比例分配給房東和平台，創造共贏局面。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">🤖 去中心化身份</h3>
                <p className="text-gray-600">
                  整合World ID和Self Protocol，提供去中心化身份驗證和信用評分系統，增強信任度並降低欺詐風險。
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg inline-block"
            >
              開始使用
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}