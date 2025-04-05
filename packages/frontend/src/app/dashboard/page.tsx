import { Header } from '@/components/layout/Header'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'

export const metadata = {
  title: '儀表板 | DeWork',
  description: '管理您的租賃合約',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <DashboardOverview />
          </div>
        </div>
      </main>
    </div>
  )
}