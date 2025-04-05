'use client'

import { useEffect, useState } from 'react'

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export const Notification = ({ type, message, onClose }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
  }

  const textColor = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  }

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${bgColor[type]} ${textColor[type]} flex items-center space-x-2`}
    >
      <div className="flex-1">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  )
} 