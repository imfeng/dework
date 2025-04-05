import { ethers } from 'ethers';
import RentalDepositABI from '../abi/RentalDeposit.json';
import InterestManagerABI from '../abi/InterestManager.json';
import RentalNFTABI from '../abi/RentalNFT.json';
import USDCABI from '../abi/USDC.json';

interface ContractAddresses {
  RentalDeposit: string;
  InterestManager: string;
  RentalNFT: string;
  USDC: string;
}

interface ContractAddressMap {
  [networkId: number]: ContractAddresses;
}

interface ContractABIMap {
  [contractName: string]: any;
}

interface DeploymentInfo {
  rentalDeposit: string;
  interestManager: string;
  rentalNFT: string;
  stablecoin?: string;
}

// Contract addresses (by network ID)
const CONTRACT_ADDRESSES: ContractAddressMap = {
  // Hardhat local development
  31337: {
    RentalDeposit: '',  // Fill after deployment
    InterestManager: '',
    RentalNFT: '',
    USDC: ''
  },
  // Arbitrum Sepolia testnet
  421614: {
    RentalDeposit: '',  // Fill after deployment
    InterestManager: '',
    RentalNFT: '',
    USDC: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'  // USDC on Arbitrum Sepolia
  },
  // Arbitrum
  42161: {
    RentalDeposit: '',  // Fill after deployment
    InterestManager: '',
    RentalNFT: '',
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'  // USDC on Arbitrum
  },
  // HashKey Chain
  1506: {
    RentalDeposit: '',  // Fill after deployment
    InterestManager: '',
    RentalNFT: '',
    USDC: '0x4C84560A1081774103edBffc2DeA1B643839eA66'  // USDT on HashKey (as example)
  }
};

// Contract ABIs
const CONTRACT_ABIS: ContractABIMap = {
  RentalDeposit: RentalDepositABI,
  InterestManager: InterestManagerABI,
  RentalNFT: RentalNFTABI,
  USDC: USDCABI
};

// Get contract instance
export const getContract = async (
  contractName: string, 
  provider: ethers.Provider, 
  signer?: ethers.Signer, 
  networkId: number = 31337
): Promise<ethers.Contract | null> => {
  try {
    // Get contract address
    const address = CONTRACT_ADDRESSES[networkId]?.[contractName as keyof ContractAddresses];
    if (!address) {
      console.error(`Contract ${contractName} does not exist on network ${networkId}`);
      return null;
    }
    
    // Get contract ABI
    const abi = CONTRACT_ABIS[contractName];
    if (!abi) {
      console.error(`Cannot find ABI for contract ${contractName}`);
      return null;
    }
    
    // Create contract instance
    const contract = new ethers.Contract(
      address,
      abi,
      signer || provider
    );
    
    return contract;
  } catch (error) {
    console.error(`Failed to get contract instance for ${contractName}:`, error);
    return null;
  }
};

// Update contract address
export const updateContractAddress = (
  networkId: number, 
  contractName: string, 
  address: string
): void => {
  if (!CONTRACT_ADDRESSES[networkId]) {
    CONTRACT_ADDRESSES[networkId] = {
      RentalDeposit: '',
      InterestManager: '',
      RentalNFT: '',
      USDC: ''
    };
  }
  
  CONTRACT_ADDRESSES[networkId][contractName as keyof ContractAddresses] = address;
};

// Get network name
export const getNetworkName = (networkId: number): string => {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    31337: 'Hardhat Local',
    42161: 'Arbitrum One',
    421614: 'Arbitrum Sepolia',
    1506: 'HashKey Chain'
  };
  
  return networks[networkId] || `Unknown Network (${networkId})`;
};

// Load contract addresses from deployment file
export const loadContractAddresses = async (networkId: number): Promise<boolean> => {
  try {
    const response = await fetch(`/deployments/${networkId}_deployment.json`);
    if (!response.ok) {
      throw new Error(`Unable to load deployment info for network ${networkId}`);
    }
    
    const deploymentInfo: DeploymentInfo = await response.json();
    
    updateContractAddress(networkId, 'RentalDeposit', deploymentInfo.rentalDeposit);
    updateContractAddress(networkId, 'InterestManager', deploymentInfo.interestManager);
    updateContractAddress(networkId, 'RentalNFT', deploymentInfo.rentalNFT);
    
    if (deploymentInfo.stablecoin) {
      updateContractAddress(networkId, 'USDC', deploymentInfo.stablecoin);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to load contract addresses:', error);
    return false;
  }
}; 