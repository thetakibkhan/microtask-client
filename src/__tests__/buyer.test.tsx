import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BuyerHome from '@/pages/buyer/BuyerHome'
import AddTask from '@/pages/buyer/AddTask'
import MyTasks from '@/pages/buyer/MyTasks'
import PurchaseCoin from '@/pages/buyer/PurchaseCoin'
import PaymentHistory from '@/pages/buyer/PaymentHistory'
import { mockSubmissions, mockTasks, mockPayments, coinPackages } from '@/mocks/buyer'
import { SubmissionStatus, TaskStatus, PaymentType } from '@/types'
import type { WorkerSubmission, BuyerTaskFull, PaymentRecord } from '@/types'

// Helper: fill a form input by its label text
function fillInput(labelText: string, value: string) {
  fireEvent.change(screen.getByLabelText(labelText), { target: { value } })
}

// ─── BuyerHome ─────────────────────────────────────────────────────────────

describe('BuyerHome', () => {
  const pending = mockSubmissions.filter((s) => s.status === SubmissionStatus.Pending)

  it('renders stats section', () => {
    render(
      <BuyerHome
        coinBalance={1250}
        submissions={mockSubmissions}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    )
    expect(screen.getByText('Total Tasks')).toBeInTheDocument()
    expect(screen.getByText('Your Coin Balance')).toBeInTheDocument()
  })

  it('shows only pending submissions in the table', () => {
    render(
      <BuyerHome
        coinBalance={1250}
        submissions={mockSubmissions}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    )
    for (const s of pending) {
      expect(screen.getByText(s.workerName)).toBeInTheDocument()
    }
  })

  it('calls onApprove with correct id when approve button clicked', () => {
    const onApprove = vi.fn()
    render(
      <BuyerHome
        coinBalance={1250}
        submissions={mockSubmissions}
        onApprove={onApprove}
        onReject={vi.fn()}
      />
    )
    fireEvent.click(screen.getAllByTitle('Approve')[0])
    expect(onApprove).toHaveBeenCalledWith(pending[0].id)
  })

  it('calls onReject with correct id when reject button clicked', () => {
    const onReject = vi.fn()
    render(
      <BuyerHome
        coinBalance={1250}
        submissions={mockSubmissions}
        onApprove={vi.fn()}
        onReject={onReject}
      />
    )
    fireEvent.click(screen.getAllByTitle('Reject')[0])
    expect(onReject).toHaveBeenCalledWith(pending[0].id)
  })

  it('shows empty message when no pending submissions', () => {
    const allApproved: WorkerSubmission[] = mockSubmissions.map((s) => ({
      ...s,
      status: SubmissionStatus.Approved,
    }))
    render(
      <BuyerHome
        coinBalance={1250}
        submissions={allApproved}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    )
    expect(screen.getByText(/no pending submissions/i)).toBeInTheDocument()
  })

  it('opens submission detail modal on eye button click', () => {
    render(
      <BuyerHome
        coinBalance={1250}
        submissions={mockSubmissions}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    )
    fireEvent.click(screen.getAllByTitle('View details')[0])
    expect(screen.getByText('Submission Details')).toBeInTheDocument()
  })
})

// ─── AddTask ───────────────────────────────────────────────────────────────

