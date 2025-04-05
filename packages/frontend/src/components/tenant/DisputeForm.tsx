'use client'

import { useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'

export function DisputeForm() {
  const { address } = useAccount()
  const [leaseId, setLeaseId] = useState('')
  const [reason, setReason] = useState('')

  const { write: submitDispute } = useContractWrite({
    address: 'YOUR_CONTRACT_ADDRESS',
    abi: [
      {
        inputs: [
          { name: 'leaseId', type: 'uint256' },
          { name: 'reason', type: 'string' },
        ],
        name: 'submitDispute',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'submitDispute',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

    try {
      await submitDispute({
        args: [BigInt(leaseId), reason],
      })
    } catch (error) {
      console.error('Dispute submission failed:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">提出爭議</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            租約編號
          </label>
          <input
            type="text"
            value={leaseId}
            onChange={(e) => setLeaseId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            爭議原因
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={!address}
        >
          {address ? '提交爭議' : '請連接錢包'}
        </button>
      </form>
    </div>
  )
} 