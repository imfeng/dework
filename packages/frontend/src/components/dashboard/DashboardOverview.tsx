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
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">連接錯誤</h2>
        <p className="text-gray-600 mb-4">合約尚未準備好。請檢查您的網絡連接和配置。</p>
        <button className="btn-primary">重新連接</button>
      </div>
    )
  }

  if (isLoadingLeases) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-600">正在加載數據...</p>
      </div>
    )
  }

  const currentLeases = activeRole === 'landlord' ? leases : tenantLeases

  return (
    <div className="space-y-8">
      <div className="card">
        <h1>首頁儀表板市場房東租客</h1>
        
        {/* 角色切換標籤 */}
        <div className="flex border-b mb-6">
          <button
            className={`tab-button ${activeRole === 'landlord' ? 'tab-button-active' : 'tab-button-inactive'}`}
            onClick={() => setActiveRole('landlord')}
          >
            我是房東
          </button>
          <button
            className={`tab-button ${activeRole === 'tenant' ? 'tab-button-active' : 'tab-button-inactive'}`}
            onClick={() => setActiveRole('tenant')}
          >
            我是租客
          </button>
        </div>

        {/* 快速統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <p className="text-sm text-gray-500 mb-1">總合約數</p>
            <p className="text-2xl font-bold">{currentLeases?.length || 0}</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-gray-500 mb-1">活躍合約</p>
            <p className="text-2xl font-bold">
              {currentLeases?.filter(lease => lease.status === 1)?.length || 0}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-gray-500 mb-1">爭議中</p>
            <p className="text-2xl font-bold">
              {currentLeases?.filter(lease => lease.status === 3)?.length || 0}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-gray-500 mb-1">總押金金額</p>
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
        <div className="flex flex-wrap gap-4 mb-4">
          {activeRole === 'landlord' ? (
            <>
              <Link
                href="/landlord"
                className="btn-primary"
              >
                管理我的物件
              </Link>
              <Link
                href="/create-lease"
                className="btn-green"
              >
                創建新租賃
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/tenant"
                className="btn-primary"
              >
                管理我的租賃
              </Link>
              <Link
                href="/marketplace"
                className="btn-green"
              >
                瀏覽可租物件
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 最近合約列表 */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">最近合約</h2>
        <div className="space-y-6">
          {currentLeases && currentLeases.length > 0 ? (
            currentLeases.slice(0, 3).map(lease => (
              <div key={lease.tokenId.toString()} className="p-5 border rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-3">合約 #{lease.tokenId.toString()}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">狀態</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lease.status === 1 ? 'bg-green-100 text-green-800' : 
                      lease.status === 3 ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {LEASE_STATUS_LABELS[LEASE_STATUS_MAP[lease.status as keyof typeof LEASE_STATUS_MAP] as keyof typeof LEASE_STATUS_LABELS]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">押金</p>
                    <p className="font-medium">{formatEther(lease.depositAmount)} USDC</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {activeRole === 'landlord' ? '租客' : '房東'}
                    </p>
                    <p className="truncate font-medium">
                      {activeRole === 'landlord' ? lease.tenant : lease.landlord}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">到期日</p>
                    <p className="font-medium">{new Date(Number(lease.endDate) * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link 
                    href={`/lease/${lease.tokenId.toString()}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    查看詳情 →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center border border-dashed rounded-lg bg-gray-50">
              <p className="text-gray-500">沒有找到租賃合約。</p>
              {activeRole === 'landlord' ? (
                <Link href="/create-lease" className="btn-primary mt-4 inline-block">創建新租賃</Link>
              ) : (
                <Link href="/marketplace" className="btn-primary mt-4 inline-block">瀏覽可租物件</Link>
              )}
            </div>
          )}
        </div>
        {currentLeases && currentLeases.length > 3 && (
          <div className="mt-6 text-center">
            <Link
              href={activeRole === 'landlord' ? '/landlord' : '/tenant'}
              className="inline-block px-6 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              查看所有合約
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}