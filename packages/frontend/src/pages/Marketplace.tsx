import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useWeb3 from '@/hooks/useWeb3';
import { formatAddress, formatAmount } from '@/utils/helpers';
import { ethers } from 'ethers';

const Marketplace: React.FC = () => {
  const router = useRouter();
  const { isConnected, address, contracts, chain, initializeContracts } = useWeb3();
  
  const [loading, setLoading] = useState(true);
  const [availableRentals, setAvailableRentals] = useState([]);
  const [error, setError] = useState(null);
  
  // 如果未連接錢包，跳轉到連接頁面
  useEffect(() => {
    if (!isConnected) {
      router.push('/connect');
    }
  }, [isConnected, router.push]);
  
  // 初始化合約並載入數據
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
        
        // 在這個示範版本中使用模擬數據
        const dummyRentals = [
          {
            id: 1,
            name: "台北市中山區商辦空間",
            description: "位於台北市中山區的現代化辦公空間，交通便利，設施齊全。",
            depositAmount: ethers.parseUnits("2000", 6),
            landlord: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
            monthlyRent: ethers.parseUnits("500", 6),
            leaseDuration: 365,
            available: true,
            imageUrl: "/images/property1.jpg"
          },
          {
            id: 2,
            name: "新竹科學園區實驗室",
            description: "適合生技或科技研發的專業實驗室空間，設備先進。",
            depositAmount: ethers.parseUnits("3000", 6),
            landlord: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
            monthlyRent: ethers.parseUnits("800", 6),
            leaseDuration: 730,
            available: true,
            imageUrl: "/images/property2.jpg"
          },
          {
            id: 3,
            name: "台中市西屯區倉儲空間",
            description: "面積寬廣的倉儲空間，交通便利，適合電商或物流企業。",
            depositAmount: ethers.parseUnits("1500", 6),
            landlord: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
            monthlyRent: ethers.parseUnits("400", 6),
            leaseDuration: 365,
            available: true,
            imageUrl: "/images/property3.jpg"
          }
        ];
        
        setAvailableRentals(dummyRentals);
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
  
  // 申請租賃
  const handleApplyRental: React.FC = (rental) => {
    // 在真實應用中，這裡應該跳轉到租賃申請頁面或開啟一個模態框
    alert(`這是Hackathon版本，功能尚未完整實現。您申請了ID為${rental.id}的租賃物件。`);
    // router.push(`/rental-application/${rental.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">可租賃物件市場</h1>
        <p className="text-gray-600">
          瀏覽並申請可用的租賃物件
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 篩選器 (示範版本簡化) */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">篩選條件</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="搜尋關鍵字"
            className="border rounded-lg p-2"
          />
          <select className="border rounded-lg p-2">
            <option value="">所有類型</option>
            <option value="office">辦公室</option>
            <option value="warehouse">倉庫</option>
            <option value="lab">實驗室</option>
          </select>
          <select className="border rounded-lg p-2">
            <option value="">所有地區</option>
            <option value="taipei">台北市</option>
            <option value="taichung">台中市</option>
            <option value="hsinchu">新竹市</option>
          </select>
        </div>
      </div>
      
      {/* 物件列表 */}
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
      ) : availableRentals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">目前沒有可用的租賃物件</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRentals.map((rental) => (
            <div key={rental.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{rental.name}</h3>
                <p className="text-gray-600 mb-4">{rental.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">押金</span>
                    <span className="font-medium">{formatAmount(rental.depositAmount)} USDC</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">月租金</span>
                    <span className="font-medium">{formatAmount(rental.monthlyRent)} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">租期</span>
                    <span className="font-medium">{rental.leaseDuration} 天</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">由 {formatAddress(rental.landlord, 4, 4)} 提供</span>
                  <button
                    onClick={() => handleApplyRental(rental)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                  >
                    申請租賃
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
