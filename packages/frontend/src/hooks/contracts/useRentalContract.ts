import { useState } from 'react';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { RentalDeposit_ABI, InterestManager_ABI, USDC_ABI } from '@/constants/abi';
import { formatAddress } from '@/utils/helpers';

export const useRentalContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { address } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  
  // 獲取合約實例
  const rentalDepositContract = useContract({
    address: process.env.NEXT_PUBLIC_RENTAL_DEPOSIT_ADDRESS as `0x${string}`,
    abi: RentalDeposit_ABI,
    signerOrProvider: signer || provider,
  });
  
  const interestManagerContract = useContract({
    address: process.env.NEXT_PUBLIC_INTEREST_MANAGER_ADDRESS as `0x${string}`,
    abi: InterestManager_ABI,
    signerOrProvider: signer || provider,
  });
  
  const usdcContract = useContract({
    address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
    abi: USDC_ABI,
    signerOrProvider: signer || provider,
  });
  
  // 獲取房東的租賃
  const getLandlordRentals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!rentalDepositContract || !address) {
        throw new Error('合約未初始化或地址不可用');
      }
      
      // 獲取用戶的租賃 ID
      const rentalIds = await rentalDepositContract.getUserRentals(address);
      
      // 獲取每個租賃的詳細信息
      const rentalsData = await Promise.all(
        rentalIds.map(async (id: string) => {
          const rental = await rentalDepositContract.rentals(id);
          
          // 檢查當前用戶是否是房東
          if (rental.landlord.toLowerCase() !== address.toLowerCase()) {
            return null;
          }
          
          return {
            id: id.toString(),
            depositAmount: rental.depositAmount.toString(),
            startTime: rental.startTime.toNumber(),
            endTime: rental.endTime.toNumber(),
            releaseTime: rental.releaseTime ? rental.releaseTime.toNumber() : rental.endTime.toNumber(),
            isActive: rental.isActive,
            inDispute: rental.inDispute,
            tenant: formatAddress(rental.tenant),
            landlord: formatAddress(rental.landlord),
            propertyId: rental.propertyId ? rental.propertyId.toString() : null,
          };
        })
      );
      
      return rentalsData.filter(rental => rental !== null);
    } catch (err) {
      console.error('獲取房東租賃錯誤:', err);
      setError('獲取房東租賃數據失敗');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // 獲取租客的租賃
  const getTenantRentals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!rentalDepositContract || !address) {
        throw new Error('合約未初始化或地址不可用');
      }
      
      // 獲取用戶的租賃 ID
      const rentalIds = await rentalDepositContract.getUserRentals(address);
      
      // 獲取每個租賃的詳細信息
      const rentalsData = await Promise.all(
        rentalIds.map(async (id: string) => {
          const rental = await rentalDepositContract.rentals(id);
          
          // 檢查當前用戶是否是租客
          if (rental.tenant.toLowerCase() !== address.toLowerCase()) {
            return null;
          }
          
          return {
            id: id.toString(),
            depositAmount: rental.depositAmount.toString(),
            startTime: rental.startTime.toNumber(),
            endTime: rental.endTime.toNumber(),
            releaseTime: rental.releaseTime ? rental.releaseTime.toNumber() : rental.endTime.toNumber(),
            isActive: rental.isActive,
            inDispute: rental.inDispute,
            tenant: formatAddress(rental.tenant),
            landlord: formatAddress(rental.landlord),
            propertyId: rental.propertyId ? rental.propertyId.toString() : null,
          };
        })
      );
      
      return rentalsData.filter(rental => rental !== null);
    } catch (err) {
      console.error('獲取租客租賃錯誤:', err);
      setError('獲取租客租賃數據失敗');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // 結束租賃
  const endRental = async (rentalId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!rentalDepositContract || !signer) {
        throw new Error('合約未初始化或簽名者不可用');
      }
      
      const tx = await rentalDepositContract.endRental(rentalId);
      await tx.wait();
      
      return true;
    } catch (err) {
      console.error('結束租賃錯誤:', err);
      setError('結束租賃失敗');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // 提出爭議
  const raiseDispute = async (rentalId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!rentalDepositContract || !signer) {
        throw new Error('合約未初始化或簽名者不可用');
      }
      
      const tx = await rentalDepositContract.raiseDispute(rentalId);
      await tx.wait();
      
      return true;
    } catch (err) {
      console.error('提出爭議錯誤:', err);
      setError('提出爭議失敗');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // 提前終止租賃
  const terminateEarly = async (rentalId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!rentalDepositContract || !signer) {
        throw new Error('合約未初始化或簽名者不可用');
      }
      
      const tx = await rentalDepositContract.terminateEarly(rentalId);
      await tx.wait();
      
      return true;
    } catch (err) {
      console.error('提前終止租賃錯誤:', err);
      setError('提前終止租賃失敗');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // 創建新租賃
  const createRental = async (tenantAddress: string, depositAmount: string, durationDays: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!rentalDepositContract || !signer || !usdcContract) {
        throw new Error('合約未初始化或簽名者不可用');
      }
      
      // 檢查 USDC 餘額
      const balance = await usdcContract.balanceOf(address);
      const depositAmountBN = ethers.utils.parseUnits(depositAmount, 6); // USDC 有 6 位小數
      
      if (balance.lt(depositAmountBN)) {
        throw new Error('USDC 餘額不足');
      }
      
      // 檢查是否已批准合約花費 USDC
      const allowance = await usdcContract.allowance(address, rentalDepositContract.address);
      
      if (allowance.lt(depositAmountBN)) {
        // 需要批准
        const approveTx = await usdcContract.approve(rentalDepositContract.address, depositAmountBN);
        await approveTx.wait();
      }
      
      // 創建租賃
      const startTime = Math.floor(Date.now() / 1000); // 當前時間戳（秒）
      const endTime = startTime + (durationDays * 24 * 60 * 60); // 結束時間為 durationDays 天後
      
      const tx = await rentalDepositContract.createRental(
        tenantAddress,
        depositAmountBN,
        startTime,
        endTime
      );
      
      const receipt = await tx.wait();
      
      // 從事件中獲取租賃 ID
      const rentalCreatedEvent = receipt.events.find(
        (event: any) => event.event === 'RentalCreated'
      );
      
      if (rentalCreatedEvent) {
        const rentalId = rentalCreatedEvent.args.rentalId.toString();
        return { success: true, rentalId };
      }
      
      return { success: true };
    } catch (err) {
      console.error('創建租賃錯誤:', err);
      setError('創建租賃失敗');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // 獲取當前 APY
  const getCurrentAPY = async () => {
    try {
      if (!interestManagerContract) {
        return 0;
      }
      
      const apy = await interestManagerContract.getCurrentAPY();
      return apy / 100; // 假設合約返回的是基點（1% = 100 基點）
    } catch (err) {
      console.error('獲取 APY 錯誤:', err);
      return 0;
    }
  };
  
  // 獲取 USDC 餘額
  const getUsdcBalance = async () => {
    try {
      if (!usdcContract || !address) {
        return 0;
      }
      
      const balance = await usdcContract.balanceOf(address);
      return balance.toString();
    } catch (err) {
      console.error('獲取 USDC 餘額錯誤:', err);
      return 0;
    }
  };
  
  return {
    getLandlordRentals,
    getTenantRentals,
    endRental,
    raiseDispute,
    terminateEarly,
    createRental,
    getCurrentAPY,
    getUsdcBalance,
    loading,
    error,
  };
};