describe('AddTask', () => {
  it('renders the form', () => {
    render(
      <AddTask coinBalance={1000} onTaskCreated={vi.fn()} onGoToPurchase={vi.fn()} />
    )
    expect(screen.getByLabelText('Task Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Required Workers')).toBeInTheDocument()
    expect(screen.getByLabelText('Payable Amount (coins)')).toBeInTheDocument()
  })

  it('shows coin cost preview when workers and amount filled', () => {
    render(
      <AddTask coinBalance={1000} onTaskCreated={vi.fn()} onGoToPurchase={vi.fn()} />
    )
    fillInput('Required Workers', '10')
    fillInput('Payable Amount (coins)', '5')
    // Cost = 10 × 5 = 50 — the preview div contains "Task cost: 50.00 coins"
    expect(screen.getByText(/task cost/i)).toBeInTheDocument()
  })

  it('shows error when cost exceeds balance after form submit', () => {
    render(
      <AddTask coinBalance={10} onTaskCreated={vi.fn()} onGoToPurchase={vi.fn()} />
    )
    fillInput('Task Title', 'Test Task')
    fillInput('Task Detail', 'Some detail')
    fillInput('Required Workers', '100')
    fillInput('Payable Amount (coins)', '1')
    fillInput('Submission Info', 'Upload screenshot')
    fillInput('Completion Date', '2026-12-01')
    fireEvent.submit(screen.getByRole('button', { name: /create task/i }).closest('form')!)
    expect(screen.getByText(/not enough coins/i)).toBeInTheDocument()
  })

  it('calls onGoToPurchase when the purchase link is clicked after error', () => {
    const onGoToPurchase = vi.fn()
    render(
      <AddTask coinBalance={10} onTaskCreated={vi.fn()} onGoToPurchase={onGoToPurchase} />
    )
    fillInput('Task Title', 'Test Task')
    fillInput('Task Detail', 'Some detail')
    fillInput('Required Workers', '100')
    fillInput('Payable Amount (coins)', '1')
    fillInput('Submission Info', 'Upload screenshot')
    fillInput('Completion Date', '2026-12-01')
    fireEvent.submit(screen.getByRole('button', { name: /create task/i }).closest('form')!)
    fireEvent.click(screen.getByRole('button', { name: /purchase more coins/i }))
    expect(onGoToPurchase).toHaveBeenCalled()
  })

  it('calls onTaskCreated with correct data when form is valid', () => {
    const onTaskCreated = vi.fn()
    render(
      <AddTask coinBalance={500} onTaskCreated={onTaskCreated} onGoToPurchase={vi.fn()} />
    )
    fillInput('Task Title', 'My New Task')
    fillInput('Task Detail', 'Do this thing')
    fillInput('Required Workers', '5')
    fillInput('Payable Amount (coins)', '2')
    fillInput('Submission Info', 'Take a screenshot')
    fillInput('Completion Date', '2026-12-01')
    fireEvent.submit(screen.getByRole('button', { name: /create task/i }).closest('form')!)
    expect(onTaskCreated).toHaveBeenCalledOnce()
    const created = onTaskCreated.mock.calls[0][0] as BuyerTaskFull
    expect(created.title).toBe('My New Task')
    expect(created.requiredWorkers).toBe(5)
    expect(created.payableAmount).toBe(2)
    expect(created.status).toBe(TaskStatus.Active)
  })
})

// ─── MyTasks ───────────────────────────────────────────────────────────────

