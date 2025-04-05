import { Header } from '@/components/layout/Header'
import { UserManagement } from '@/components/admin/UserManagement'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <UserManagement />
          </div>
        </div>
      </main>
    </div>
  )
} 