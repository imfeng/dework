import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useContractWrite } from 'wagmi'
import PropertyManagement from '../PropertyManagement'

// Mock the hooks
jest.mock('wagmi', () => ({
  useContractWrite: jest.fn(),
}))

describe('PropertyManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock values
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      isLoading: false,
    })
  })

  it('renders form correctly', () => {
    render(<PropertyManagement />)
    expect(screen.getByLabelText('Property Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Location')).toBeInTheDocument()
    expect(screen.getByLabelText('Rent (USDC)')).toBeInTheDocument()
    expect(screen.getByLabelText('Deposit (USDC)')).toBeInTheDocument()
  })

  it('handles form input changes', () => {
    render(<PropertyManagement />)
    
    const nameInput = screen.getByLabelText('Property Name')
    fireEvent.change(nameInput, { target: { value: 'Test Property' } })
    expect(nameInput).toHaveValue('Test Property')

    const locationInput = screen.getByLabelText('Location')
    fireEvent.change(locationInput, { target: { value: 'Test Location' } })
    expect(locationInput).toHaveValue('Test Location')

    const rentInput = screen.getByLabelText('Rent (USDC)')
    fireEvent.change(rentInput, { target: { value: '1000' } })
    expect(rentInput).toHaveValue('1000')

    const depositInput = screen.getByLabelText('Deposit (USDC)')
    fireEvent.change(depositInput, { target: { value: '2000' } })
    expect(depositInput).toHaveValue('2000')
  })

  it('handles form submission', async () => {
    const mockWrite = jest.fn()
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      isLoading: false,
    })

    render(<PropertyManagement />)
    
    fireEvent.change(screen.getByLabelText('Property Name'), { target: { value: 'Test Property' } })
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Test Location' } })
    fireEvent.change(screen.getByLabelText('Rent (USDC)'), { target: { value: '1000' } })
    fireEvent.change(screen.getByLabelText('Deposit (USDC)'), { target: { value: '2000' } })

    fireEvent.click(screen.getByText('Create Property'))
    
    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalledWith({
        args: ['Test Property', 'Test Location', '1000', '2000'],
      })
    })
  })

  it('disables submit button when loading', () => {
    ;(useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      isLoading: true,
    })

    render(<PropertyManagement />)
    const button = screen.getByText('Create Property')
    expect(button).toBeDisabled()
  })

  it('shows error message when required fields are empty', () => {
    render(<PropertyManagement />)
    fireEvent.click(screen.getByText('Create Property'))
    expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
  })
}) 