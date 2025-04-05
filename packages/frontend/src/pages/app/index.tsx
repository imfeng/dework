'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useKyc } from '@/contexts/KycContext'
import { useRole } from '@/contexts/RoleContext'

export default function HomePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { isKycCompleted } = useKyc()
  const { activeRole } = useRole()

  useEffect(() => {
    if (!isConnected) {
      // 如果未連接錢包，重定向到連接頁面
      router.push('/connect')
    } else if (!isKycCompleted) {
      // 如果未完成 KYC，重定向到連接頁面（將顯示 KYC 流程）
      router.push('/connect')
    } else {
      // 根據角色重定向到相應頁面
      if (activeRole === 'landlord') {
        router.push('/landlord')
      } else {
        router.push('/tenant')
      }
    }
  }, [isConnected, isKycCompleted, activeRole, router])

  // 顯示載入中狀態
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">載入中...</h2>
        <p className="text-gray-500">請稍候，系統正在為您準備儀表板</p>
      </div>
    </div>
  )
}
