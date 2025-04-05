import { render, screen, fireEvent } from '@testing-library/react'
import Notification from '../Notification'

describe('Notification', () => {
  it('renders success notification correctly', () => {
    render(<Notification type="success" message="Operation successful" />)
    expect(screen.getByText('Operation successful')).toBeInTheDocument()
    expect(screen.getByText('Operation successful').parentElement).toHaveClass('bg-green-50')
  })

  it('renders error notification correctly', () => {
    render(<Notification type="error" message="Operation failed" />)
    expect(screen.getByText('Operation failed')).toBeInTheDocument()
    expect(screen.getByText('Operation failed').parentElement).toHaveClass('bg-red-50')
  })

  it('renders warning notification correctly', () => {
    render(<Notification type="warning" message="Please be careful" />)
    expect(screen.getByText('Please be careful')).toBeInTheDocument()
    expect(screen.getByText('Please be careful').parentElement).toHaveClass('bg-yellow-50')
  })

  it('renders info notification correctly', () => {
    render(<Notification type="info" message="Information" />)
    expect(screen.getByText('Information')).toBeInTheDocument()
    expect(screen.getByText('Information').parentElement).toHaveClass('bg-blue-50')
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<Notification type="success" message="Test" onClose={onClose} />)
    fireEvent.click(screen.getByText('✕'))
    expect(onClose).toHaveBeenCalled()
  })

  it('auto-closes after 5 seconds', () => {
    jest.useFakeTimers()
    const onClose = jest.fn()
    render(<Notification type="success" message="Test" onClose={onClose} />)
    jest.advanceTimersByTime(5000)
    expect(onClose).toHaveBeenCalled()
    jest.useRealTimers()
  })
}) 