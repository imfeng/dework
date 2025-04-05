import React, { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';

/**
 * 角色保護高階組件 - 強制重新導向實現
 * 
 * @param {React.Component} Component 要包裝的組件
 * @param {string} requiredRole 需要的角色 'landlord' 或 'tenant'
 * @returns {React.Component} 受保護的組件
 */
const withRoleProtection: React.FC = (Component, requiredRole) => {
  const ProtectedComponent: React.FC = (props) => {
    const { activeRole, isRoleInitialized } = useRole();
    
    // 當角色初始化後，如果不匹配則強制重定向
    useEffect(() => {
      // 確保角色已從 localStorage 讀取完成
      if (isRoleInitialized && activeRole !== requiredRole) {
        console.log(`目前角色 ${activeRole} 與所需角色 ${requiredRole} 不符，正在重定向...`);
        const redirectPath = requiredRole === 'landlord' ? '/landlord-dashboard' : '/tenant-dashboard';
        window.location.href = redirectPath;
      }
    }, [activeRole, isRoleInitialized]);

    // 如果角色還未初始化或不匹配，顯示載入中
    if (!isRoleInitialized || activeRole !== requiredRole) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-2">驗證角色中...</h2>
            <p className="text-gray-600">請稍候，系統正在確認您的訪問權限</p>
          </div>
        </div>
      );
    }

    // 角色匹配，渲染原始組件
    return <Component {...props} />;
  };

  return ProtectedComponent;
};

export default withRoleProtection;
