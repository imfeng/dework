'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Notification } from '@/components/common/Notification'

interface NotificationType {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface NotificationContextType {
  showNotification: (type: NotificationType['type'], message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])

  const showNotification = (type: NotificationType['type'], message: string) => {
    const id = crypto.randomUUID()
    setNotifications((prev) => [...prev, { id, type, message }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
} 