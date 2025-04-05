import { Header } from '@/components/layout/Header'
import { PropertyDetails } from '@/components/property/PropertyDetails'

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <PropertyDetails propertyId={params.id} />
      </main>
    </div>
  )
} 