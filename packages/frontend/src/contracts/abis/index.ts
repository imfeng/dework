export const deworkABI = [
  // 只讀函數
  {
    inputs: [{ internalType: 'address', name: 'landlord', type: 'address' }],
    name: 'getLandlordLeases',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'address', name: 'tenant', type: 'address' },
          { internalType: 'address', name: 'landlord', type: 'address' },
          { internalType: 'uint256', name: 'depositAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'interestEarned', type: 'uint256' },
          { internalType: 'uint8', name: 'status', type: 'uint8' },
          { internalType: 'uint256', name: 'startDate', type: 'uint256' },
          { internalType: 'uint256', name: 'endDate', type: 'uint256' },
          { internalType: 'string', name: 'ensName', type: 'string' },
          { internalType: 'bytes32', name: 'worldId', type: 'bytes32' }
        ],
        internalType: 'struct Dework.Lease[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'tenant', type: 'address' }],
    name: 'getTenantLeases',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'address', name: 'tenant', type: 'address' },
          { internalType: 'address', name: 'landlord', type: 'address' },
          { internalType: 'uint256', name: 'depositAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'interestEarned', type: 'uint256' },
          { internalType: 'uint8', name: 'status', type: 'uint8' },
          { internalType: 'uint256', name: 'startDate', type: 'uint256' },
          { internalType: 'uint256', name: 'endDate', type: 'uint256' },
          { internalType: 'string', name: 'ensName', type: 'string' },
          { internalType: 'bytes32', name: 'worldId', type: 'bytes32' }
        ],
        internalType: 'struct Dework.Lease[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },

  // 寫入函數
  {
    inputs: [
      { internalType: 'address', name: 'tenant', type: 'address' },
      { internalType: 'uint256', name: 'depositAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
      { internalType: 'string', name: 'ensName', type: 'string' },
      { internalType: 'bytes32', name: 'worldId', type: 'bytes32' }
    ],
    name: 'createLease',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'raiseDispute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

// 匯出爭議解決合約 ABI
export { disputeResolutionABI } from './disputeResolution';
