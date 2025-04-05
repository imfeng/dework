import { ethers } from 'ethers';

interface Rental {
  isActive: boolean;
  inDispute: boolean;
  endTime: number;
  releaseTime: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

// Format wallet address, showing the first few and last few characters
export const formatAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (!address || address.length < (start + end)) return address;
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
};

// Format amount, convert to more readable form
export const formatAmount = (amount: string | number, decimals: number = 6, displayDecimals: number = 2): string => {
  if (!amount) return '0';
  
  try {
    const formattedAmount = ethers.formatUnits(amount.toString(), decimals);
    const numericAmount = parseFloat(formattedAmount);
    return numericAmount.toLocaleString(undefined, {
      minimumFractionDigits: displayDecimals,
      maximumFractionDigits: displayDecimals
    });
  } catch (error) {
    console.error('Format amount error:', error);
    return '0';
  }
};

// Parse amount, convert to format used on blockchain
export const parseAmount = (amount: string | number, decimals: number = 6): string => {
  if (!amount) return '0';
  
  try {
    // Remove all non-numeric and non-decimal point characters
    const cleanAmount = amount.toString().replace(/[^\d.]/g, '');
    return ethers.parseUnits(cleanAmount, decimals).toString();
  } catch (error) {
    console.error('Parse amount error:', error);
    return '0';
  }
};

// Format date
export const formatDate = (timestamp: number | string): string => {
  if (!timestamp) return '';
  
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate remaining time (days/hours/minutes)
export const calculateTimeRemaining = (targetTimestamp: number | string): TimeRemaining => {
  if (!targetTimestamp) return { days: 0, hours: 0, minutes: 0 };
  
  const now = Math.floor(Date.now() / 1000);
  const targetTime = Number(targetTimestamp);
  
  if (now >= targetTime) return { days: 0, hours: 0, minutes: 0 };
  
  const secondsRemaining = targetTime - now;
  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  
  return { days, hours, minutes };
};

// Format remaining time to readable string
export const formatTimeRemaining = (targetTimestamp: number | string): string => {
  const { days, hours, minutes } = calculateTimeRemaining(targetTimestamp);
  
  if (days > 0) {
    return `${days}天 ${hours}小時`;
  } else if (hours > 0) {
    return `${hours}小時 ${minutes}分鐘`;
  } else if (minutes > 0) {
    return `${minutes}分鐘`;
  } else {
    return '時間已到';
  }
};

// Format annual yield rate
export const formatAPY = (apy: number | string): string => {
  if (!apy) return '0%';
  
  // APY usually uses 10000 as base, e.g., 500 means 5%
  const apyValue = (Number(apy) / 100).toFixed(2);
  return `${apyValue}%`;
};

// Status description conversion
export const getRentalStatusText = (rental: Rental | null): string => {
  if (!rental) return '未知狀態';
  
  const now = Math.floor(Date.now() / 1000);
  
  if (!rental.isActive) return '已完成';
  if (rental.inDispute) return '爭議中';
  if (now < rental.endTime) return '進行中';
  if (now < rental.releaseTime) return '等待押金釋放';
  return '可以結束';
};

// Get transaction view link
export const getExplorerUrl = (txHash: string, networkId: number): string => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
    5: 'https://goerli.etherscan.io',
    42161: 'https://arbiscan.io',
    421614: 'https://sepolia.arbiscan.io',
    1506: 'https://explorer.hashkey.com'
  };
  
  const baseUrl = explorers[networkId] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
};

// Sleep function
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Wait for transaction confirmation
export const waitForTransaction = async (provider: ethers.Provider, txHash: string, confirmations: number = 1): Promise<ethers.TransactionReceipt> => {
  try {
    return await provider.waitForTransaction(txHash, confirmations);
  } catch (error) {
    console.error('Wait for transaction confirmation error:', error);
    throw error;
  }
}; 