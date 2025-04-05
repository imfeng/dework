'use client'

import { useState } from 'react'
import { useContractRead } from 'wagmi'
import { DEWORK_ABI } from '@/constants/abi'

export const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState<'leases' | 'deposits' | 'disputes'>('leases')
  const [leases, setLeases] = useState<any[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  const [disputes, setDisputes] = useState<any[]>([])

  const { data: leasesData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getTenantLeases',
    enabled: true,
  })

  const { data: depositsData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getTenantDeposits',
    enabled: true,
  })

  const { data: disputesData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getTenantDisputes',
    enabled: true,
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('leases')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'leases' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Leases
        </button>
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'deposits' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Deposits
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'disputes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Disputes
        </button>
      </div>

      {activeTab === 'leases' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Leases</h3>
          <div className="space-y-4">
            {leases.map((lease) => (
              <div key={lease.id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{lease.propertyName}</h4>
                <p className="text-gray-600">Landlord: {lease.landlordAddress}</p>
                <p className="text-gray-600">Start Date: {lease.startDate}</p>
                <p className="text-gray-600">End Date: {lease.endDate}</p>
                <p className="text-gray-600">Rent: {lease.rent} USDC/month</p>
                <p className="text-gray-600">Status: {lease.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'deposits' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Deposits</h3>
          <div className="space-y-4">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{deposit.propertyName}</h4>
                <p className="text-gray-600">Amount: {deposit.amount} USDC</p>
                <p className="text-gray-600">Status: {deposit.status}</p>
                <p className="text-gray-600">Interest Earned: {deposit.interest} USDC</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Disputes</h3>
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{dispute.propertyName}</h4>
                <p className="text-gray-600">Status: {dispute.status}</p>
                <p className="text-gray-600">Amount in Dispute: {dispute.amount} USDC</p>
                <p className="text-gray-600">Created: {dispute.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 