describe('MyTasks', () => {
  it('renders all tasks', () => {
    render(<MyTasks tasks={mockTasks} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    for (const task of mockTasks) {
      expect(screen.getByText(task.title)).toBeInTheDocument()
    }
  })

  it('shows empty state when no tasks', () => {
    render(<MyTasks tasks={[]} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('opens edit modal on pencil click', () => {
    render(<MyTasks tasks={mockTasks} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    fireEvent.click(screen.getAllByTitle('Edit task')[0])
    expect(screen.getByText('Update Task')).toBeInTheDocument()
  })

  it('calls onUpdate with updated title when form saved', () => {
    const onUpdate = vi.fn()
    render(<MyTasks tasks={mockTasks} onUpdate={onUpdate} onDelete={vi.fn()} />)
    fireEvent.click(screen.getAllByTitle('Edit task')[0])
    fillInput('Title', 'Updated Title')
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(onUpdate).toHaveBeenCalledOnce()
    const updated = onUpdate.mock.calls[0][0] as BuyerTaskFull
    expect(updated.title).toBe('Updated Title')
  })

  it('opens delete confirmation modal on trash click', () => {
    render(<MyTasks tasks={mockTasks} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    fireEvent.click(screen.getAllByTitle('Delete task')[0])
    expect(screen.getByText('Delete Task')).toBeInTheDocument()
  })

  it('shows refund info in delete modal for tasks with unfilled slots', () => {
    const taskWithSlots = mockTasks.filter(
      (t) => t.submissionsReceived < t.requiredWorkers
    )
    render(<MyTasks tasks={taskWithSlots} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    fireEvent.click(screen.getAllByTitle('Delete task')[0])
    // Refund section should appear
    expect(screen.getByText(/you will receive a refund/i)).toBeInTheDocument()
  })

  it('calls onDelete when deletion confirmed', () => {
    const onDelete = vi.fn()
    const taskWithSlots = mockTasks.filter(
      (t) => t.submissionsReceived < t.requiredWorkers
    )
    // Component sorts by completionDate desc — find the first one after sorting
    const sorted = [...taskWithSlots].sort(
      (a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
    )
    render(<MyTasks tasks={taskWithSlots} onUpdate={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getAllByTitle('Delete task')[0])
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
    expect(onDelete).toHaveBeenCalledWith(sorted[0].id)
  })

  it('tasks are sorted by completion date descending', () => {
    const tasks: BuyerTaskFull[] = [
      { ...mockTasks[0], id: 'a', title: 'Earliest', completionDate: '2026-03-01' },
      { ...mockTasks[0], id: 'b', title: 'Latest', completionDate: '2026-05-01' },
      { ...mockTasks[0], id: 'c', title: 'Middle', completionDate: '2026-04-01' },
    ]
    render(<MyTasks tasks={tasks} onUpdate={vi.fn()} onDelete={vi.fn()} />)
    const allText = screen.getAllByRole('heading', { level: 3 }).map((el) => el.textContent)
    expect(allText[0]).toBe('Latest')
  })
})

// ─── PurchaseCoin ──────────────────────────────────────────────────────────

describe('PurchaseCoin', () => {
  it('renders all 4 package names', () => {
    render(<PurchaseCoin onPurchase={vi.fn()} />)
    // Each package label appears in the card buttons; use getAllByText
    for (const pkg of coinPackages) {
      expect(screen.getAllByText(pkg.label).length).toBeGreaterThan(0)
    }
  })

  it('calls onPurchase with correct package when Buy Now clicked', () => {
    const onPurchase = vi.fn()
    render(<PurchaseCoin onPurchase={onPurchase} />)
    // Select the first package
    fireEvent.click(screen.getAllByText(coinPackages[0].label)[0])
    fireEvent.click(screen.getByRole('button', { name: /buy now/i }))
    expect(onPurchase).toHaveBeenCalledWith(coinPackages[0])
  })

  it('shows success message after purchase', () => {
    render(<PurchaseCoin onPurchase={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /buy now/i }))
    expect(screen.getByText(/purchase successful/i)).toBeInTheDocument()
  })

  it('order summary shows correct price for selected package', () => {
    render(<PurchaseCoin onPurchase={vi.fn()} />)
    const lastPkg = coinPackages[coinPackages.length - 1]
    fireEvent.click(screen.getAllByText(lastPkg.label)[0])
    // Price should appear in the order summary section
    const priceCells = screen.getAllByText(`$${lastPkg.price}`)
    expect(priceCells.length).toBeGreaterThan(0)
  })
})

// ─── PaymentHistory ────────────────────────────────────────────────────────

describe('PaymentHistory', () => {
  it('renders all payment records', () => {
    render(<PaymentHistory payments={mockPayments} />)
    for (const p of mockPayments) {
      expect(screen.getByText(p.description)).toBeInTheDocument()
    }
  })

  it('shows empty state when no payments', () => {
    render(<PaymentHistory payments={[]} />)
    expect(screen.getByText(/no payment records/i)).toBeInTheDocument()
  })

  it('shows + prefix for positive coin changes', () => {
    const payment: PaymentRecord = {
      id: 'test',
      type: PaymentType.Purchase,
      description: 'Bought coins',
      amount: 49,
      coins: 500,
      date: '2026-03-01',
    }
    render(<PaymentHistory payments={[payment]} />)
    expect(screen.getByText('+500 🪙')).toBeInTheDocument()
  })

  it('shows negative coins for task payments', () => {
    const payment: PaymentRecord = {
      id: 'test2',
      type: PaymentType.TaskPayment,
      description: 'Task created',
      amount: 0,
      coins: -90,
      date: '2026-03-02',
    }
    render(<PaymentHistory payments={[payment]} />)
    expect(screen.getByText('-90 🪙')).toBeInTheDocument()
  })
})
