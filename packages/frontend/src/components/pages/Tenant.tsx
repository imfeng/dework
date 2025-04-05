import React, { useEffect } from 'react';
import { useRole } from '@/contexts/RoleContext';

/**
 * 租客角色轉發頁面
 * 將用戶設置為租客角色並重定向到租客儀表板
 */
const Tenant: React.FC = () => {
  const { setActiveRole } = useRole();

  useEffect(() => {
    // 設置角色並強制導航到租客儀表板
    setTimeout(() => {
      setActiveRole('tenant');
    }, 500); // 稍微延遲以確保UI更新
  }, [setActiveRole]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">切換到租客模式...</h2>
        <p className="text-gray-600">請稍候，系統正在為您載入租客儀表板</p>
      </div>
    </div>
  );
};

export default Tenant;
