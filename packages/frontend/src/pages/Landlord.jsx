import React, { useEffect } from 'react';
import { useRole } from '../contexts/RoleContext';

/**
 * 房東角色轉發頁面
 * 將用戶設置為房東角色並重定向到房東儀表板
 */
const Landlord = () => {
  const { setActiveRole } = useRole();

  useEffect(() => {
    // 設置角色並強制導航到房東儀表板
    setTimeout(() => {
      setActiveRole('landlord');
    }, 500); // 稍微延遲以確保UI更新
  }, [setActiveRole]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold mb-2">切換到房東模式...</h2>
        <p className="text-gray-600">請稍候，系統正在為您載入房東儀表板</p>
      </div>
    </div>
  );
};

export default Landlord;
