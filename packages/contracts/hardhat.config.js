require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { ethers } = require("ethers");

const MNEMONIC = process.env.MNEMONIC || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
      // Needed for consistency in tests
      initialBaseFeePerGas: 0
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    hashkeyTestnet: {
      url: process.env.HASHKEY_TESTNET_RPC_URL || "",
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20
      },
      chainId: 133
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_RPC_URL || "",
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20
      },
      chainId: 421614
    },
    arbitrumOne: {
      url: process.env.ARBITRUM_ONE_RPC_URL || "",
      accounts: {
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20
      },
      chainId: 42161
    }
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || ""
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deployments: "./deployments"
  },
  // Force ethers version to be compatible with tests
  mocha: {
    timeout: 40000
  }
};