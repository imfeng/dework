'use client'

import { useState } from 'react'
import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { DEWORK_ABI } from '@/config/abi'
import { useNotification } from '@/contexts/NotificationContext'

export const PropertyManagement = () => {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [rent, setRent] = useState('')
  const [deposit, setDeposit] = useState('')
  const { showNotification } = useNotification()

  const { write, data, isLoading, error } = useContractWrite({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'createProperty',
  })

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      showNotification('success', 'Property created successfully')
      setName('')
      setLocation('')
      setRent('')
      setDeposit('')
    },
    onError: (error) => {
      showNotification('error', `Failed to create property: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !location || !rent || !deposit) {
      showNotification('error', 'Please fill in all fields')
      return
    }

    try {
      const rentAmount = BigInt(rent)
      const depositAmount = BigInt(deposit)

      if (rentAmount <= 0 || depositAmount <= 0) {
        showNotification('error', 'Rent and deposit amounts must be greater than 0')
        return
      }

      write({
        args: [name, location, rentAmount, depositAmount],
      })
    } catch (error) {
      showNotification('error', 'Invalid amount format')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Create New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Rent (USDC)</label>
          <input
            type="number"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deposit Amount (USDC)</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">
            {error.message}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Property'}
        </button>
      </form>
    </div>
  )
} 