import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useContractRead, useContractWrite } from 'wagmi'
import PropertyNFT from '../PropertyNFT'

// Mock the hooks
jest.mock('wagmi', () => ({
  useContractRead: jest.fn(),
  useContractWrite: jest.fn(),
}))

describe('PropertyNFT', () => {
  const mockNFT = {
    tenant: '0x1234567890123456789012345678901234567890',
    expiresAt: '1234567890',
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock values
    ;(useContractRead as jest.Mock).mockReturnValue({
      data: mockNFT,
      isLoading: false,
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

    render(<PropertyNFT propertyId={0} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders NFT details correctly', async () => {
    render(<PropertyNFT propertyId={0} />)
    await waitFor(() => {
      expect(screen.getByText('Tenant:')).toBeInTheDocument()
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
      expect(screen.getByText('Expires At:')).toBeInTheDocument()
    })
  })

  it('handles rental duration change', async () => {
    render(<PropertyNFT propertyId={0} />)
    const input = screen.getByLabelText('Rental Duration (months)')
    fireEvent.change(input, { target: { value: '12' } })
    expect(input).toHaveValue('12')
  })

  it('handles rent button click', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<PropertyNFT propertyId={0} />)
    fireEvent.click(screen.getByText('Rent Property'))
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalled()
    })
  })

  it('disables rent button when loading', async () => {
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      isLoading: true,
    })

    render(<PropertyNFT propertyId={0} />)
    const button = screen.getByText('Rent Property')
    expect(button).toBeDisabled()
  })
}) 