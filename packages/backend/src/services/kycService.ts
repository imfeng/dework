import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface UserKycData {
  address: string
  username?: string
  passportVerified: boolean
  passportData?: {
    passportNumber: string
    expiryDate: string
    verifiedAt: string
  }
  kycCompleted: boolean
}

export class KycService {
  async getUserKycStatus(address: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { address },
        select: {
          isFirstLogin: true,
          kycCompleted: true,
          username: true,
          passportVerified: true,
          passportData: true,
        },
      })

      if (!user) {
        // Create new user if not exists
        await prisma.user.create({
          data: {
            address,
            isFirstLogin: true,
            kycCompleted: false,
            passportVerified: false,
          },
        })

        return {
          isFirstLogin: true,
          kycCompleted: false,
          passportVerified: false,
        }
      }

      return {
        isFirstLogin: user.isFirstLogin,
        kycCompleted: user.kycCompleted,
        username: user.username,
        passportVerified: user.passportVerified,
        passportData: user.passportData,
      }
    } catch (error) {
      console.error('Error getting user KYC status:', error)
      throw error
    }
  }

  async updateKycStatus(address: string, data: Partial<UserKycData>) {
    try {
      await prisma.user.upsert({
        where: { address },
        update: {
          ...data,
          isFirstLogin: false,
        },
        create: {
          address,
          ...data,
          isFirstLogin: false,
        },
      })
    } catch (error) {
      console.error('Error updating KYC status:', error)
      throw error
    }
  }
} 