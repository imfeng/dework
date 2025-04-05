import React, { useEffect } from 'react';
import { useRole } from '../contexts/RoleContext';

/**
 * 儀表板重定向頁面
 * 根據用戶的角色重定向到對應的儀表板頁面
 */
const Dashboard = () => {
  const { activeRole, isRoleInitialized } = useRole();
  
  useEffect(() => {
    // 確保角色已經初始化
    if (isRoleInitialized) {
      // 重定向到對應的儀表板
      const targetPath = activeRole === 'landlord' 
        ? '/landlord-dashboard' 
        : '/tenant-dashboard';
      
      // 使用完整的頁面導航以確保完全重新載入
      window.location.href = targetPath;
    }
  }, [activeRole, isRoleInitialized]);
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">正在重定向...</h2>
        <p className="text-gray-600">請稍候，系統正在將您導向{activeRole === 'landlord' ? '房東' : '租客'}儀表板</p>
      </div>
    </div>
  );
};

export default Dashboard;
