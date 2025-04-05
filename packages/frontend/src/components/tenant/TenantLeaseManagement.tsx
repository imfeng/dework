'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useDework } from '@/hooks'
import { LEASE_STATUS_LABELS, LEASE_STATUS_MAP } from '@/contracts/types'

export const TenantLeaseManagement = () => {
  const { tenantLeases, isLoadingLeases, deposit, raiseDispute, isContractReady } = useDework()

  const handleDeposit = async (tokenId: bigint) => {
    try {
      await deposit({
        args: [tokenId],
      })
    } catch (error) {
      console.error('Error depositing:', error)
    }
  }

  const handleRaiseDispute = async (tokenId: bigint) => {
    try {
      await raiseDispute({
        args: [tokenId],
      })
    } catch (error) {
      console.error('Error raising dispute:', error)
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
      {/* Your Leases */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">您的租賃合約</h2>
        <div className="space-y-4">
          {tenantLeases && tenantLeases.length > 0 ? (
            tenantLeases.map((lease) => (
              <div key={lease.tokenId.toString()} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">合約 #{lease.tokenId.toString()}</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">狀態</p>
                    <p>{LEASE_STATUS_LABELS[LEASE_STATUS_MAP[lease.status]]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">押金金額</p>
                    <p>{formatEther(lease.depositAmount)} USDC</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">利息收益</p>
                    <p>{formatEther(lease.interestEarned)} USDC</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">租期</p>
                    <p>
                      {new Date(Number(lease.startDate) * 1000).toLocaleDateString()} -{' '}
                      {new Date(Number(lease.endDate) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">房東</p>
                    <p className="truncate">{lease.landlord}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ENS名稱</p>
                    <p>{lease.ensName}</p>
                  </div>
                </div>
                
                {/* 按鈕區域 */}
                <div className="mt-4 flex space-x-2">
                  {lease.status === 0 && (
                    <button
                      onClick={() => handleDeposit(lease.tokenId)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      支付押金
                    </button>
                  )}
                  {lease.status === 1 && (
                    <button
                      onClick={() => handleRaiseDispute(lease.tokenId)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      提出爭議
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>沒有找到租賃合約。</p>
          )}
        </div>
      </div>
    </div>
  )
}