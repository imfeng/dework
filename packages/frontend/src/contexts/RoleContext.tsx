'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Role = 'landlord' | 'tenant'

interface RoleContextType {
  activeRole: Role
  setActiveRole: (role: Role) => void
  isRoleInitialized: boolean
}

// 建立角色上下文
const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [isRoleInitialized, setIsRoleInitialized] = useState(false)
  const [activeRole, setActiveRole] = useState<Role>('tenant') // 預設為租客

  // 初始化時從 localStorage 讀取角色
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRole = localStorage.getItem('dework_active_role')
        if (storedRole === 'landlord' || storedRole === 'tenant') {
          setActiveRole(storedRole)
        } else {
          // 如果沒有有效的角色，設置為默認值並存儲
          localStorage.setItem('dework_active_role', 'tenant')
        }
      } catch (error) {
        console.error('讀取角色時出錯:', error)
        localStorage.setItem('dework_active_role', 'tenant')
      } finally {
        setIsRoleInitialized(true)
      }
    }
  }, [])

  // 強制頁面重載的角色切換函數
  const forceRoleChange = (role: Role) => {
    try {
      // 存儲新角色
      localStorage.setItem('dework_active_role', role)
      setActiveRole(role)
      
      // 獲取目標頁面
      const targetPath = role === 'landlord' 
        ? '/landlord-dashboard' 
        : '/tenant-dashboard'
      
      // 強制頁面重載到目標路徑
      console.log(`切換角色為 ${role}，重定向到 ${targetPath}`)
      window.location.href = targetPath
    } catch (error) {
      console.error('切換角色時出錯:', error)
      alert('切換角色時出錯，請重試')
    }
  }

  const contextValue = {
    activeRole,
    setActiveRole: forceRoleChange,
    isRoleInitialized
  }

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  )
}

// 自定義 Hook 用於訪問角色上下文
export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
