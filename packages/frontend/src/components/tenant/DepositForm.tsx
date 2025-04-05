'use client'

import { useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'
import { parseEther } from 'viem'

export function DepositForm() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('')
  const [leaseId, setLeaseId] = useState('')

  const { write: deposit } = useContractWrite({
    address: 'YOUR_CONTRACT_ADDRESS',
    abi: [
      {
        inputs: [
          { name: 'leaseId', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    functionName: 'deposit',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

    try {
      await deposit({
        args: [BigInt(leaseId), parseEther(amount)],
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('Deposit failed:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">押金存入</h2>
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
            押金金額 (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            min="0"
            step="0.0001"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={!address}
        >
          {address ? '存入押金' : '請連接錢包'}
        </button>
      </form>
    </div>
  )
} 