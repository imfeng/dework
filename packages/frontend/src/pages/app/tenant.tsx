'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useRole } from '@/contexts/RoleContext'
import { useKyc } from '@/contexts/KycContext'
import { formatAmount, formatDate, getRentalStatusText } from '@/utils/helpers'
import { useRentalContract } from '@/hooks/contracts/useRentalContract'

export default function TenantPage() {
  const router = useRouter()
  const { address } = useAccount()
  const { activeRole } = useRole()
  const { isKycCompleted } = useKyc()
  const { 
    getTenantRentals, 
    endRental, 
    raiseDispute, 
    getCurrentAPY, 
    getUsdcBalance,
    loading, 
    error 
  } = useRentalContract()
  
  const [rentals, setRentals] = useState([])
  const [currentAPY, setCurrentAPY] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    disputed: 0,
    completed: 0,
    totalDeposit: 0
  })

  // 確保用戶已完成 KYC 並使用正確角色
  useEffect(() => {
    if (!isKycCompleted) {
      router.push('/connect')
    } else if (activeRole !== 'tenant') {
      router.push('/landlord')
    }
  }, [isKycCompleted, activeRole, router])

  // 載入租客的租賃
  useEffect(() => {
    const loadTenantData = async () => {
      if (!address || !isKycCompleted) return
      
      try {
        // 載入租客的租賃
        const tenantRentals = await getTenantRentals()
        setRentals(tenantRentals)
        
        // 計算總押金額
        const totalDeposit = tenantRentals.reduce((sum, rental) => {
          return rental.isActive ? sum + Number(rental.depositAmount) : sum
        }, 0)
        
        // 更新統計數據
        setStats({
          total: tenantRentals.length,
          active: tenantRentals.filter(r => r.isActive).length,
          disputed: tenantRentals.filter(r => r.isActive && r.inDispute).length,
          completed: tenantRentals.filter(r => !r.isActive).length,
          totalDeposit
        })
        
        // 載入當前 APY
        const apy = await getCurrentAPY()
        setCurrentAPY(apy)
        
        // 載入 USDC 餘額
        const balance = await getUsdcBalance()
        setUsdcBalance(balance)
      } catch (error) {
        console.error('載入租客數據錯誤:', error)
      }
    }
    
    loadTenantData()
  }, [address, isKycCompleted, getTenantRentals, getCurrentAPY, getUsdcBalance])

  // 處理結束租賃
  const handleEndRental = async (rentalId) => {
    try {
      await endRental(rentalId)
      // 重新載入數據
      const updatedRentals = await getTenantRentals()
      setRentals(updatedRentals)
    } catch (err) {
      console.error('結束租賃錯誤:', err)
    }
  }

  // 處理提出爭議
  const handleRaiseDispute = async (rentalId) => {
    try {
      await raiseDispute(rentalId)
      // 重新載入數據
      const updatedRentals = await getTenantRentals()
      setRentals(updatedRentals)
    } catch (err) {
      console.error('提出爭議錯誤:', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">租客儀表板</h1>
        <p className="text-gray-600">
          管理您的承租物件和押金
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 租客資訊卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">USDC 餘額</p>
          <p className="text-3xl font-bold">{formatAmount(usdcBalance)} USDC</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">累計押金</p>
          <p className="text-3xl font-bold">{formatAmount(stats.totalDeposit)} USDC</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500 text-sm">當前年化收益率</p>
          <p className="text-3xl font-bold text-green-600">{(currentAPY).toFixed(2)}%</p>
        </div>
      </div>

      {/* 租賃管理 */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">我的承租物件</h2>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            瀏覽可租物件
          </button>
        </div>

        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : rentals.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 mb-4">您尚未承租任何物件</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              瀏覽可租物件
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
                    房東地址
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
                      {rental.landlord}
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
                          {!rental.inDispute && Date.now() / 1000 >= rental.releaseTime && (
                            <button
                              onClick={() => handleEndRental(rental.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              提取押金
                            </button>
                          )}
                          {!rental.inDispute && Date.now() / 1000 < rental.releaseTime && (
                            <button
                              onClick={() => handleRaiseDispute(rental.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              提出爭議
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

      {/* 押金利息與預估收益 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">押金收益計算</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">當前押金收益</h3>
              <p className="text-gray-600 mb-4">
                您的押金會在租賃期間產生利息，年化收益率為 {(currentAPY).toFixed(2)}%
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">累計押金</span>
                  <span className="font-medium">{formatAmount(stats.totalDeposit)} USDC</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">預估年收益</span>
                  <span className="font-medium text-green-600">
                    {formatAmount(stats.totalDeposit * currentAPY / 100)} USDC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">預估月收益</span>
                  <span className="font-medium text-green-600">
                    {formatAmount((stats.totalDeposit * currentAPY / 100) / 12)} USDC
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">押金安全保障</h3>
              <p className="text-gray-600 mb-4">
                您的押金存放在智能合約中，除非符合特定條件，否則無法被提取。租賃結束後，押金將自動返還給您。
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">押金存放在智能合約中，無需信任房東</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">租約結束後自動退還押金</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">有爭議時可以啟動糾紛解決機制</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
