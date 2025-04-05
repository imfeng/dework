import { Header } from '@/components/layout/Header'
import { DepositForm } from '@/components/tenant/DepositForm'
import { LeaseInfo } from '@/components/tenant/LeaseInfo'
import { DisputeForm } from '@/components/tenant/DisputeForm'

export default function TenantPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <DepositForm />
              <LeaseInfo />
            </div>
            <div>
              <DisputeForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 