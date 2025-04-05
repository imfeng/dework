'use client'

import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { DEWORK_ABI } from '@/constants/abi'

interface PropertyNFTProps {
  propertyId: number
  propertyName: string
  rent: number
  deposit: number
}

export const PropertyNFT = ({ propertyId, propertyName, rent, deposit }: PropertyNFTProps) => {
  const { address } = useAccount()
  const [duration, setDuration] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)

  const { data: nftData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getPropertyNFT',
    args: [propertyId],
    enabled: !!propertyId,
  })

  const { write: rentProperty, data: rentData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'rentProperty',
    args: [propertyId, duration],
    value: BigInt(deposit + (rent * duration)),
  })

  const { isLoading: isRenting } = useWaitForTransaction({
    hash: rentData?.hash,
    onSuccess: () => {
      setIsLoading(false)
    },
  })

  const handleRent = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      await rentProperty()
    } catch (error) {
      console.error('Error renting property:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Rental NFT</h3>
      {nftData ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Current Tenant</h4>
            <p className="text-gray-600">{nftData.tenant}</p>
          </div>
          <div>
            <h4 className="font-medium">Expires At</h4>
            <p className="text-gray-600">{new Date(Number(nftData.expiresAt) * 1000).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Rent Duration (months)</h4>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <h4 className="font-medium">Total Cost</h4>
            <p className="text-gray-600">
              Deposit: {deposit} USDC + Rent: {rent * duration} USDC = Total: {deposit + (rent * duration)} USDC
            </p>
          </div>
          <button
            onClick={handleRent}
            disabled={isLoading || isRenting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading || isRenting ? 'Processing...' : 'Rent Property'}
          </button>
        </div>
      )}
    </div>
  )
} 