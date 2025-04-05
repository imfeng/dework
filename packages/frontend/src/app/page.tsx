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
              Welcome to DeWork
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Web3押金代管平台 - 安全、透明、高效
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              href="/admin"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">平台管理</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ 用戶管理</li>
                <li>✓ 租約合約管理</li>
                <li>✓ 利率收益統計</li>
                <li>✓ 爭議處理</li>
              </ul>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 