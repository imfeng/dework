'use client'

import { useKyc } from '@/contexts/KycContext'

export const KycComplete = () => {
  const { username } = useKyc()

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">KYC Complete!</h2>
      <p className="text-gray-600">
        Welcome, {username}! Your KYC verification has been completed successfully.
      </p>
    </div>
  )
} 