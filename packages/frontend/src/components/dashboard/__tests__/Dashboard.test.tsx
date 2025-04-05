import { render, screen, waitFor } from '@testing-library/react'
import { useAccount, useContractRead } from 'wagmi'
import { useKyc } from '@/contexts/KycContext'
import Dashboard from '../Dashboard'

// Mock the hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useContractRead: jest.fn(),
}))

jest.mock('@/contexts/KycContext', () => ({
  useKyc: jest.fn(),
}))

describe('Dashboard', () => {
  const mockAddress = '0x1234567890123456789012345678901234567890'

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    // Setup default mock values
    ;(useAccount as jest.Mock).mockReturnValue({
      address: mockAddress,
      isConnected: true,
    })
    ;(useContractRead as jest.Mock).mockReturnValue({
      data: 'landlord',
      isLoading: false,
    })
    ;(useKyc as jest.Mock).mockReturnValue({
      isKycCompleted: true,
    })
  })

  it('renders loading state correctly', () => {
    ;(useContractRead as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    })

    render(<Dashboard />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders wallet connection prompt when not connected', () => {
    ;(useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    })

    render(<Dashboard />)
    expect(screen.getByText('Please connect your wallet')).toBeInTheDocument()
  })

  it('renders KYC completion prompt when KYC is not completed', () => {
    ;(useKyc as jest.Mock).mockReturnValue({
      isKycCompleted: false,
    })

    render(<Dashboard />)
    expect(screen.getByText('Please complete KYC verification')).toBeInTheDocument()
  })

  it('renders LandlordDashboard for landlord role', async () => {
    ;(useContractRead as jest.Mock).mockReturnValue({
      data: 'landlord',
      isLoading: false,
    })

    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Landlord Dashboard')).toBeInTheDocument()
    })
  })

  it('renders TenantDashboard for tenant role', async () => {
    ;(useContractRead as jest.Mock).mockReturnValue({
      data: 'tenant',
      isLoading: false,
    })

    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Tenant Dashboard')).toBeInTheDocument()
    })
  })

  it('renders AdminDashboard for admin role', async () => {
    ;(useContractRead as jest.Mock).mockReturnValue({
      data: 'admin',
      isLoading: false,
    })

    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    })
  })
}) 