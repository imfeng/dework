import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useConnect, useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { getContract } from '../utils/contracts';
import { Connector } from 'wagmi';

interface Contracts {
  rentalDeposit: ethers.Contract | null;
  interestManager: ethers.Contract | null;
  rentalNFT: ethers.Contract | null;
  usdc: ethers.Contract | null;
}

interface UseWeb3Return {
  provider: ethers.BrowserProvider | null;
  contracts: Contracts;
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: (connector?: Connector) => Promise<boolean>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<boolean>;
  initializeContracts: (networkId: number) => Promise<boolean>;
  chain: ReturnType<typeof useNetwork>['chain'];
  supportedChains: ReturnType<typeof useSwitchNetwork>['chains'];
}

const useWeb3 = (): UseWeb3Return => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contracts, setContracts] = useState<Contracts>({
    rentalDeposit: null,
    interestManager: null,
    rentalNFT: null,
    usdc: null
  });
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { connectAsync, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetworkAsync, chains } = useSwitchNetwork();

  // Initialize provider and contracts
  useEffect(() => {
    const initializeProvider = async (): Promise<void> => {
      try {
        if (window.ethereum) {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);
        } else {
          setError('Please install MetaMask or another Ethereum-compatible browser extension');
        }
      } catch (err) {
        console.error('Failed to initialize provider:', err);
        setError('Failed to connect wallet, please check your browser extension.');
      }
    };

    initializeProvider();
  }, []);

  // Connect wallet
  const connectWallet = async (connector: Connector = connectors[0]): Promise<boolean> => {
    try {
      setIsConnecting(true);
      setError(null);
      
      await connectAsync({ connector });
      
      return true;
    } catch (err) {
      console.error('Connect wallet error:', err);
      setError('Failed to connect wallet, please try again.');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = (): void => {
    disconnect();
  };

  // Switch network
  const switchNetwork = async (chainId: number): Promise<boolean> => {
    try {
      if (switchNetworkAsync) {
        await switchNetworkAsync(chainId);
        return true;
      }
      setError('Network switching is not supported in your wallet');
      return false;
    } catch (err) {
      console.error('Switch network error:', err);
      setError('Failed to switch network, please try again.');
      return false;
    }
  };

  // Initialize contracts
  const initializeContracts = async (networkId: number): Promise<boolean> => {
    try {
      if (!provider) return false;
      
      const signer = await provider.getSigner();
      
      const rentalDepositContract = await getContract('RentalDeposit', provider, signer, networkId);
      const interestManagerContract = await getContract('InterestManager', provider, signer, networkId);
      const rentalNFTContract = await getContract('RentalNFT', provider, signer, networkId);
      const usdcContract = await getContract('USDC', provider, signer, networkId);
      
      setContracts({
        rentalDeposit: rentalDepositContract,
        interestManager: interestManagerContract,
        rentalNFT: rentalNFTContract,
        usdc: usdcContract
      });
      
      return true;
    } catch (err) {
      console.error('Initialize contracts error:', err);
      setError('Failed to initialize contracts, please make sure you are connected to the correct network.');
      return false;
    }
  };

  return {
    provider,
    contracts,
    address,
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    initializeContracts,
    chain,
    supportedChains: chains
  };
};

export default useWeb3; 