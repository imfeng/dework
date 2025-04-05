import { Header } from '@/components/layout/Header'
import { PropertyListing } from '@/components/marketplace/PropertyListing'

export const metadata = {
  title: '租賃市場 | DeWork',
  description: '瀏覽可用租賃物件',
}

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <PropertyListing />
          </div>
        </div>
      </main>
    </div>
  )
}