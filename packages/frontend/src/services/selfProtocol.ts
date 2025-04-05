import { useAccount } from 'wagmi'

interface PassportVerificationResult {
  success: boolean
  error?: string
  data?: {
    passportNumber: string
    expiryDate: string
    nationality: string
    fullName: string
    verifiedAt: string
  }
}

export const useSelfProtocol = () => {
  const { address } = useAccount()

  const verifyPassport = async (): Promise<PassportVerificationResult> => {
    if (!address) {
      return {
        success: false,
        error: '錢包未連接'
      }
    }

    try {
      // TODO: 在此處整合實際的 Self Protocol SDK
      // 當前使用模擬實現

      // 模擬驗證延遲
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // 模擬成功驗證
      return {
        success: true,
        data: {
          passportNumber: 'MOCK' + Math.floor(10000000 + Math.random() * 90000000),
          expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          nationality: 'TW',
          fullName: '模擬測試用戶',
          verifiedAt: new Date().toISOString()
        }
      }
      
      // 模擬失敗情況 (取消註釋以測試錯誤處理)
      // return {
      //   success: false,
      //   error: '護照驗證失敗，請確保您使用的是有效護照'
      // }
    } catch (error) {
      console.error('驗證護照時出錯:', error)
      return {
        success: false,
        error: '驗證過程中發生錯誤，請稍後重試'
      }
    }
  }

  const getUserVerificationStatus = async (): Promise<{ isVerified: boolean }> => {
    if (!address) {
      return { isVerified: false }
    }

    try {
      // TODO: 整合實際的驗證狀態檢查
      // 模擬實現
      return { isVerified: Math.random() > 0.2 } // 80% 機率返回已驗證
    } catch (error) {
      console.error('獲取用戶驗證狀態時出錯:', error)
      return { isVerified: false }
    }
  }

  return {
    verifyPassport,
    getUserVerificationStatus
  }
}
