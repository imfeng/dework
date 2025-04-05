import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useContractRead, useContractWrite } from 'wagmi'
import LandlordDashboard from '../LandlordDashboard'

// Mock the hooks
jest.mock('wagmi', () => ({
  useContractRead: jest.fn(),
  useContractWrite: jest.fn(),
}))

describe('LandlordDashboard', () => {
  const mockProperties = [
    {
      id: 0,
      name: 'Test Property 1',
      location: 'Test Location 1',
      rent: '1000',
      deposit: '2000',
      status: 'AVAILABLE',
    },
  ]

  const mockLeases = [
    {
      id: 0,
      propertyId: 0,
      propertyName: 'Test Property 1',
      tenantAddress: '0x1234567890123456789012345678901234567890',
      startDate: '1234567890',
      endDate: '1234567890',
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

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock values
    ;(useContractRead as jest.Mock).mockImplementation(({ functionName }) => {
      switch (functionName) {
        case 'getLandlordProperties':
          return { data: mockProperties, isLoading: false }
        case 'getLandlordLeases':
          return { data: mockLeases, isLoading: false }
        case 'getLandlordDeposits':
          return { data: mockDeposits, isLoading: false }
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

    render(<LandlordDashboard />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders properties tab by default', async () => {
    render(<LandlordDashboard />)
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument()
    })
  })

  it('switches to leases tab when clicked', async () => {
    render(<LandlordDashboard />)
    fireEvent.click(screen.getByText('Leases'))
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument()
    })
  })

  it('switches to deposits tab when clicked', async () => {
    render(<LandlordDashboard />)
    fireEvent.click(screen.getByText('Deposits'))
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument()
    })
  })

  it('handles property creation', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<LandlordDashboard />)
    fireEvent.click(screen.getByText('Create Property'))
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalled()
    })
  })
}) 