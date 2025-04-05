import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useContractWrite } from 'wagmi'
import TenantActions from '../TenantActions'

// Mock the hooks
jest.mock('wagmi', () => ({
  useContractWrite: jest.fn(),
}))

describe('TenantActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock values
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      isLoading: false,
    })
  })

  it('renders rent payment section correctly', () => {
    render(<TenantActions propertyId={0} rentAmount="1000" />)
    expect(screen.getByText('Pay Rent')).toBeInTheDocument()
    expect(screen.getByText('Amount: 1000 USDC')).toBeInTheDocument()
  })

  it('handles rent payment', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<TenantActions propertyId={0} rentAmount="1000" />)
    fireEvent.click(screen.getByText('Pay Rent'))
    
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalledWith({
        args: [0, '1000'],
      })
    })
  })

  it('disables pay rent button when loading', () => {
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      isLoading: true,
    })

    render(<TenantActions propertyId={0} rentAmount="1000" />)
    const button = screen.getByText('Pay Rent')
    expect(button).toBeDisabled()
  })

  it('renders deposit return section correctly', () => {
    render(<TenantActions propertyId={0} rentAmount="1000" />)
    expect(screen.getByText('Request Deposit Return')).toBeInTheDocument()
  })

  it('handles deposit return request', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<TenantActions propertyId={0} rentAmount="1000" />)
    fireEvent.click(screen.getByText('Request Deposit Return'))
    
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalledWith({
        args: [0],
      })
    })
  })

  it('disables deposit return button when loading', () => {
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      isLoading: true,
    })

    render(<TenantActions propertyId={0} rentAmount="1000" />)
    const button = screen.getByText('Request Deposit Return')
    expect(button).toBeDisabled()
  })
}) 