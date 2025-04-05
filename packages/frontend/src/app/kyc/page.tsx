import { Header } from '@/components/layout/Header'
import { KycFlow } from '@/components/kyc/KycFlow'
import { useKyc } from '@/contexts/KycContext'

export default function KycPage() {
  const { isFirstLogin } = useKyc()

  if (!isFirstLogin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">KYC Already Completed</h2>
            <p className="text-gray-600">
              You have already completed the KYC process. You can now use the platform.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <KycFlow />
      </main>
    </div>
  )
} 