import { useContractRead, useContractWrite, useAccount } from 'wagmi'
import { deworkABI } from '@/contracts/abis'
import { Lease } from '@/contracts/types'
import { useMemo } from 'react'

export const useDework = () => {
  const { address } = useAccount()
  const contractAddress = process.env.NEXT_PUBLIC_DEWORK_ADDRESS

  // Read functions
  const { data: leases, isLoading: isLoadingLeases } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: deworkABI,
    functionName: 'getLandlordLeases',
    args: [address],
    enabled: !!address && !!contractAddress,
  })

  const { data: tenantLeases, isLoading: isLoadingTenantLeases } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: deworkABI,
    functionName: 'getTenantLeases',
    args: [address],
    enabled: !!address && !!contractAddress,
  })

  // Write functions
  const { write: createLease } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: deworkABI,
    functionName: 'createLease',
  })

  const { write: deposit } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: deworkABI,
    functionName: 'deposit',
  })

  const { write: raiseDispute } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: deworkABI,
    functionName: 'raiseDispute',
  })

  const formattedLeases = useMemo(() => {
    if (!leases) return []
    return leases.map((lease: any) => ({
      ...lease,
      depositAmount: BigInt(lease.depositAmount),
      interestEarned: BigInt(lease.interestEarned),
      startDate: BigInt(lease.startDate),
      endDate: BigInt(lease.endDate),
    })) as Lease[]
  }, [leases])

  const formattedTenantLeases = useMemo(() => {
    if (!tenantLeases) return []
    return tenantLeases.map((lease: any) => ({
      ...lease,
      depositAmount: BigInt(lease.depositAmount),
      interestEarned: BigInt(lease.interestEarned),
      startDate: BigInt(lease.startDate),
      endDate: BigInt(lease.endDate),
    })) as Lease[]
  }, [tenantLeases])

  return {
    leases: formattedLeases,
    tenantLeases: formattedTenantLeases,
    isLoadingLeases: isLoadingLeases || isLoadingTenantLeases,
    createLease,
    deposit,
    raiseDispute,
    isContractReady: !!contractAddress,
  }
} 