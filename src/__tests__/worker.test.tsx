import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WorkerHome from '@/pages/worker/WorkerHome'
import TaskList from '@/pages/worker/TaskList'
import MySubmissions from '@/pages/worker/MySubmissions'
import Withdrawals from '@/pages/worker/Withdrawals'
import { mockWorkerSubmissions, mockAvailableTasks, mockWithdrawals, WORKER_INITIAL_COINS } from '@/mocks/worker'
import { SubmissionStatus, WithdrawalStatus } from '@/types'
import type { WorkerOwnSubmission, WithdrawalRecord } from '@/types'

// ─── WorkerHome ────────────────────────────────────────────────────────────

describe('WorkerHome', () => {
  it('renders the 3 stat cards', () => {
    render(<WorkerHome submissions={mockWorkerSubmissions} coinBalance={WORKER_INITIAL_COINS} />)
    expect(screen.getByText('Total Submissions')).toBeInTheDocument()
    expect(screen.getByText('Pending Submissions')).toBeInTheDocument()
    expect(screen.getByText('Total Earnings (coins)')).toBeInTheDocument()
  })

  it('total submissions count matches mock data length', () => {
    render(<WorkerHome submissions={mockWorkerSubmissions} coinBalance={WORKER_INITIAL_COINS} />)
    // Find the stat card value specifically (look within the stat section)
    const totalCount = mockWorkerSubmissions.length
    expect(screen.getByText(String(totalCount))).toBeInTheDocument()
  })

  it('pending count only includes pending submissions', () => {
    const pendingCount = mockWorkerSubmissions.filter(
      (s) => s.status === SubmissionStatus.Pending
    ).length
    render(<WorkerHome submissions={mockWorkerSubmissions} coinBalance={WORKER_INITIAL_COINS} />)
    expect(screen.getByText(String(pendingCount))).toBeInTheDocument()
  })

  it('total earnings only sums approved submissions', () => {
    render(<WorkerHome submissions={mockWorkerSubmissions} coinBalance={WORKER_INITIAL_COINS} />)
    const expected = mockWorkerSubmissions
      .filter((s) => s.status === SubmissionStatus.Approved)
      .reduce((sum, s) => sum + s.payableAmount, 0)
      .toFixed(2)
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('shows correct dollar equivalent of coin balance', () => {
    render(<WorkerHome submissions={[]} coinBalance={400} />)
    expect(screen.getByText('$20.00')).toBeInTheDocument()
  })

  it('shows approved submission titles in the table', () => {
    render(<WorkerHome submissions={mockWorkerSubmissions} coinBalance={WORKER_INITIAL_COINS} />)
    const approved = mockWorkerSubmissions.filter((s) => s.status === SubmissionStatus.Approved)
    for (const s of approved) {
      expect(screen.getAllByText(s.taskTitle).length).toBeGreaterThan(0)
    }
  })

  it('shows empty approved table message when none approved', () => {
    const noneApproved: WorkerOwnSubmission[] = mockWorkerSubmissions.map((s) => ({
      ...s,
      status: SubmissionStatus.Pending,
    }))
    render(<WorkerHome submissions={noneApproved} coinBalance={WORKER_INITIAL_COINS} />)
    expect(screen.getByText(/no approved submissions yet/i)).toBeInTheDocument()
  })
})

// ─── TaskList ──────────────────────────────────────────────────────────────

describe('TaskList', () => {
  it('renders task cards for available tasks', () => {
    render(<TaskList tasks={mockAvailableTasks} onSubmit={vi.fn()} />)
    for (const task of mockAvailableTasks) {
      expect(screen.getByText(task.title)).toBeInTheDocument()
    }
  })

  it('filters out tasks with requiredWorkers = 0', () => {
    const withEmpty = [
      ...mockAvailableTasks,
      { ...mockAvailableTasks[0], id: 'empty', title: 'Zero Slot Task', requiredWorkers: 0 },
    ]
    render(<TaskList tasks={withEmpty} onSubmit={vi.fn()} />)
    expect(screen.queryByText('Zero Slot Task')).not.toBeInTheDocument()
  })

  it('shows empty state when no available tasks', () => {
    render(<TaskList tasks={[]} onSubmit={vi.fn()} />)
    expect(screen.getByText(/no tasks available/i)).toBeInTheDocument()
  })

  it('opens detail modal and shows submission form on View Details click', () => {
    render(<TaskList tasks={mockAvailableTasks} onSubmit={vi.fn()} />)
    fireEvent.click(screen.getAllByRole('button', { name: /view details/i })[0])
    expect(screen.getByLabelText('Your Submission Details')).toBeInTheDocument()
  })

  it('calls onSubmit with correct task data when form submitted', () => {
    const onSubmit = vi.fn()
    render(<TaskList tasks={mockAvailableTasks} onSubmit={onSubmit} />)
    fireEvent.click(screen.getAllByRole('button', { name: /view details/i })[0])
    fireEvent.change(screen.getByLabelText('Your Submission Details'), {
      target: { value: 'My submission notes' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit work/i }))
    expect(onSubmit).toHaveBeenCalledOnce()
    const submission = onSubmit.mock.calls[0][0] as WorkerOwnSubmission
    expect(submission.taskId).toBe(mockAvailableTasks[0].id)
    expect(submission.submissionDetails).toBe('My submission notes')
    expect(submission.status).toBe(SubmissionStatus.Pending)
  })

  it('shows success screen after submission', () => {
    render(<TaskList tasks={mockAvailableTasks} onSubmit={vi.fn()} />)
    fireEvent.click(screen.getAllByRole('button', { name: /view details/i })[0])
    fireEvent.change(screen.getByLabelText('Your Submission Details'), {
      target: { value: 'Done' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit work/i }))
    expect(screen.getByText(/submission sent/i)).toBeInTheDocument()
  })
})

// ─── MySubmissions ─────────────────────────────────────────────────────────

describe('MySubmissions', () => {
  it('renders first page of submission task titles', () => {
    // Component paginates 5 per page — only the first 5 (newest) are shown on page 1
    const sorted = [...mockWorkerSubmissions].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    const firstPage = sorted.slice(0, 5)
    render(<MySubmissions submissions={mockWorkerSubmissions} />)
    for (const s of firstPage) {
      expect(screen.getAllByText(s.taskTitle).length).toBeGreaterThan(0)
    }
  })

  it('shows empty state when no submissions', () => {
    render(<MySubmissions submissions={[]} />)
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument()
  })

  it('shows color-coded status badges', () => {
    render(<MySubmissions submissions={mockWorkerSubmissions} />)
    expect(screen.getAllByText('Approved').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0)
  })

  it('sorts submissions newest first', () => {
    const submissions: WorkerOwnSubmission[] = [
      { ...mockWorkerSubmissions[0], id: 'old', taskTitle: 'Old Task', submittedAt: '2026-01-01T00:00:00Z' },
      { ...mockWorkerSubmissions[0], id: 'new', taskTitle: 'New Task', submittedAt: '2026-06-01T00:00:00Z' },
    ]
    render(<MySubmissions submissions={submissions} />)
    const rows = screen.getAllByRole('row')
    // row[0] = header, row[1] = first data row = should be newest
    expect(rows[1].textContent).toContain('New Task')
  })
})

// ─── Withdrawals ───────────────────────────────────────────────────────────

describe('Withdrawals', () => {
  it('renders coin balance', () => {
    render(<Withdrawals coinBalance={400} withdrawals={[]} onWithdraw={vi.fn()} />)
    expect(screen.getAllByText('🪙 400').length).toBeGreaterThan(0)
  })

  it('renders dollar equivalent (400 coins = $20)', () => {
    render(<Withdrawals coinBalance={400} withdrawals={[]} onWithdraw={vi.fn()} />)
    expect(screen.getAllByText('$20.00').length).toBeGreaterThan(0)
  })

  it('shows insufficient message when balance < 200', () => {
    render(<Withdrawals coinBalance={100} withdrawals={[]} onWithdraw={vi.fn()} />)
    expect(screen.getAllByText(/insufficient coins/i).length).toBeGreaterThan(0)
  })

  it('hides withdrawal form when balance < 200', () => {
    render(<Withdrawals coinBalance={100} withdrawals={[]} onWithdraw={vi.fn()} />)
    expect(screen.queryByLabelText('Coins to Withdraw')).not.toBeInTheDocument()
  })

  it('shows withdrawal form when balance >= 200', () => {
    render(<Withdrawals coinBalance={300} withdrawals={[]} onWithdraw={vi.fn()} />)
    expect(screen.getByLabelText('Coins to Withdraw')).toBeInTheDocument()
  })

  it('auto-calculates dollar amount from coins entered (200 coins = $10)', () => {
    render(<Withdrawals coinBalance={500} withdrawals={[]} onWithdraw={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Coins to Withdraw'), { target: { value: '200' } })
    const dollarField = screen.getByLabelText('Withdrawal Amount ($)') as HTMLInputElement
    expect(dollarField.value).toBe('$10.00')
  })

  it('calls onWithdraw with correct data on valid form submit', () => {
    const onWithdraw = vi.fn()
    render(<Withdrawals coinBalance={500} withdrawals={[]} onWithdraw={onWithdraw} />)
    fireEvent.change(screen.getByLabelText('Coins to Withdraw'), { target: { value: '200' } })
    fireEvent.change(screen.getByLabelText('Account Number'), { target: { value: '01700000000' } })
    fireEvent.submit(screen.getByRole('button', { name: /request withdrawal/i }).closest('form')!)
    expect(onWithdraw).toHaveBeenCalledOnce()
    const record = onWithdraw.mock.calls[0][0] as WithdrawalRecord
    expect(record.withdrawalCoin).toBe(200)
    expect(record.withdrawalAmount).toBe(10)
    expect(record.status).toBe(WithdrawalStatus.Pending)
  })

  it('renders withdrawal history with payment system names', () => {
    render(<Withdrawals coinBalance={500} withdrawals={mockWithdrawals} onWithdraw={vi.fn()} />)
    for (const w of mockWithdrawals) {
      // payment system may appear in both form dropdown and history table
      expect(screen.getAllByText(w.paymentSystem).length).toBeGreaterThan(0)
    }
  })
})
