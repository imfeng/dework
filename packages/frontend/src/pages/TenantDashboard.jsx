import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';
import useWeb3 from '../hooks/useWeb3';
import { formatAddress, formatAmount, formatAPY, formatDate, getRentalStatusText } from '../utils/helpers';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import withRoleProtection from '../hocs/withRoleProtection';

// 原始的租客儀表板組件
const TenantDashboardComponent = () => {
  const navigate = useNavigate();
  const { 
    isConnected, 
    address, 
    contracts, 
    provider,
    chain,
    initializeContracts
  } = useWeb3();
  
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);
  const [currentAPY, setCurrentAPY] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [error, setError] = useState(null);
  const [totalDeposit, setTotalDeposit] = useState(0);
  
  // 如果未連接錢包，跳轉到連接頁面
  useEffect(() => {
    if (!isConnected) {
      navigate('/connect');
    }
  }, [isConnected, navigate]);
  
  // 初始化合約並載入租客數據
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 確保合約已初始化
        if (!contracts.rentalDeposit) {
          console.log("Initializing contracts for chain ID:", chain?.id);
          const initialized = await initializeContracts(chain?.id);
          if (!initialized) {
            throw new Error('合約初始化失敗 - 請確認您已連接到正確的網絡並部署合約');
          }
        }
        
        // 載入APY數據
        if (contracts.interestManager) {
          try {
            const apy = await contracts.interestManager.getCurrentAPY();
            setCurrentAPY(apy);
          } catch (err) {
            console.warn('獲取APY失敗:', err);
          }
        }
        
        // 載入USDC餘額
        if (contracts.usdc && address) {
          try {
            const balance = await contracts.usdc.balanceOf(address);
            setUsdcBalance(balance);
          } catch (err) {
            console.warn('獲取USDC餘額失敗:', err);
          }
        }
        
        // 載入用戶的租賃
        if (contracts.rentalDeposit && address) {
          try {
            const userRentalIds = await contracts.rentalDeposit.getUserRentals(address);
            
            // 獲取每個租賃的詳細信息
            if (userRentalIds && userRentalIds.length > 0) {
              const rentalData = await Promise.all(
                userRentalIds.map(async (id) => {
                  try {
                    const rental = await contracts.rentalDeposit.rentals(id);
                    
                    // 只獲取租客角色的租賃
                    if (rental.tenant.toLowerCase() !== address.toLowerCase()) {
                      return null;
                    }
                    
                    return {
                      id: Number(id),
                      depositAmount: rental.depositAmount,
                      startTime: Number(rental.startTime),
                      endTime: Number(rental.endTime),
                      releaseTime: Number(rental.releaseTime || rental.endTime),
                      isActive: rental.isActive,
                      inDispute: rental.inDispute,
                      tenant: rental.tenant,
                      landlord: rental.landlord
                    };
                  } catch (err) {
                    console.warn(`獲取租賃 ${id} 詳情失敗:`, err);
                    return null;
                  }
                })
              );
              
              const validRentals = rentalData.filter(rental => rental !== null);
              setRentals(validRentals);
              
              // 計算總押金
              let totalDepositAmount = 0;
              validRentals.forEach(rental => {
                if (rental.isActive) {
                  totalDepositAmount += Number(rental.depositAmount);
                }
              });
              setTotalDeposit(totalDepositAmount);
            } else {
              setRentals([]);
              setTotalDeposit(0);
            }
          } catch (err) {
            console.error('獲取用戶租賃ID失敗:', err);
            setRentals([]);
            setTotalDeposit(0);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('載入數據錯誤:', err);
        setError(`載入數據失敗: ${err.message}`);
        setLoading(false);
      }
    };
    
    if (isConnected) {
      loadData();
    }
  }, [isConnected, address, contracts, chain, initializeContracts]);
  
  // 結束租賃
  const handleEndRental = async (rentalId) => {
    try {
      setError(null);
      
      if (!contracts.rentalDeposit) {
        throw new Error('合約未初始化');
      }
      
      const tx = await contracts.rentalDeposit.endRental(rentalId);
      await tx.wait();
      
      // 重新載入數據
      window.location.reload();
    } catch (err) {
      console.error('結束租賃錯誤:', err);
      setError(`結束租賃失敗: ${err.message}`);
    }
  };
  
  // 提出爭議
  const handleRaiseDispute = async (rentalId) => {
    try {
      setError(null);
      
      if (!contracts.rentalDeposit) {
        throw new Error('合約未初始化');
      }
      
      const tx = await contracts.rentalDeposit.raiseDispute(rentalId);
      await tx.wait();
      
      // 重新載入數據
      window.location.reload();
    } catch (err) {
      console.error('提出爭議錯誤:', err);
      setError(`提出爭議失敗: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 儀表板頭部，包括角色切換按鈕 */}
      <DashboardHeader 
        title="租客儀表板" 
        subtitle="管理您的承租物件和押金" 
        address={address}
        currentRole="tenant"
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 租客信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold mb-2">錢包地址</h2>
          <p className="text-gray-700">{address ? formatAddress(address, 8, 6) : '-'}</p>
          <p className="mt-2 text-sm text-green-600 font-medium">租客模式</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">USDC 餘額</h2>
          <p className="text-gray-700">{formatAmount(usdcBalance)} USDC</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">押金收益率</h2>
          <p className="text-green-600 font-medium">{formatAPY(currentAPY)}</p>
        </div>
      </div>
      
      {/* 租賃管理部分 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">我的承租物件</h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            瀏覽可租物件
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2">載入中...</span>
          </div>
        ) : !contracts.rentalDeposit ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">合約未初始化。請確認您已連接到正確的網絡並部署合約。</p>
            {chain && (
              <p className="text-sm text-gray-400">當前網絡: {chain.name} (ID: {chain.id})</p>
            )}
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">您目前沒有任何承租物件</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              瀏覽可租物件
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    房東地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    押金金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    開始日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    結束日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rentals.map((rental) => (
                  <tr key={rental.id} className={rental.isActive ? '' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rental.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatAddress(rental.landlord, 6, 4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(rental.depositAmount)} USDC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rental.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rental.endTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        !rental.isActive ? 'bg-gray-100 text-gray-800' :
                        rental.inDispute ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {getRentalStatusText(rental)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {rental.isActive && (
                        <div className="flex space-x-2">
                          {!rental.inDispute && Date.now() / 1000 >= rental.releaseTime && (
                            <button
                              onClick={() => handleEndRental(rental.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              提取押金
                            </button>
                          )}
                          {!rental.inDispute && Date.now() / 1000 < rental.releaseTime && (
                            <button
                              onClick={() => handleRaiseDispute(rental.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              提出爭議
                            </button>
                          )}
                        </div>
                      )}
                      
                      {!rental.isActive && (
                        <span className="text-gray-500">已完成</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* 押金收益計算 */}
      {rentals.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">押金收益計算</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">押金收益</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">累計押金</span>
                  <span className="font-medium">{formatAmount(totalDeposit)} USDC</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">預計年收益</span>
                  <span className="font-medium text-green-600">
                    {formatAmount((totalDeposit * currentAPY) / 100)} USDC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">預計月收益</span>
                  <span className="font-medium text-green-600">
                    {formatAmount((totalDeposit * currentAPY) / 100 / 12)} USDC
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">押金保障</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">押金存放在智能合約中，無需信任房東</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">租約結束後自動退還押金及收益</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">爭議時可啟動仲裁機制保護您的權益</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 使用角色保護高階組件包裝
const TenantDashboard = withRoleProtection(TenantDashboardComponent, 'tenant');
export default TenantDashboard;
