import { useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import Link from 'next/link'
import { DEWORK_ABI } from '@/constants/abi'

interface Property {
  id: number
  landlord: string
  deposit: bigint
  rentPerMonth: bigint
  isAvailable: boolean
  description: string
  imageUrl: string
}

export const PropertyList = () => {
  const { data: properties, isLoading, error } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getAllProperties',
    watch: true,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        Error loading properties: {error.message}
      </div>
    )
  }

  if (!properties || (properties as Property[]).length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 text-gray-600">
        No properties available at the moment.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(properties as Property[]).map((property) => (
        <div
          key={property.id}
          className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <img
            src={property.imageUrl || '/placeholder-property.jpg'}
            alt={`Property ${property.id}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Property #{property.id}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="font-semibold">{formatEther(property.rentPerMonth)} USDC</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Deposit</p>
                <p className="font-semibold">{formatEther(property.deposit)} USDC</p>
              </div>
            </div>
            <Link
              href={`/property/${property.id}`}
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
} 