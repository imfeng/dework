import { render, screen, act } from '@testing-library/react'
import { NotificationProvider, useNotification } from '../NotificationContext'
import { Notification } from '@/components/common/Notification'

// Mock the Notification component
jest.mock('@/components/common/Notification', () => ({
  Notification: jest.fn(() => null),
}))

describe('NotificationContext', () => {
  const TestComponent = () => {
    const { showNotification } = useNotification()
    return (
      <button onClick={() => showNotification('success', 'Test message')}>
        Show Notification
      </button>
    )
  }

  it('provides notification context', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )
    expect(screen.getByText('Show Notification')).toBeInTheDocument()
  })

  it('shows notification when showNotification is called', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByText('Show Notification').click()
    })

    expect(Notification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        message: 'Test message',
      }),
      expect.any(Object)
    )
  })

  it('removes notification after timeout', () => {
    jest.useFakeTimers()
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    )

    act(() => {
      screen.getByText('Show Notification').click()
    })

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(Notification).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })

  it('throws error when used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      try {
        useNotification()
        return null
      } catch (error) {
        return <div>Error caught</div>
      }
    }

    render(<TestComponentWithoutProvider />)
    expect(screen.getByText('Error caught')).toBeInTheDocument()
  })
}) 