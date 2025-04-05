'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useContractWrite } from 'wagmi'
import { useKyc } from '@/contexts/KycContext'
import { ENS_ABI } from '@/constants/abi'
import { useSelfProtocol } from '@/services/selfProtocol'
import { ensService } from '@/services/ens'

export const KycFlow = () => {
  const router = useRouter()
  const { address } = useAccount()
  const {
    kycStep,
    username,
    setUsername,
    passportVerified,
    setPassportVerified,
    nextStep,
    isUsernameAvailable,
    checkUsernameAvailability,
    isKycCompleted,
  } = useKyc()
  
  const [isRegistering, setIsRegistering] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passportError, setPassportError] = useState('')
  const { verifyPassport } = useSelfProtocol()

  const { writeAsync: registerEns } = useContractWrite({
    address: process.env.NEXT_PUBLIC_ENS_REGISTRY_ADDRESS as `0x${string}`,
    abi: ENS_ABI,
    functionName: 'register',
  })
  
  // 初始化用戶名輸入框
  useEffect(() => {
    if (username) {
      setUsernameInput(username)
    }
  }, [username])

  // 檢查用戶名可用性
  useEffect(() => {
    const checkAvailability = async () => {
      if (usernameInput && usernameInput.length > 2) {
        try {
          const available = await ensService.isNameAvailable(usernameInput)
          if (!available) {
            setUsernameError('此用戶名已被註冊')
          } else {
            setUsernameError('')
          }
        } catch (error) {
          console.error('檢查用戶名可用性時出錯:', error)
        }
      }
    }
    
    checkAvailability()
  }, [usernameInput])

  // 如果 KYC 已完成，重定向到儀表板
  useEffect(() => {
    if (isKycCompleted) {
      router.push('/dashboard')
    }
  }, [isKycCompleted, router])

  // 提交用戶名
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address || !usernameInput) return

    try {
      // 檢查用戶名可用性
      const available = await ensService.isNameAvailable(usernameInput)
      if (!available) {
        setUsernameError('此用戶名已被註冊')
        return
      }

      setIsRegistering(true)
      
      // 註冊用戶名
      await registerEns({
        args: [usernameInput, address],
      })
      
      // 更新 KYC Context 中的用戶名
      await setUsername(usernameInput)
      
      // 進入下一步
      nextStep()
    } catch (error) {
      console.error('註冊用戶名時出錯:', error)
      setUsernameError('註冊用戶名失敗，請重試')
    } finally {
      setIsRegistering(false)
    }
  }

  // 護照驗證
  const handlePassportVerification = async () => {
    try {
      setIsVerifying(true)
      setPassportError('')
      
      const result = await verifyPassport()
      
      if (result.success) {
        setPassportVerified(true)
        nextStep()
      } else {
        setPassportError(result.error || '護照驗證失敗')
      }
    } catch (error) {
      console.error('護照驗證時出錯:', error)
      setPassportError('發生意外錯誤')
    } finally {
      setIsVerifying(false)
    }
  }

  // 完成 KYC 流程
  const handleCompleteKyc = () => {
    nextStep()
  }

  // 步驟 1: 註冊用戶名
  if (kycStep === 'username') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">註冊用戶名</h2>
        <p className="text-gray-600 mb-4">
          選擇您的 DeWork 用戶名，這將用於在區塊鏈上註冊您的 ENS 名稱
        </p>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              用戶名
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="username"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value)
                  setUsernameError('')
                }}
                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
                minLength={3}
                maxLength={20}
              />
            </div>
            {usernameError && <p className="mt-1 text-sm text-red-600">{usernameError}</p>}
          </div>
          <button
            type="submit"
            disabled={isRegistering || !usernameInput || usernameInput.length < 3 || !!usernameError}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRegistering ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                註冊中...
              </span>
            ) : (
              '註冊用戶名'
            )}
          </button>
        </form>
      </div>
    )
  }

  // 步驟 2: 護照驗證
  if (kycStep === 'passport') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">護照驗證</h2>
        <p className="text-gray-600 mb-4">
          請使用 Self Protocol 驗證您的護照身份
        </p>
        {passportError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {passportError}
          </div>
        )}
        <button
          onClick={handlePassportVerification}
          disabled={isVerifying}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              驗證中...
            </span>
          ) : (
            '驗證護照'
          )}
        </button>
      </div>
    )
  }

  // 步驟 3: 最終驗證
  if (kycStep === 'verification') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">KYC 驗證</h2>
        <p className="text-gray-600 mb-4">
          您的護照已經驗證成功。請點擊下方按鈕完成 KYC 流程。
        </p>
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-800">驗證概述</h3>
          <ul className="mt-2 text-sm text-green-700">
            <li className="flex items-center">
              <svg className="mr-2 h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              用戶名: {username}
            </li>
            <li className="flex items-center mt-1">
              <svg className="mr-2 h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              護照驗證: 已完成
            </li>
          </ul>
        </div>
        <button
          onClick={handleCompleteKyc}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          完成 KYC
        </button>
      </div>
    )
  }

  // 步驟 4: 完成
  if (kycStep === 'completed') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">KYC 完成!</h2>
          <p className="mt-2 text-sm text-gray-500">
            恭喜您，{username}! 您的 KYC 驗證已成功完成。
          </p>
          <div className="mt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              前往儀表板
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
