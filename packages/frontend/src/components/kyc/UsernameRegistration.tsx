'use client'

import { useState } from 'react'
import { useKyc } from '@/contexts/KycContext'

interface UsernameRegistrationProps {
  onComplete: () => void
}

export const UsernameRegistration = ({ onComplete }: UsernameRegistrationProps) => {
  const { setUsername } = useKyc()
  const [username, setUsernameInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await setUsername(username)
      onComplete()
    } catch (error) {
      setError('Failed to set username. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Choose Your Username</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </form>
    </div>
  )
} 