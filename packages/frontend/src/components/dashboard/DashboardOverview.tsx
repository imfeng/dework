'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useDework } from '@/hooks'
import { LEASE_STATUS_LABELS, LEASE_STATUS_MAP } from '@/contracts/types'

export const DashboardOverview = () => {
  const { leases, tenantLeases, isLoadingLeases, isContractReady } = useDework()
  const [activeRole, setActiveRole] = useState('tenant') // tenant or landlord

  if (!isContractReady) {
    return <div>Contracts are not ready. Please check your configuration.</div>
  }

  if (isLoadingLeases) {
    return <div>Loading data...</div>
  }

  const currentLeases = activeRole === 'landlord' ? leases : tenantLeases

  return (
    <div className="space-y-8">
      {/* 角色切換標籤 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 ${
              activeRole === 'landlord'
                ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveRole('landlord')}
          >
            我是房東
          </button>
          <button
            className={`py-2 px-4 ${
              activeRole === 'tenant'
                ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveRole('tenant')}
          >
            我是租客
          </button>
        </div>

        {/* 快速統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">總合約數</p>
            <p className="text-2xl font-bold">{currentLeases?.length || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">活躍合約</p>
            <p className="text-2xl font-bold">
              {currentLeases?.filter(lease => lease.status === 1)?.length || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">爭議中</p>
            <p className="text-2xl font-bold">
              {currentLeases?.filter(lease => lease.status === 3)?.length || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">總押金金額</p>
            <p className="text-2xl font-bold">
              {currentLeases && currentLeases.length > 0
                ? formatEther(
                    currentLeases.reduce(
                      (sum, lease) => sum + BigInt(lease.depositAmount),
                      BigInt(0)
                    )
                  )
                : '0'}{' '}
              USDC
            </p>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-wrap gap-4">
          {activeRole === 'landlord' ? (
            <>
              <Link
                href="/landlord"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                管理我的物件
              </Link>
              <Link
                href="/create-lease"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                創建新租賃
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/tenant"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                管理我的租賃
              </Link>
              <Link
                href="/marketplace"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                瀏覽可租物件
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 最近合約列表 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">最近合約</h2>
        <div className="space-y-4">
          {currentLeases && currentLeases.length > 0 ? (
            currentLeases.slice(0, 3).map(lease => (
              <div key={lease.tokenId.toString()} className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">合約 #{lease.tokenId.toString()}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-500">狀態</p>
                    <p>{LEASE_STATUS_LABELS[LEASE_STATUS_MAP[lease.status]]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">押金</p>
                    <p>{formatEther(lease.depositAmount)} USDC</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {activeRole === 'landlord' ? '租客' : '房東'}
                    </p>
                    <p className="truncate">
                      {activeRole === 'landlord' ? lease.tenant : lease.landlord}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">到期日</p>
                    <p>{new Date(Number(lease.endDate) * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>沒有找到租賃合約。</p>
          )}
        </div>
        {currentLeases && currentLeases.length > 0 && (
          <div className="mt-4 text-center">
            <Link
              href={activeRole === 'landlord' ? '/landlord' : '/tenant'}
              className="text-indigo-600 hover:text-indigo-800"
            >
              查看所有合約
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}