import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useContractRead, useContractWrite } from 'wagmi'
import TenantDashboard from '../TenantDashboard'

// Mock the hooks
jest.mock('wagmi', () => ({
  useContractRead: jest.fn(),
  useContractWrite: jest.fn(),
}))

describe('TenantDashboard', () => {
  const mockLeases = [
    {
      id: 0,
      propertyId: 0,
      propertyName: 'Test Property 1',
      landlordAddress: '0x1234567890123456789012345678901234567890',
      startDate: '1234567890',
      endDate: '1234567890',
      rent: '1000',
      status: 'ACTIVE',
    },
  ]

  const mockDeposits = [
    {
      id: 0,
      propertyId: 0,
      propertyName: 'Test Property 1',
      amount: '2000',
      status: 'HELD',
      interest: '100',
    },
  ]

  const mockDisputes = [
    {
      id: 0,
      propertyId: 0,
      propertyName: 'Test Property 1',
      status: 'OPEN',
      amount: '1000',
      createdAt: '1234567890',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock values
    ;(useContractRead as jest.Mock).mockImplementation(({ functionName }) => {
      switch (functionName) {
        case 'getTenantLeases':
          return { data: mockLeases, isLoading: false }
        case 'getTenantDeposits':
          return { data: mockDeposits, isLoading: false }
        case 'getTenantDisputes':
          return { data: mockDisputes, isLoading: false }
        default:
          return { data: undefined, isLoading: false }
      }
    })

    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      isLoading: false,
    })
  })

  it('renders loading state correctly', () => {
    ;(useContractRead as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    })

    render(<TenantDashboard />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders leases tab by default', async () => {
    render(<TenantDashboard />)
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument()
    })
  })

  it('switches to deposits tab when clicked', async () => {
    render(<TenantDashboard />)
    fireEvent.click(screen.getByText('Deposits'))
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument()
    })
  })

  it('switches to disputes tab when clicked', async () => {
    render(<TenantDashboard />)
    fireEvent.click(screen.getByText('Disputes'))
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument()
    })
  })

  it('handles rent payment', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<TenantDashboard />)
    fireEvent.click(screen.getByText('Pay Rent'))
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalled()
    })
  })

  it('handles deposit return request', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<TenantDashboard />)
    fireEvent.click(screen.getByText('Request Deposit Return'))
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalled()
    })
  })
}) 