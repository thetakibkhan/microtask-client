/**
 * Tests for components that call the backend API.
 * The API module is mocked — no real HTTP calls are made.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AddTask from '@/pages/buyer/AddTask'
import MyTasks from '@/pages/buyer/MyTasks'
import Withdrawals from '@/pages/worker/Withdrawals'
import TaskList from '@/pages/worker/TaskList'
import { mockTasks, mockWithdrawals as mockBuyerWithdrawals } from '@/mocks/buyer'
import { mockAvailableTasks, mockWithdrawals, WORKER_INITIAL_COINS } from '@/mocks/worker'
import { SubmissionStatus, WithdrawalStatus, PaymentSystem } from '@/types'
import type { WorkerOwnSubmission } from '@/types'

// ─── API mock ──────────────────────────────────────────────────────────────
vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    get: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: { request: { use: vi.fn() } },
  },
}))

import api from '@/lib/api'
const mockApi = api as {
  post: ReturnType<typeof vi.fn>
  patch: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  vi.clearAllMocks()
})

function fillInput(labelText: string, value: string) {
  fireEvent.change(screen.getByLabelText(labelText), { target: { value } })
}

// ─── AddTask API calls ─────────────────────────────────────────────────────

describe('AddTask — API calls', () => {
  it('calls api.post with correct task data on submit', async () => {
    const onTaskCreated = vi.fn()
    render(<AddTask coinBalance={500} onTaskCreated={onTaskCreated} onGoToPurchase={vi.fn()} />)

    fillInput('Task Title', 'Survey Task')
    fillInput('Task Detail', 'Fill out a short survey')
    fillInput('Required Workers', '5')
    fillInput('Payable Amount (coins)', '10')
    fillInput('Submission Info', 'Submit your answers')
    fillInput('Completion Date', '2026-12-01')

    fireEvent.submit(screen.getByRole('button', { name: /create task/i }).closest('form')!)

    await vi.waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/api/tasks', expect.objectContaining({
        title: 'Survey Task',
        requiredWorkers: 5,
        payableAmount: 10,
      }))
    })
  })

  it('does not call api.post if coin balance too low', () => {
    render(<AddTask coinBalance={10} onTaskCreated={vi.fn()} onGoToPurchase={vi.fn()} />)

    fillInput('Task Title', 'Expensive Task')
    fillInput('Task Detail', 'Detail')
    fillInput('Required Workers', '100')
    fillInput('Payable Amount (coins)', '5')
    fillInput('Submission Info', 'Submit')
    fillInput('Completion Date', '2026-12-01')

    fireEvent.submit(screen.getByRole('button', { name: /create task/i }).closest('form')!)

    expect(mockApi.post).not.toHaveBeenCalled()
  })

  it('clears form fields after successful submission', async () => {
    render(<AddTask coinBalance={500} onTaskCreated={vi.fn()} onGoToPurchase={vi.fn()} />)

    fillInput('Task Title', 'Survey Task')
    fillInput('Task Detail', 'Do something')
    fillInput('Required Workers', '5')
    fillInput('Payable Amount (coins)', '10')
    fillInput('Submission Info', 'Submit result')
    fillInput('Completion Date', '2026-12-01')

    fireEvent.submit(screen.getByRole('button', { name: /create task/i }).closest('form')!)

    await vi.waitFor(() => {
      expect((screen.getByLabelText('Task Title') as HTMLInputElement).value).toBe('')
    })
  })
})

// ─── MyTasks API calls ─────────────────────────────────────────────────────

describe('MyTasks — API calls', () => {
  it('calls api.patch with correct task id on update', async () => {
    const onUpdate = vi.fn()
    render(<MyTasks tasks={mockTasks} onUpdate={onUpdate} onDelete={vi.fn()} />)

    fireEvent.click(screen.getAllByTitle('Edit task')[0])
    fillInput('Title', 'New Title')
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await vi.waitFor(() => {
      expect(mockApi.patch).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks/'),
        expect.objectContaining({ title: 'New Title' })
      )
    })
  })

  it('calls api.delete with correct task id on delete confirm', async () => {
    const onDelete = vi.fn()
    render(<MyTasks tasks={mockTasks} onUpdate={vi.fn()} onDelete={onDelete} />)

    fireEvent.click(screen.getAllByTitle('Delete task')[0])
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[deleteButtons.length - 1])

    await vi.waitFor(() => {
      expect(mockApi.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/tasks/')
      )
    })
  })

  it('does not call api.delete when cancel is clicked in delete modal', () => {
    render(<MyTasks tasks={mockTasks} onUpdate={vi.fn()} onDelete={vi.fn()} />)

    fireEvent.click(screen.getAllByTitle('Delete task')[0])
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(mockApi.delete).not.toHaveBeenCalled()
  })
})

// ─── TaskList — submission flow ────────────────────────────────────────────

describe('TaskList — submission', () => {
  it('shows submission form after clicking View Details', () => {
    const onSubmit = vi.fn()
    render(<TaskList tasks={mockAvailableTasks} onSubmit={onSubmit} />)

    fireEvent.click(screen.getAllByText('View Details')[0])
    expect(screen.getByLabelText('Your Submission Details')).toBeInTheDocument()
  })

  it('calls onSubmit with taskId and submissionDetails on submit', () => {
    const onSubmit = vi.fn()
    const task = mockAvailableTasks[0]
    render(<TaskList tasks={[task]} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByText('View Details'))
    fireEvent.change(screen.getByLabelText('Your Submission Details'), {
      target: { value: 'My submission proof' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit work/i }))

    expect(onSubmit).toHaveBeenCalledOnce()
    const submission: WorkerOwnSubmission = onSubmit.mock.calls[0][0]
    expect(submission.taskId).toBe(task.id)
    expect(submission.submissionDetails).toBe('My submission proof')
    expect(submission.status).toBe(SubmissionStatus.Pending)
  })

  it('shows success screen after submission', () => {
    const onSubmit = vi.fn()
    render(<TaskList tasks={mockAvailableTasks} onSubmit={onSubmit} />)

    fireEvent.click(screen.getAllByText('View Details')[0])
    fireEvent.change(screen.getByLabelText('Your Submission Details'), {
      target: { value: 'Done' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit work/i }))

    expect(screen.getByText('Submission sent!')).toBeInTheDocument()
  })

  it('shows empty state when no tasks available', () => {
    render(<TaskList tasks={[]} onSubmit={vi.fn()} />)
    expect(screen.getByText(/no tasks available/i)).toBeInTheDocument()
  })
})

// ─── Withdrawals — request flow ────────────────────────────────────────────

describe('Withdrawals — request', () => {
  it('shows balance and dollar equivalent', () => {
    render(
      <Withdrawals
        coinBalance={500}
        withdrawals={[]}
        onWithdraw={vi.fn()}
      />
    )
    expect(screen.getByText(/🪙 500/)).toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('shows insufficient coins warning when balance below minimum', () => {
    render(
      <Withdrawals
        coinBalance={100}
        withdrawals={[]}
        onWithdraw={vi.fn()}
      />
    )
    expect(screen.getByText(/insufficient coins/i)).toBeInTheDocument()
  })

  it('calls onWithdraw with correct data on submit', () => {
    const onWithdraw = vi.fn()
    render(
      <Withdrawals
        coinBalance={500}
        withdrawals={[]}
        onWithdraw={onWithdraw}
      />
    )

    fillInput('Coins to Withdraw', '200')
    fillInput('Account Number', '01700000000')
    fireEvent.submit(
      screen.getByRole('button', { name: /request withdrawal/i }).closest('form')!
    )

    expect(onWithdraw).toHaveBeenCalledOnce()
    const record = onWithdraw.mock.calls[0][0]
    expect(record.withdrawalCoin).toBe(200)
    expect(record.accountNumber).toBe('01700000000')
    expect(record.status).toBe(WithdrawalStatus.Pending)
  })

  it('renders withdrawal history table', () => {
    render(
      <Withdrawals
        coinBalance={500}
        withdrawals={mockWithdrawals}
        onWithdraw={vi.fn()}
      />
    )
    expect(screen.getByText('Withdrawal History')).toBeInTheDocument()
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1)
  })
})
