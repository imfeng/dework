'use client'

import { useState } from 'react'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi'
import { DEWORK_ABI } from '@/constants/abi'

interface TenantActionsProps {
  propertyId: number
  propertyName: string
  rent: number
  deposit: number
}

export const TenantActions = ({ propertyId, propertyName, rent, deposit }: TenantActionsProps) => {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [duration, setDuration] = useState<number>(1)

  const { write: payRent, data: payData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'payRent',
    args: [propertyId, BigInt(rent)],
  })

  const { write: requestDepositReturn, data: returnData } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'requestDepositReturn',
    args: [propertyId],
  })

  const { isLoading: isPaying } = useWaitForTransaction({
    hash: payData?.hash,
    onSuccess: () => {
      setIsLoading(false)
    },
  })

  const { isLoading: isReturning } = useWaitForTransaction({
    hash: returnData?.hash,
    onSuccess: () => {
      setIsLoading(false)
    },
  })

  const handlePayRent = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      await payRent()
    } catch (error) {
      console.error('Error paying rent:', error)
      setIsLoading(false)
    }
  }

  const handleRequestDepositReturn = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      await requestDepositReturn()
    } catch (error) {
      console.error('Error requesting deposit return:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Tenant Actions</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Pay Rent</h4>
          <p className="text-gray-600">Amount: {rent} USDC</p>
          <button
            onClick={handlePayRent}
            disabled={isLoading || isPaying}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading || isPaying ? 'Processing...' : 'Pay Rent'}
          </button>
        </div>
        <div>
          <h4 className="font-medium">Request Deposit Return</h4>
          <p className="text-gray-600">Amount: {deposit} USDC</p>
          <button
            onClick={handleRequestDepositReturn}
            disabled={isLoading || isReturning}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading || isReturning ? 'Processing...' : 'Request Return'}
          </button>
        </div>
      </div>
    </div>
  )
} 