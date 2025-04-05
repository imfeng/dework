import { Header } from '@/components/layout/Header'
import { TenantLeaseManagement } from '@/components/tenant/TenantLeaseManagement'

export const metadata = {
  title: '租客儀表板 | DeWork',
  description: '管理您的租賃物件和押金',
}

export default function TenantPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <TenantLeaseManagement />
          </div>
        </div>
      </main>
    </div>
  )
}