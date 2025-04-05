import { useAccount } from 'wagmi'

interface UserKycStatus {
  isFirstLogin: boolean
  kycCompleted: boolean
  username?: string
  passportVerified: boolean
  passportData?: {
    passportNumber: string
    expiryDate: string
    verifiedAt: string
  }
}

export const useApi = () => {
  const { address } = useAccount()

  const getUserKycStatus = async (): Promise<UserKycStatus> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${address}/kyc`)
      if (!response.ok) {
        throw new Error('Failed to fetch KYC status')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching KYC status:', error)
      throw error
    }
  }

  const updateKycStatus = async (data: Partial<UserKycStatus>): Promise<void> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${address}/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update KYC status')
      }
    } catch (error) {
      console.error('Error updating KYC status:', error)
      throw error
    }
  }

  return {
    getUserKycStatus,
    updateKycStatus,
  }
} 