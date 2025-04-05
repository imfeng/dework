import { Address } from 'viem'

export interface Lease {
  tokenId: bigint
  depositAmount: bigint
  interestEarned: bigint
  status: number
  startDate: bigint
  endDate: bigint
  landlord: Address
  tenant: Address
  ensName: string
  worldId: string
}

export interface Dispute {
  tokenId: bigint
  tenant: Address
  landlord: Address
  description: string
  createdAt: bigint
  votesFor: bigint
  votesAgainst: bigint
  resolved: boolean
}

export type LeaseStatus = 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED'

export const LEASE_STATUS_MAP: Record<number, LeaseStatus> = {
  0: 'NOT_STARTED',
  1: 'ACTIVE',
  2: 'COMPLETED',
  3: 'DISPUTED'
}

export const LEASE_STATUS_LABELS: Record<LeaseStatus, string> = {
  NOT_STARTED: '未開始',
  ACTIVE: '進行中',
  COMPLETED: '已結束',
  DISPUTED: '爭議中'
} 