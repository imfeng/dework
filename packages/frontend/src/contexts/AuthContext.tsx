'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useAccount } from 'wagmi'

interface AuthContextType {
  isWorldIdVerified: boolean
  setIsWorldIdVerified: (verified: boolean) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount()
  const [isWorldIdVerified, setIsWorldIdVerified] = useState(false)

  const isAuthenticated = !!address

  return (
    <AuthContext.Provider
      value={{
        isWorldIdVerified,
        setIsWorldIdVerified,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 