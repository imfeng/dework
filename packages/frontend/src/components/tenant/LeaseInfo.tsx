'use client'

import { useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { formatEther } from 'viem'
import { useDework, useDisputeResolution } from '@/hooks'
import { LEASE_STATUS_LABELS, LEASE_STATUS_MAP, Lease } from '@/contracts/types'

export const LeaseInfo = () => {
  const { tenantLeases, isLoadingLeases, raiseDispute, isContractReady } = useDework()
  const { createDispute, isContractReady: isDisputeContractReady } = useDisputeResolution()
  const [selectedLease, setSelectedLease] = useState<number | null>(null)
  const [disputeDescription, setDisputeDescription] = useState('')

  const handleRaiseDispute = async (leaseId: number) => {
    try {
      // First raise the dispute in the main contract
      await raiseDispute({
        args: [BigInt(leaseId)],
      })

      // Then create the dispute in the dispute resolution contract
      await createDispute({
        args: [BigInt(leaseId), disputeDescription],
      })

      setSelectedLease(null)
      setDisputeDescription('')
    } catch (error) {
      console.error('Error raising dispute:', error)
    }
  }

  if (!isContractReady || !isDisputeContractReady) {
    return <div>Contracts are not ready. Please check your configuration.</div>
  }

  if (isLoadingLeases) {
    return <div>Loading leases...</div>
  }

  if (!tenantLeases || tenantLeases.length === 0) {
    return <div>No active leases found.</div>
  }

  return (
    <div className="space-y-4">
      {tenantLeases.map((lease: Lease) => (
        <div key={lease.tokenId.toString()} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Lease #{lease.tokenId.toString()}</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p>{LEASE_STATUS_LABELS[LEASE_STATUS_MAP[lease.status]]}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Deposit Amount</p>
              <p>{formatEther(lease.depositAmount)} USDC</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Interest Earned</p>
              <p>{formatEther(lease.interestEarned)} USDC</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p>
                {new Date(Number(lease.startDate) * 1000).toLocaleDateString()} -{' '}
                {new Date(Number(lease.endDate) * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          {LEASE_STATUS_MAP[lease.status] === 'ACTIVE' && (
            <button
              onClick={() => setSelectedLease(Number(lease.tokenId))}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Raise Dispute
            </button>
          )}
        </div>
      ))}

      {selectedLease && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Raise Dispute</h3>
            <textarea
              value={disputeDescription}
              onChange={(e) => setDisputeDescription(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Describe the issue..."
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedLease(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRaiseDispute(selectedLease)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 