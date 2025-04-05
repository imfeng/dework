'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRole } from '@/contexts/RoleContext'
import { useKyc } from '@/contexts/KycContext'
import { formatAmount, formatDate, getRentalStatusText } from '@/utils/helpers'
import { useRentalContract } from '@/hooks/contracts/useRentalContract'

export default function LandlordPage() {
  const router = useRouter()
  const { address } = useAccount()
  const { activeRole } = useRole()
  const { isKycCompleted } = useKyc()
  const { getLandlordRentals, endRental, terminateEarly, getCurrentAPY, loading, error } = useRentalContract()
  
  const [rentals, setRentals] = useState([])
  const [currentAPY, setCurrentAPY] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    disputed: 0,
    completed: 0
  })

  // 確保用戶已完成 KYC 並使用正確角色
  useEffect(() => {
    if (!isKycCompleted) {
      router.push('/connect')
    } else if (activeRole !== 'landlord') {
      router.push('/tenant')
    }
  }, [isKycCompleted, activeRole, router])

  // 載入房東的租賃
  useEffect(() => {
    const loadLandlordData = async () => {
      if (!address || !isKycCompleted) return
      
      try {
        // 載入房東的租賃
        const landlordRentals = await getLandlordRentals()
        setRentals(landlordRentals)
        
        // 更新統計數據
        setStats({
          total: landlordRentals.length,
          active: landlordRentals.filter(r => r.isActive).length,
          disputed: landlordRentals.filter(r => r.isActive && r.inDispute).length,
          completed: landlordRentals.filter(r => !r.isActive).length
        })
        
        // 載入當前 APY
        const apy = await getCurrentAPY()
        setCurrentAPY(apy)
      } catch (error) {
        console.error('載入房東數據錯誤:', error)
      }
    }
    
    loadLandlordData()
  }, [address, isKycCompleted, getLandlordRentals, getCurrentAPY])

  // 處理結束租賃
  const handleEndRental = async (rentalId) => {
    try {
      await endRental(rentalId)
      // 重新載入數據
      const updatedRentals = await getLandlordRentals()
      setRentals(updatedRentals)
    } catch (err) {
      console.error('結束租賃錯誤:', err)
    }
  }

  // 處理提前終止租賃
  const handleTerminateEarly = async (rentalId) => {
    try {
      await terminateEarly(rentalId)
      // 重新載入數據
      const updatedRentals = await getLandlordRentals()
      setRentals(updatedRentals)
    } catch (err) {
      console.error('提前終止租賃錯誤:', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">房東儀表板</h1>
        <p className="text-gray-600">
          管理您的出租物件和收到的押金
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">總租賃數量</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">進行中</p>
          <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">爭議中</p>
          <p className="text-3xl font-bold text-red-600">{stats.disputed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">已完成</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
      </div>

      {/* 租賃管理 */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">我的出租物件</h2>
          <button
            onClick={() => router.push('/create-rental')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            創建新租賃
          </button>
        </div>

        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : rentals.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 mb-4">您尚未創建任何租賃合約</p>
            <button
              onClick={() => router.push('/create-rental')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              創建第一個租賃合約
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    租客地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    押金金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    開始日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    結束日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rental.tenant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(rental.depositAmount)} USDC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rental.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rental.endTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        !rental.isActive ? 'bg-gray-100 text-gray-800' :
                        rental.inDispute ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getRentalStatusText(rental)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {rental.isActive && (
                        <div className="flex space-x-2">
                          {!rental.inDispute && Date.now() / 1000 >= rental.endTime && (
                            <button
                              onClick={() => handleEndRental(rental.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              結束租賃
                            </button>
                          )}
                          {!rental.inDispute && (
                            <button
                              onClick={() => handleTerminateEarly(rental.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              提前終止
                            </button>
                          )}
                        </div>
                      )}
                      
                      {!rental.isActive && (
                        <span className="text-gray-500">已完成</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 其他房東功能區域 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">押金利息</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl font-bold text-blue-600 mr-2">{(currentAPY).toFixed(2)}%</div>
            <div className="text-gray-600">年化收益率</div>
          </div>
          <p className="text-gray-600">
            租客的押金將存入利息池中，根據當前的年化收益率產生利息。租賃結束時，租客將收到押金和所有產生的利息。
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
