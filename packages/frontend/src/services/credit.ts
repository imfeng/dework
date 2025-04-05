import axios from 'axios'

const SELF_API_URL = process.env.NEXT_PUBLIC_SELF_API_URL
const SELF_API_KEY = process.env.NEXT_PUBLIC_SELF_API_KEY

interface CreditScore {
  score: number
  factors: {
    onTimePayments: number
    leaseHistory: number
    disputeResolution: number
    accountAge: number
  }
}

interface CreditReport {
  address: string
  score: CreditScore
  history: {
    leases: number
    disputes: number
    latePayments: number
  }
}

export const creditService = {
  async getCreditScore(address: string): Promise<CreditScore> {
    try {
      const response = await axios.get(
        `${SELF_API_URL}/credit/score/${address}`,
        {
          headers: {
            Authorization: `Bearer ${SELF_API_KEY}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error getting credit score:', error)
      throw error
    }
  },

  async getCreditReport(address: string): Promise<CreditReport> {
    try {
      const response = await axios.get(
        `${SELF_API_URL}/credit/report/${address}`,
        {
          headers: {
            Authorization: `Bearer ${SELF_API_KEY}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error getting credit report:', error)
      throw error
    }
  },

  async updateCreditFactors(address: string, factors: Partial<CreditScore['factors']>): Promise<void> {
    try {
      await axios.post(
        `${SELF_API_URL}/credit/update`,
        {
          address,
          factors,
        },
        {
          headers: {
            Authorization: `Bearer ${SELF_API_KEY}`,
          },
        }
      )
    } catch (error) {
      console.error('Error updating credit factors:', error)
      throw error
    }
  },

  async getCreditHistory(address: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${SELF_API_URL}/credit/history/${address}`,
        {
          headers: {
            Authorization: `Bearer ${SELF_API_KEY}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error getting credit history:', error)
      throw error
    }
  },
} 