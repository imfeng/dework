import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../contexts/RoleContext';
import useWeb3 from '../hooks/useWeb3';
import { formatAddress, formatAmount, formatAPY, formatDate, getRentalStatusText } from '../utils/helpers';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import withRoleProtection from '../hocs/withRoleProtection';

// 原始的房東儀表板組件
const LandlordDashboardComponent = () => {
  const navigate = useNavigate();
  const { activeRole } = useRole();
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
  
  // 如果未連接錢包，跳轉到連接頁面
  useEffect(() => {
    if (!isConnected) {
      navigate('/connect');
    }
  }, [isConnected, navigate]);
  
  // 初始化合約並載入房東數據
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
                    
                    // 只獲取房東角色的租賃
                    if (rental.landlord.toLowerCase() !== address.toLowerCase()) {
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
              
              setRentals(rentalData.filter(rental => rental !== null));
            } else {
              setRentals([]);
            }
          } catch (err) {
            console.error('獲取用戶租賃ID失敗:', err);
            setRentals([]);
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
  
  // 提前終止租賃
  const handleTerminateEarly = async (rentalId) => {
    try {
      setError(null);
      
      if (!contracts.rentalDeposit) {
        throw new Error('合約未初始化');
      }
      
      const tx = await contracts.rentalDeposit.terminateEarly(rentalId);
      await tx.wait();
      
      // 重新載入數據
      window.location.reload();
    } catch (err) {
      console.error('提前終止錯誤:', err);
      setError(`提前終止租賃失敗: ${err.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 儀表板頭部，包括角色切換按鈕 */}
      <DashboardHeader 
        title="房東儀表板" 
        subtitle="管理您的出租物件和收益" 
        address={address}
        currentRole="landlord"
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 房東信息卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold mb-2">錢包地址</h2>
          <p className="text-gray-700">{address ? formatAddress(address, 8, 6) : '-'}</p>
          <p className="mt-2 text-sm text-blue-600 font-medium">房東模式</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">USDC 餘額</h2>
          <p className="text-gray-700">{formatAmount(usdcBalance)} USDC</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">當前年化收益率</h2>
          <p className="text-green-600 font-medium">{formatAPY(currentAPY)}</p>
        </div>
      </div>
      
      {/* 租賃管理部分 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">我的出租物件</h2>
          <button
            onClick={() => navigate('/create-rental')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            創建新租賃
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <p className="text-gray-500 mb-4">您目前沒有任何出租物件</p>
            <button
              onClick={() => navigate('/create-rental')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              創建第一個租賃合約
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
                    租客地址
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
                      {formatAddress(rental.tenant, 6, 4)}
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
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {getRentalStatusText(rental)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {rental.isActive && (
                        <div className="flex space-x-2">
                          {!rental.inDispute && Date.now() / 1000 >= rental.endTime && (
                            <button
                              onClick={() => handleEndRental(rental.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              結束租賃
                            </button>
                          )}
                          {!rental.inDispute && (
                            <button
                              onClick={() => handleTerminateEarly(rental.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              提前終止
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
      
      {/* 房東專用統計信息 */}
      {rentals.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            我的出租統計
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">總數量</p>
              <p className="text-2xl font-bold text-blue-600">{rentals.length}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">活躍</p>
              <p className="text-2xl font-bold text-blue-600">
                {rentals.filter(r => r.isActive).length}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">爭議中</p>
              <p className="text-2xl font-bold text-blue-600">
                {rentals.filter(r => r.isActive && r.inDispute).length}
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">已完成</p>
              <p className="text-2xl font-bold text-blue-600">
                {rentals.filter(r => !r.isActive).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 使用角色保護高階組件包裝
const LandlordDashboard = withRoleProtection(LandlordDashboardComponent, 'landlord');
export default LandlordDashboard;
