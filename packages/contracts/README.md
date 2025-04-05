# Dework Smart Contracts

This package contains the smart contracts for the Dework platform, a decentralized workspace rental protocol.

## Contracts

The main contracts are:

- `Dework.sol`: The core contract that manages workspace leases, deposits, and NFT representation
- `InterestDistribution.sol`: Manages the distribution of yield earned from deposits
- `DisputeResolution.sol`: Handles dispute resolution between landlords and tenants

## Development

### Prerequisites

- Node.js >= 16
- npm or yarn
- An Ethereum wallet with a mnemonic

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Your mnemonic phrase (12 or 24 words)
MNEMONIC="your twelve word mnemonic phrase goes here like this example"

# RPC URLs
HASHKEY_TESTNET_RPC_URL=https://testnet-rpc.hashkeychain.xyz
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_ONE_RPC_URL=https://arb1.arbitrum.io/rpc

# API Keys for verification
ARBISCAN_API_KEY=your_arbiscan_api_key
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

## Deployment

### Deploy to HashKey Testnet

To deploy the contracts to HashKey Testnet:

```bash
npx hardhat run scripts/deploy-hashkey.js --network hashkeyTestnet
```

This will:
1. Deploy all the contracts
2. Set up the necessary roles and permissions
3. Save deployment information to `deployments/hashkeyTestnet.json`

### Run End-to-End Test

To run an end-to-end test on the deployed contracts:

```bash
npx hardhat run scripts/e2e.js --network hashkeyTestnet
```

This script demonstrates the complete workflow:
1. Creating a lease
2. Depositing funds
3. Simulating DeFi yield
4. Distributing yield
5. Releasing the deposit

## Network Support

The project supports the following networks:

- HashKey Testnet (Chain ID: 133)
- Arbitrum Sepolia (Chain ID: 421614)
- Arbitrum One (Chain ID: 42161)

## Security

The contracts use OpenZeppelin's libraries for security best practices:
- Access control
- Reentrancy protection
- Pausability
