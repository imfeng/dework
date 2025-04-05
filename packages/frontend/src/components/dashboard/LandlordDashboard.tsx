'use client'

import { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import { DEWORK_ABI } from '@/config/abi'
import { useNotification } from '@/contexts/NotificationContext'

export const LandlordDashboard = () => {
  const [activeTab, setActiveTab] = useState<'properties' | 'leases' | 'deposits'>('properties')
  const [properties, setProperties] = useState<any[]>([])
  const [leases, setLeases] = useState<any[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  const { showNotification } = useNotification()

  const { data: propertiesData, error: propertiesError } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getLandlordProperties',
    enabled: true,
  })

  const { data: leasesData, error: leasesError } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getLandlordLeases',
    enabled: true,
  })

  const { data: depositsData, error: depositsError } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getLandlordDeposits',
    enabled: true,
  })

  useEffect(() => {
    if (propertiesError) {
      showNotification('error', 'Failed to fetch properties')
    } else if (propertiesData) {
      setProperties(propertiesData as any[])
    }
  }, [propertiesData, propertiesError, showNotification])

  useEffect(() => {
    if (leasesError) {
      showNotification('error', 'Failed to fetch leases')
    } else if (leasesData) {
      setLeases(leasesData as any[])
    }
  }, [leasesData, leasesError, showNotification])

  useEffect(() => {
    if (depositsError) {
      showNotification('error', 'Failed to fetch deposits')
    } else if (depositsData) {
      setDeposits(depositsData as any[])
    }
  }, [depositsData, depositsError, showNotification])

  const renderProperties = () => (
    <div className="space-y-4">
      {properties.map((property) => (
        <div key={property.id} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Property {property.id}</h3>
          <p>Status: {property.active ? 'Active' : 'Inactive'}</p>
        </div>
      ))}
    </div>
  )

  const renderLeases = () => (
    <div className="space-y-4">
      {leases.map((lease) => (
        <div key={lease.propertyId} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Lease for Property {lease.propertyId}</h3>
          <p>Tenant: {lease.tenant}</p>
          <p>Rent: {lease.rent} USDC</p>
          <p>Status: {lease.active ? 'Active' : 'Inactive'}</p>
        </div>
      ))}
    </div>
  )

  const renderDeposits = () => (
    <div className="space-y-4">
      {deposits.map((deposit) => (
        <div key={deposit.propertyId} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Deposit for Property {deposit.propertyId}</h3>
          <p>Tenant: {deposit.tenant}</p>
          <p>Amount: {deposit.amount} USDC</p>
          <p>Status: {deposit.returned ? 'Returned' : 'Held'}</p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'properties' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Properties
        </button>
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
      </div>

      <div className="mt-4">
        {activeTab === 'properties' && renderProperties()}
        {activeTab === 'leases' && renderLeases()}
        {activeTab === 'deposits' && renderDeposits()}
      </div>
    </div>
  )
} 