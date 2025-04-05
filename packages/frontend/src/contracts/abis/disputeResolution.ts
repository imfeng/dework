export const disputeResolutionABI = [
  {
    inputs: [
      { name: 'leaseId', type: 'uint256' },
      { name: 'description', type: 'string' },
    ],
    name: 'createDispute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'leaseId', type: 'uint256' },
      { name: 'vote', type: 'bool' },
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllDisputes',
    outputs: [
      {
        components: [
          { name: 'tokenId', type: 'uint256' },
          { name: 'tenant', type: 'address' },
          { name: 'landlord', type: 'address' },
          { name: 'description', type: 'string' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'votesFor', type: 'uint256' },
          { name: 'votesAgainst', type: 'uint256' },
          { name: 'resolved', type: 'bool' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const 