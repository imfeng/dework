import { useContractRead, useContractWrite } from 'wagmi'
import { disputeResolutionABI } from '@/contracts/abis'
import { Dispute } from '@/contracts/types'
import { useMemo } from 'react'

export const useDisputeResolution = () => {
  const contractAddress = process.env.NEXT_PUBLIC_DISPUTE_RESOLUTION_ADDRESS

  // Read functions
  const { data: disputes, isLoading: isLoadingDisputes } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: disputeResolutionABI,
    functionName: 'getAllDisputes',
    enabled: !!contractAddress,
  })

  // Write functions
  const { write: createDispute } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: disputeResolutionABI,
    functionName: 'createDispute',
  })

  const { write: vote } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: disputeResolutionABI,
    functionName: 'vote',
  })

  const formattedDisputes = useMemo(() => {
    if (!disputes) return []
    return disputes.map((dispute: any) => ({
      ...dispute,
      tokenId: BigInt(dispute.tokenId),
      createdAt: BigInt(dispute.createdAt),
      votesFor: BigInt(dispute.votesFor),
      votesAgainst: BigInt(dispute.votesAgainst),
    })) as Dispute[]
  }, [disputes])

  return {
    disputes: formattedDisputes,
    isLoadingDisputes,
    createDispute,
    vote,
    isContractReady: !!contractAddress,
  }
} 