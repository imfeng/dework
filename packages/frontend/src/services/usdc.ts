import axios from 'axios'

const CIRCLE_API_URL = process.env.NEXT_PUBLIC_CIRCLE_API_URL
const CIRCLE_API_KEY = process.env.NEXT_PUBLIC_CIRCLE_API_KEY

interface TransferRequest {
  destinationAddress: string
  amount: string
  tokenId: string
}

interface TransferResponse {
  id: string
  status: string
  amount: string
  destinationAddress: string
}

export const usdcService = {
  async transferUSDC(request: TransferRequest): Promise<TransferResponse> {
    try {
      const response = await axios.post(
        `${CIRCLE_API_URL}/transfers`,
        {
          idempotencyKey: crypto.randomUUID(),
          destination: {
            type: 'blockchain',
            address: request.destinationAddress,
          },
          amount: {
            amount: request.amount,
            currency: 'USD',
          },
          source: {
            type: 'wallet',
            id: process.env.NEXT_PUBLIC_CIRCLE_WALLET_ID,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error transferring USDC:', error)
      throw error
    }
  },

  async getBalance(): Promise<string> {
    try {
      const response = await axios.get(
        `${CIRCLE_API_URL}/wallets/${process.env.NEXT_PUBLIC_CIRCLE_WALLET_ID}/balances`,
        {
          headers: {
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
          },
        }
      )
      const usdcBalance = response.data.data.find(
        (balance: any) => balance.currency === 'USD'
      )
      return usdcBalance?.amount || '0'
    } catch (error) {
      console.error('Error getting USDC balance:', error)
      throw error
    }
  },

  async getTransactionHistory(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${CIRCLE_API_URL}/wallets/${process.env.NEXT_PUBLIC_CIRCLE_WALLET_ID}/transfers`,
        {
          headers: {
            Authorization: `Bearer ${CIRCLE_API_KEY}`,
          },
        }
      )
      return response.data.data
    } catch (error) {
      console.error('Error getting transaction history:', error)
      throw error
    }
  },
} 