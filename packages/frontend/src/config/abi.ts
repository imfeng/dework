export const ENS_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    name: 'available',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

export const DEWORK_ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'location',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'rent',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'deposit',
        type: 'uint256'
      }
    ],
    name: 'createProperty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLandlordProperties',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'propertyId',
        type: 'uint256'
      }
    ],
    name: 'getPropertyDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'location',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'rent',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'landlord',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          }
        ],
        internalType: 'struct Dework.Property',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'propertyId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'duration',
        type: 'uint256'
      }
    ],
    name: 'createLease',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLandlordLeases',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'propertyId',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'tenant',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'rent',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startDate',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          }
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'leaseId',
        type: 'uint256'
      }
    ],
    name: 'payRent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'leaseId',
        type: 'uint256'
      }
    ],
    name: 'requestDepositReturn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getLandlordDeposits',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'propertyId',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'tenant',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'returned',
            type: 'bool'
          }
        ],
        internalType: 'struct Dework.Deposit[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'propertyId',
        type: 'uint256'
      }
    ],
    name: 'getPropertyLeases',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'propertyId',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'tenant',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'rent',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startDate',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          }
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
    inputs: [
      {
        internalType: 'uint256',
        name: 'leaseId',
        type: 'uint256'
      }
    ],
    name: 'getLeaseDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'propertyId',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: 'tenant',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'rent',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'startDate',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'endDate',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          }
        ],
        internalType: 'struct Dework.Lease',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const 