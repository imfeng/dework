import React, { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { formatAddress } from '@/utils/helpers';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  address: string;
  currentRole: string;
}

/**
 * Dashboard Header 組件
 * @param {Object} props
 * @param {string} props.title - 儀表板標題
 * @param {string} props.subtitle - 儀表板副標題
 * @param {string} props.address - 用戶錢包地址
 * @param {string} props.currentRole - 當前角色：'landlord' or 'tenant'
 */
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, address, currentRole }) => {
  const { setActiveRole } = useRole();
  const [isSwitching, setIsSwitching] = useState(false);
  
  // 切換到房東視圖
  const switchToLandlord = () => {
    if (!isSwitching && currentRole !== 'landlord') {
      setIsSwitching(true);
      console.log('切換到房東視圖...');
      
      // 加入確認提示
      if (window.confirm('確定要切換到房東視圖嗎？頁面將會重新載入。')) {
        setActiveRole('landlord');
      } else {
        setIsSwitching(false);
      }
    }
  };
  
  // 切換到租客視圖
  const switchToTenant = () => {
    if (!isSwitching && currentRole !== 'tenant') {
      setIsSwitching(true);
      console.log('切換到租客視圖...');
      
      // 加入確認提示
      if (window.confirm('確定要切換到租客視圖嗎？頁面將會重新載入。')) {
        setActiveRole('tenant');
      } else {
        setIsSwitching(false);
      }
    }
  };
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-700">
            {formatAddress(address, 6, 4)}
          </div>
          
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={switchToLandlord}
              disabled={isSwitching || currentRole === 'landlord'}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                isSwitching 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : currentRole === 'landlord'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border border-gray-300`}
            >
              {isSwitching && currentRole !== 'landlord' ? '切換中...' : '房東模式'}
            </button>
            <button
              onClick={switchToTenant}
              disabled={isSwitching || currentRole === 'tenant'}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                isSwitching 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : currentRole === 'tenant'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } border-t border-b border-r border-gray-300`}
            >
              {isSwitching && currentRole !== 'tenant' ? '切換中...' : '租客模式'}
            </button>
          </div>
        </div>
      </div>
      
      {/* 當前模式提示 */}
      <div className={`p-2 rounded-lg mb-4 border-l-4 ${
        currentRole === 'landlord' ? 'bg-blue-50 border-blue-500' : 'bg-green-50 border-green-500'
      }`}>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${
            currentRole === 'landlord' ? 'bg-blue-500' : 'bg-green-500'
          } mr-2`}></div>
          <p className="text-sm">
            您目前正在使用
            <span className={`font-medium ${
              currentRole === 'landlord' ? 'text-blue-700' : 'text-green-700'
            } mx-1`}>
              {currentRole === 'landlord' ? '房東' : '租客'}
            </span>
            視圖 - 可以隨時切換
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
