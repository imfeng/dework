export const DEWORK_ABI = [
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getUserRole',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllProperties',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'location', type: 'string' },
          { name: 'rent', type: 'uint256' },
          { name: 'deposit', type: 'uint256' },
          { name: 'landlord', type: 'address' },
          { name: 'status', type: 'string' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'id', type: 'uint256' }],
    name: 'getProperty',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'location', type: 'string' },
          { name: 'rent', type: 'uint256' },
          { name: 'deposit', type: 'uint256' },
          { name: 'landlord', type: 'address' },
          { name: 'status', type: 'string' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'location', type: 'string' },
      { name: 'rent', type: 'uint256' },
      { name: 'deposit', type: 'uint256' },
    ],
    name: 'createProperty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'propertyId', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
    ],
    name: 'rentProperty',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'propertyId', type: 'uint256' }],
    name: 'getPropertyNFT',
    outputs: [
      {
        components: [
          { name: 'tenant', type: 'address' },
          { name: 'expiresAt', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'propertyId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'payRent',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'propertyId', type: 'uint256' }],
    name: 'requestDepositReturn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLandlordProperties',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'name', type: 'string' },
          { name: 'location', type: 'string' },
          { name: 'rent', type: 'uint256' },
          { name: 'deposit', type: 'uint256' },
          { name: 'landlord', type: 'address' },
          { name: 'status', type: 'string' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLandlordLeases',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'propertyId', type: 'uint256' },
          { name: 'propertyName', type: 'string' },
          { name: 'tenantAddress', type: 'address' },
          { name: 'startDate', type: 'uint256' },
          { name: 'endDate', type: 'uint256' },
          { name: 'status', type: 'string' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLandlordDeposits',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'propertyId', type: 'uint256' },
          { name: 'propertyName', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'status', type: 'string' },
          { name: 'interest', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTenantLeases',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'propertyId', type: 'uint256' },
          { name: 'propertyName', type: 'string' },
          { name: 'landlordAddress', type: 'address' },
          { name: 'startDate', type: 'uint256' },
          { name: 'endDate', type: 'uint256' },
          { name: 'rent', type: 'uint256' },
          { name: 'status', type: 'string' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTenantDeposits',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'propertyId', type: 'uint256' },
          { name: 'propertyName', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'status', type: 'string' },
          { name: 'interest', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTenantDisputes',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'propertyId', type: 'uint256' },
          { name: 'propertyName', type: 'string' },
          { name: 'status', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllUsers',
    outputs: [
      {
        components: [
          { name: 'address', type: 'address' },
          { name: 'role', type: 'string' },
          { name: 'status', type: 'string' },
          { name: 'createdAt', type: 'uint256' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllDisputes',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'propertyId', type: 'uint256' },
          { name: 'propertyName', type: 'string' },
          { name: 'status', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'parties', type: 'address[]' },
        ],
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getSettings',
    outputs: [
      {
        components: [
          { name: 'platformFee', type: 'uint256' },
          { name: 'minDeposit', type: 'uint256' },
          { name: 'maxLeaseDuration', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const ENS_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'owner', type: 'address' }
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'name', type: 'string' }],
    name: 'available',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const 