'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { ENS_ABI } from '@/config/abi'
import { getUserKycStatus, updateKycStatus } from '@/services/kyc'
import { ensService } from '@/services/ens'

interface KycContextType {
  isFirstLogin: boolean
  kycStep: 'username' | 'passport' | 'verification' | 'completed'
  username: string | null
  passportVerified: boolean
  passportData: any | null
  isUsernameAvailable: boolean
  isKycCompleted: boolean
  setUsername: (username: string) => Promise<void>
  setPassportVerified: (verified: boolean) => void
  updatePassportData: (data: any) => Promise<void>
  checkUsernameAvailability: (name: string) => Promise<boolean>
  nextStep: () => void
  completeKyc: () => Promise<void>
}

const KycContext = createContext<KycContextType | undefined>(undefined)

export const KycProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount()
  const [isFirstLogin, setIsFirstLogin] = useState(true)
  const [kycStep, setKycStep] = useState<'username' | 'passport' | 'verification' | 'completed'>('username')
  const [username, setUsernameState] = useState<string | null>(null)
  const [passportVerified, setPassportVerified] = useState(false)
  const [passportData, setPassportDataState] = useState<any | null>(null)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false)

  const isKycCompleted = kycStep === 'completed'

  // 獲取用戶 KYC 狀態
  useEffect(() => {
    const checkKycStatus = async () => {
      if (!address) return

      try {
        const status = await getUserKycStatus()
        setIsFirstLogin(status.isFirstLogin)
        if (status.username) setUsernameState(status.username)
        setPassportVerified(status.passportVerified)
        if (status.passportData) setPassportDataState(status.passportData)
        
        // 設置當前 KYC 步驟
        if (status.kycCompleted) {
          setKycStep('completed')
        } else if (status.passportVerified) {
          setKycStep('verification')
        } else if (status.username) {
          setKycStep('passport')
        } else {
          setKycStep('username')
        }
      } catch (error) {
        console.error('檢查 KYC 狀態時出錯:', error)
      }
    }

    checkKycStatus()
  }, [address])

  // 檢查用戶名可用性
  const checkUsernameAvailability = async (name: string): Promise<boolean> => {
    try {
      const available = await ensService.isNameAvailable(name)
      setIsUsernameAvailable(available)
      return available
    } catch (error) {
      console.error('檢查用戶名可用性時出錯:', error)
      setIsUsernameAvailable(false)
      return false
    }
  }

  // 設置用戶名
  const setUsername = async (name: string): Promise<void> => {
    try {
      setUsernameState(name)
      await updateKycStatus({ username: name })
      await checkUsernameAvailability(name)
    } catch (error) {
      console.error('設置用戶名時出錯:', error)
      throw error
    }
  }

  // 更新護照數據
  const updatePassportData = async (data: any): Promise<void> => {
    try {
      await updateKycStatus({
        passportData: data,
        passportVerified: true
      })
      setPassportDataState(data)
      setPassportVerified(true)
    } catch (error) {
      console.error('更新護照數據時出錯:', error)
      throw error
    }
  }

  // 下一步
  const nextStep = () => {
    switch (kycStep) {
      case 'username':
        setKycStep('passport')
        break
      case 'passport':
        setKycStep('verification')
        break
      case 'verification':
        setKycStep('completed')
        break
      default:
        break
    }
  }

  // 完成 KYC
  const completeKyc = async (): Promise<void> => {
    try {
      await updateKycStatus({ kycCompleted: true })
      setKycStep('completed')
    } catch (error) {
      console.error('完成 KYC 時出錯:', error)
      throw error
    }
  }

  const value = {
    isFirstLogin,
    kycStep,
    username,
    passportVerified,
    passportData,
    isUsernameAvailable,
    isKycCompleted,
    setUsername,
    setPassportVerified,
    updatePassportData,
    checkUsernameAvailability,
    nextStep,
    completeKyc,
  }

  return <KycContext.Provider value={value}>{children}</KycContext.Provider>
}

export const useKyc = () => {
  const context = useContext(KycContext)
  if (context === undefined) {
    throw new Error('useKyc must be used within a KycProvider')
  }
  return context
}
