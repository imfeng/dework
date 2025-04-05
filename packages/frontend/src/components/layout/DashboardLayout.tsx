'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/contexts/RoleContext'
import { useKyc } from '@/contexts/KycContext'
import { useAccount } from 'wagmi'
import { formatAddress } from '@/utils/helpers'

interface DashboardLayoutProps {
  children: ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter()
  const { activeRole, setActiveRole } = useRole()
  const { isKycCompleted } = useKyc()
  const { address } = useAccount()

  // 如果用戶未完成 KYC，重定向到連接頁面
  React.useEffect(() => {
    if (!isKycCompleted) {
      router.push('/connect')
    }
  }, [isKycCompleted, router])

  // 處理角色切換
  const handleRoleChange = (role: 'landlord' | 'tenant') => {
    setActiveRole(role)
    
    // 可選：基於角色切換到特定頁面
    if (role === 'landlord') {
      router.push('/landlord')
    } else {
      router.push('/tenant')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部角色選擇器 */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-4">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-gray-600 mr-2">錢包:</span>
              <span className="font-medium">{address ? formatAddress(address) : '未連接'}</span>
            </div>
            
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleRoleChange('landlord')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  activeRole === 'landlord'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-200`}
              >
                房東模式
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('tenant')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  activeRole === 'tenant'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-r border-gray-200`}
              >
                租客模式
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 現在顯示的視圖提示 */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${activeRole === 'landlord' ? 'bg-blue-500' : 'bg-green-500'} mr-2`}></div>
            <p className="text-sm text-gray-600">
              您目前正在使用
              <span className={`font-medium ${activeRole === 'landlord' ? 'text-blue-600' : 'text-green-600'} mx-1`}>
                {activeRole === 'landlord' ? '房東' : '租客'}
              </span>
              視圖
            </p>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}
