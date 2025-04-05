'use client'

import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { formatEther } from 'viem'
import { useDework } from '@/hooks'
import { LEASE_STATUS_LABELS, LEASE_STATUS_MAP } from '@/contracts/types'

interface Lease {
  id: bigint
  tenant: string
  depositAmount: bigint
  interestEarned: bigint
  status: number
  startDate: bigint
  endDate: bigint
}

export const LeaseManagement = () => {
  const { leases, isLoadingLeases, createLease, isContractReady } = useDework()
  const [newLease, setNewLease] = useState({
    tenant: '',
    depositAmount: '',
    duration: '',
    ensName: '',
    worldId: '',
  })

  const handleCreateLease = async () => {
    try {
      await createLease({
        args: [
          newLease.tenant as `0x${string}`,
          BigInt(Number(newLease.depositAmount) * 1e6), // Convert to USDC (6 decimals)
          BigInt(Number(newLease.duration) * 24 * 60 * 60), // Convert days to seconds
          newLease.ensName,
          newLease.worldId,
        ],
      })
      setNewLease({
        tenant: '',
        depositAmount: '',
        duration: '',
        ensName: '',
        worldId: '',
      })
    } catch (error) {
      console.error('Error creating lease:', error)
    }
  }

  if (!isContractReady) {
    return <div>Contracts are not ready. Please check your configuration.</div>
  }

  if (isLoadingLeases) {
    return <div>Loading leases...</div>
  }

  return (
    <div className="space-y-8">
      {/* Create New Lease Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create New Lease</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant Address</label>
            <input
              type="text"
              value={newLease.tenant}
              onChange={(e) => setNewLease({ ...newLease, tenant: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0x..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deposit Amount (USDC)</label>
            <input
              type="number"
              value={newLease.depositAmount}
              onChange={(e) => setNewLease({ ...newLease, depositAmount: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (days)</label>
            <input
              type="number"
              value={newLease.duration}
              onChange={(e) => setNewLease({ ...newLease, duration: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ENS Name</label>
            <input
              type="text"
              value={newLease.ensName}
              onChange={(e) => setNewLease({ ...newLease, ensName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="tenant.eth"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">World ID</label>
            <input
              type="text"
              value={newLease.worldId}
              onChange={(e) => setNewLease({ ...newLease, worldId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="world_id_123"
            />
          </div>
        </div>
        <button
          onClick={handleCreateLease}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Lease
        </button>
      </div>

      {/* Existing Leases */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Leases</h2>
        <div className="space-y-4">
          {leases && leases.length > 0 ? (
            leases.map((lease) => (
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
                  <div>
                    <p className="text-sm text-gray-500">Tenant</p>
                    <p className="truncate">{lease.tenant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ENS Name</p>
                    <p>{lease.ensName}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No leases found.</p>
          )}
        </div>
      </div>
    </div>
  )
} 