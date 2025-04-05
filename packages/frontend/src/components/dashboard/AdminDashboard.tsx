'use client'

import { useState } from 'react'
import { useContractRead } from 'wagmi'
import { DEWORK_ABI } from '@/constants/abi'

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'disputes' | 'settings'>('users')
  const [users, setUsers] = useState<any[]>([])
  const [disputes, setDisputes] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})

  const { data: usersData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getAllUsers',
    enabled: true,
  })

  const { data: disputesData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getAllDisputes',
    enabled: true,
  })

  const { data: settingsData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getSettings',
    enabled: true,
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'disputes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Disputes
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">User Management</h3>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.address} className="border rounded-lg p-4">
                <h4 className="font-semibold">{user.address}</h4>
                <p className="text-gray-600">Role: {user.role}</p>
                <p className="text-gray-600">Status: {user.status}</p>
                <p className="text-gray-600">Created: {user.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Dispute Management</h3>
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{dispute.propertyName}</h4>
                <p className="text-gray-600">Status: {dispute.status}</p>
                <p className="text-gray-600">Amount: {dispute.amount} USDC</p>
                <p className="text-gray-600">Created: {dispute.createdAt}</p>
                <p className="text-gray-600">Parties: {dispute.parties.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Platform Fee</h4>
              <p className="text-gray-600">{settings.platformFee}%</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Minimum Deposit</h4>
              <p className="text-gray-600">{settings.minDeposit} USDC</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold">Maximum Lease Duration</h4>
              <p className="text-gray-600">{settings.maxLeaseDuration} months</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 