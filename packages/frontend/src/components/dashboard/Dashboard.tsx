'use client'

import { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { useAuth } from '@/contexts/AuthContext'
import { useKyc } from '@/contexts/KycContext'
import { DEWORK_ABI } from '@/constants/abi'
import { LandlordDashboard } from './LandlordDashboard'
import { TenantDashboard } from './TenantDashboard'
import { AdminDashboard } from './AdminDashboard'

export const Dashboard = () => {
  const { address } = useAccount()
  const { isWorldIdVerified } = useAuth()
  const { isKycCompleted } = useKyc()
  const [userRole, setUserRole] = useState<'landlord' | 'tenant' | 'admin' | null>(null)
  const [balance, setBalance] = useState<string>('0')
  const [transactions, setTransactions] = useState<any[]>([])

  const { data: roleData } = useContractRead({
    address: process.env.NEXT_PUBLIC_DEWORK_CONTRACT_ADDRESS as `0x${string}`,
    abi: DEWORK_ABI,
    functionName: 'getUserRole',
    args: [address],
    enabled: !!address,
  })

  useEffect(() => {
    if (roleData) {
      setUserRole(roleData as 'landlord' | 'tenant' | 'admin')
    }
  }, [roleData])

  if (!address) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        Please connect your wallet first
      </div>
    )
  }

  if (!isWorldIdVerified) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        Please complete World ID verification first
      </div>
    )
  }

  if (!isKycCompleted) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        Please complete KYC verification first
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Role</h3>
            <p className="text-lg">{userRole?.toUpperCase()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">USDC Balance</h3>
            <p className="text-lg">{balance} USDC</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700">Recent Transactions</h3>
            <p className="text-lg">{transactions.length}</p>
          </div>
        </div>
      </div>

      {userRole === 'landlord' && <LandlordDashboard />}
      {userRole === 'tenant' && <TenantDashboard />}
      {userRole === 'admin' && <AdminDashboard />}
    </div>
  )
} 