import { Header } from '@/components/layout/Header'
import { LeaseManagement } from '@/components/landlord/LeaseManagement'

export const metadata = {
  title: '房東儀表板 | DeWork',
  description: '管理您的租賃物件和收益',
}

export default function LandlordPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <LeaseManagement />
          </div>
        </div>
      </main>
    </div>
  )
}