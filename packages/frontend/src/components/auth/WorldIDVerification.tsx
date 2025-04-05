'use client'

import { useCallback } from 'react'
import { IDKitWidget, ISuccessResult } from '@worldcoin/id'
import { useAccount } from 'wagmi'
import { useAuth } from '@/contexts/AuthContext'

export const WorldIDVerification = () => {
  const { address } = useAccount()
  const { isWorldIdVerified, setIsWorldIdVerified } = useAuth()

  const handleSuccess = useCallback((result: ISuccessResult) => {
    try {
      setIsWorldIdVerified(true)
      // TODO: Store verification status in backend
      console.log('Verification successful:', result)
    } catch (error) {
      console.error('Error during World ID verification:', error)
      setIsWorldIdVerified(false)
    }
  }, [setIsWorldIdVerified])

  const handleError = useCallback((error: Error) => {
    console.error('World ID verification error:', error)
    setIsWorldIdVerified(false)
  }, [setIsWorldIdVerified])

  if (!address) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-700">
        Please connect your wallet first
      </div>
    )
  }

  if (isWorldIdVerified) {
    return (
      <div className="p-4 border rounded-lg bg-green-50 text-green-700">
        ✓ Verified with World ID
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2">Verify with World ID</h3>
      <p className="text-sm text-gray-600 mb-4">
        Please verify your identity using World ID to continue
      </p>
      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID || ''}
        action="verify-identity"
        signal={address}
        onSuccess={handleSuccess}
        onError={handleError}
        credential_types={['orb', 'phone']}
        enableTelemetry
      >
        {({ open }: { open: () => void }) => (
          <button
            onClick={open}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Verify with World ID
          </button>
        )}
      </IDKitWidget>
    </div>
  )
} 