import { useContractRead, useContractWrite, useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useState } from 'react'
import { DEWORK_ABI } from '@/constants/abi'

interface PropertyDetailsProps {
  propertyId: string
}

interface Property {
  id: number
  landlord: string
  deposit: bigint
  rentPerMonth: bigint
  isAvailable: boolean
  description: string
  imageUrl: string
}

export const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const { address } = useAccount()
  const [isRenting, setIsRenting] = useState(false)

  const { data: property, isLoading, error } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getProperty',
    args: [BigInt(propertyId)],
    watch: true,
  })

  const { writeAsync: rentProperty } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'rentProperty',
  })

  const handleRent = async () => {
    if (!property || !address) return

    try {
      setIsRenting(true)
      await rentProperty({
        args: [BigInt(propertyId)],
        value: (property as Property).deposit,
      })
      // TODO: Handle success (show notification, redirect, etc.)
    } catch (error) {
      console.error('Error renting property:', error)
      // TODO: Handle error (show notification)
    } finally {
      setIsRenting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        Error loading property details: {error?.message || 'Property not found'}
      </div>
    )
  }

  const typedProperty = property as Property

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative h-96">
        <img
          src={typedProperty.imageUrl || '/placeholder-property.jpg'}
          alt={`Property ${typedProperty.id}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Property #{typedProperty.id}</h1>
            <p className="text-gray-600">{typedProperty.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Monthly Rent</p>
            <p className="text-xl font-bold text-blue-600">
              {formatEther(typedProperty.rentPerMonth)} USDC
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Required Deposit</p>
            <p className="text-lg font-semibold">{formatEther(typedProperty.deposit)} USDC</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Landlord</p>
            <p className="text-sm font-mono truncate">{typedProperty.landlord}</p>
          </div>
        </div>

        {typedProperty.isAvailable ? (
          <button
            onClick={handleRent}
            disabled={isRenting || !address}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRenting ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </span>
            ) : !address ? (
              'Connect Wallet to Rent'
            ) : (
              'Rent Property'
            )}
          </button>
        ) : (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-center">
            This property is currently not available for rent
          </div>
        )}
      </div>
    </div>
  )
} 