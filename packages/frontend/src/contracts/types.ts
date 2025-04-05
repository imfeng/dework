export interface Lease {
  tokenId: bigint
  tenant: `0x${string}`
  landlord: `0x${string}`
  depositAmount: bigint
  interestEarned: bigint
  status: number
  startDate: bigint
  endDate: bigint
  ensName: string
  worldId: string
}

// 租賃狀態映射
export const LEASE_STATUS_MAP = {
  0: 'NOT_STARTED',
  1: 'ACTIVE',
  2: 'COMPLETED',
  3: 'DISPUTED'
}

// 租賃狀態顯示標籤
export const LEASE_STATUS_LABELS = {
  'NOT_STARTED': '未開始',
  'ACTIVE': '活躍中',
  'COMPLETED': '已完成',
  'DISPUTED': '爭議中'
}