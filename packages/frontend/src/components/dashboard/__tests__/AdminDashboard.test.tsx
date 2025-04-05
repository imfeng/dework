import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useContractRead, useContractWrite } from 'wagmi'
import AdminDashboard from '../AdminDashboard'

// Mock the hooks
jest.mock('wagmi', () => ({
  useContractRead: jest.fn(),
  useContractWrite: jest.fn(),
}))

describe('AdminDashboard', () => {
  const mockUsers = [
    {
      address: '0x1234567890123456789012345678901234567890',
      role: 'landlord',
      status: 'ACTIVE',
      createdAt: '1234567890',
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
      parties: ['0x1234567890123456789012345678901234567890', '0x0987654321098765432109876543210987654321'],
    },
  ]

  const mockSettings = {
    platformFee: '100',
    minDeposit: '1000',
    maxLeaseDuration: '12',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock values
    ;(useContractRead as jest.Mock).mockImplementation(({ functionName }) => {
      switch (functionName) {
        case 'getAllUsers':
          return { data: mockUsers, isLoading: false }
        case 'getAllDisputes':
          return { data: mockDisputes, isLoading: false }
        case 'getSettings':
          return { data: mockSettings, isLoading: false }
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

    render(<AdminDashboard />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders users tab by default', async () => {
    render(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    })
  })

  it('switches to disputes tab when clicked', async () => {
    render(<AdminDashboard />)
    fireEvent.click(screen.getByText('Disputes'))
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument()
    })
  })

  it('switches to settings tab when clicked', async () => {
    render(<AdminDashboard />)
    fireEvent.click(screen.getByText('Settings'))
    await waitFor(() => {
      expect(screen.getByText('Platform Fee')).toBeInTheDocument()
    })
  })

  it('handles user role update', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<AdminDashboard />)
    fireEvent.click(screen.getByText('Update Role'))
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalled()
    })
  })

  it('handles dispute resolution', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<AdminDashboard />)
    fireEvent.click(screen.getByText('Resolve Dispute'))
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalled()
    })
  })
}) 