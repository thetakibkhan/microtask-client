/**
 * Tests for Login and Register pages.
 * AuthProvider and router are mocked — no real Firebase or HTTP calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '@/pages/Login'
import RegisterPage from '@/pages/Register'

// ─── Router mock ──────────────────────────────────────────────────────────────

const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={String(to)}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
}))

// ─── AuthProvider mock ────────────────────────────────────────────────────────

const mockLoginWithEmail = vi.fn()
const mockLoginWithGoogle = vi.fn()
const mockRegisterWithEmail = vi.fn()

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: () => ({
    loginWithEmail: mockLoginWithEmail,
    loginWithGoogle: mockLoginWithGoogle,
    registerWithEmail: mockRegisterWithEmail,
    user: null,
    role: null,
    loading: false,
    logout: vi.fn(),
  }),
}))

// ─── ImageUploadField mock ────────────────────────────────────────────────────

vi.mock('@/components/ImageUploadField', () => ({
  default: () => <div data-testid="image-upload" />,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fillLoginForm(email = 'test@example.com', password = 'password123') {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } })
}

function submitLoginForm() {
  fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form')!)
}

function fillRegisterForm({
  first = 'John',
  last = 'Doe',
  email = 'john@example.com',
  password = 'securepass',
} = {}) {
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: first } })
  fireEvent.change(screen.getByLabelText('Last name'), { target: { value: last } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } })
}

function submitRegisterForm() {
  fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form')!)
}

// ─── Login ────────────────────────────────────────────────────────────────────

describe('LoginPage', () => {
  it('renders email and password fields', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('calls loginWithEmail with entered credentials', async () => {
    mockLoginWithEmail.mockResolvedValue('worker')
    render(<LoginPage />)
    fillLoginForm('user@test.com', 'mypassword')
    submitLoginForm()
    await vi.waitFor(() => {
      expect(mockLoginWithEmail).toHaveBeenCalledWith('user@test.com', 'mypassword')
    })
  })

  it('navigates to /worker when role is worker', async () => {
    mockLoginWithEmail.mockResolvedValue('worker')
    render(<LoginPage />)
    fillLoginForm()
    submitLoginForm()
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/worker' })
    })
  })

  it('navigates to /buyer when role is buyer', async () => {
    mockLoginWithEmail.mockResolvedValue('buyer')
    render(<LoginPage />)
    fillLoginForm()
    submitLoginForm()
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/buyer' })
    })
  })

  it('navigates to /admin when role is admin', async () => {
    mockLoginWithEmail.mockResolvedValue('admin')
    render(<LoginPage />)
    fillLoginForm()
    submitLoginForm()
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/admin' })
    })
  })

  it('shows credential error for Firebase auth errors', async () => {
    mockLoginWithEmail.mockRejectedValue(new Error('Firebase: auth/wrong-password'))
    render(<LoginPage />)
    fillLoginForm()
    submitLoginForm()
    await vi.waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
    })
  })

  it('shows server error when server is unreachable', async () => {
    mockLoginWithEmail.mockRejectedValue(new Error('Network Error'))
    render(<LoginPage />)
    fillLoginForm()
    submitLoginForm()
    await vi.waitFor(() => {
      expect(screen.getByText(/could not connect to server/i)).toBeInTheDocument()
    })
  })

  it('calls loginWithGoogle when Google button clicked', async () => {
    mockLoginWithGoogle.mockResolvedValue('worker')
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }))
    await vi.waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalledOnce()
    })
  })

  it('navigates after Google login using the returned role', async () => {
    mockLoginWithGoogle.mockResolvedValue('buyer')
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }))
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/buyer' })
    })
  })

  it('shows cancelled message when Google popup is closed', async () => {
    mockLoginWithGoogle.mockRejectedValue(new Error('auth/popup-closed-by-user'))
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }))
    await vi.waitFor(() => {
      expect(screen.getByText('Sign-in cancelled.')).toBeInTheDocument()
    })
  })

  it('shows server error when Google login hits a network error', async () => {
    mockLoginWithGoogle.mockRejectedValue(new Error('Network Error'))
    render(<LoginPage />)
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }))
    await vi.waitFor(() => {
      expect(screen.getByText(/could not connect to server/i)).toBeInTheDocument()
    })
  })
})

// ─── Register ─────────────────────────────────────────────────────────────────

describe('RegisterPage', () => {
  it('renders form fields and role selector', () => {
    render(<RegisterPage />)
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByText('Worker')).toBeInTheDocument()
    expect(screen.getByText('Buyer')).toBeInTheDocument()
  })

  it('blocks submit and shows error when password is too short', () => {
    render(<RegisterPage />)
    fillRegisterForm({ password: 'short' })
    submitRegisterForm()
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    expect(mockRegisterWithEmail).not.toHaveBeenCalled()
  })

  it('calls registerWithEmail with full name, email, password, and role', async () => {
    mockRegisterWithEmail.mockResolvedValue({})
    render(<RegisterPage />)
    fillRegisterForm({ first: 'Jane', last: 'Smith', email: 'jane@test.com', password: 'securepass' })
    submitRegisterForm()
    await vi.waitFor(() => {
      expect(mockRegisterWithEmail).toHaveBeenCalledWith(
        'Jane Smith', 'jane@test.com', 'securepass', 'worker', undefined
      )
    })
  })

  it('navigates to /worker after worker registration', async () => {
    mockRegisterWithEmail.mockResolvedValue({})
    render(<RegisterPage />)
    fillRegisterForm()
    submitRegisterForm()
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/worker' })
    })
  })

  it('navigates to /buyer after buyer registration', async () => {
    mockRegisterWithEmail.mockResolvedValue({})
    render(<RegisterPage />)
    fireEvent.click(screen.getByText('Buyer'))
    fillRegisterForm()
    submitRegisterForm()
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/buyer' })
    })
  })

  it('shows email-already-in-use error', async () => {
    mockRegisterWithEmail.mockRejectedValue(new Error('Firebase: auth/email-already-in-use'))
    render(<RegisterPage />)
    fillRegisterForm()
    submitRegisterForm()
    await vi.waitFor(() => {
      expect(screen.getByText(/account with this email already exists/i)).toBeInTheDocument()
    })
  })

  it('shows server error when backend is unreachable', async () => {
    mockRegisterWithEmail.mockRejectedValue(new Error('Network Error'))
    render(<RegisterPage />)
    fillRegisterForm()
    submitRegisterForm()
    await vi.waitFor(() => {
      expect(screen.getByText(/could not connect to server/i)).toBeInTheDocument()
    })
  })
})
