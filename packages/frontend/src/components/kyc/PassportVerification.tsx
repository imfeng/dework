'use client'

import { useState } from 'react'
import { useKyc } from '@/contexts/KycContext'

interface PassportVerificationProps {
  onComplete: () => void
}

export const PassportVerification = ({ onComplete }: PassportVerificationProps) => {
  const { setPassportData } = useKyc()
  const [passportNumber, setPassportNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await setPassportData({ passportNumber, expiryDate })
      onComplete()
    } catch (error) {
      setError('Failed to verify passport. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Passport Verification</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700">
            Passport Number
          </label>
          <input
            type="text"
            id="passportNumber"
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Verify Passport
        </button>
      </form>
    </div>
  )
} 