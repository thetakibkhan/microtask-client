import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminHome from '@/pages/admin/AdminHome'
import ManageUsers from '@/pages/admin/ManageUsers'
import ManageTasks from '@/pages/admin/ManageTasks'
import { mockAdminUsers, mockAdminTasks, mockAdminWithdrawals } from '@/mocks/admin'
import { WithdrawalStatus } from '@/types'
import type { AdminUser, WithdrawalRecord } from '@/types'

// ─── AdminHome ─────────────────────────────────────────────────────────────

describe('AdminHome', () => {
  it('renders all 4 stat card labels', () => {
    render(
      <AdminHome
        users={mockAdminUsers}
        tasks={mockAdminTasks}
        withdrawals={mockAdminWithdrawals}
        onApproveWithdrawal={vi.fn()}
      />
    )
    expect(screen.getByText('Total Workers')).toBeInTheDocument()
    expect(screen.getByText('Total Buyers')).toBeInTheDocument()
    expect(screen.getByText('Total Available Coins')).toBeInTheDocument()
    expect(screen.getByText('Total Payments ($)')).toBeInTheDocument()
  })

  it('correctly counts total workers', () => {
    render(
      <AdminHome
        users={mockAdminUsers}
        tasks={mockAdminTasks}
        withdrawals={mockAdminWithdrawals}
        onApproveWithdrawal={vi.fn()}
      />
    )
    const workerCount = mockAdminUsers.filter((u) => u.role === 'worker').length
    // Multiple elements may match; verify at least one contains the count
    expect(screen.getAllByText(String(workerCount)).length).toBeGreaterThan(0)
  })

  it('correctly counts total buyers', () => {
    render(
      <AdminHome
        users={mockAdminUsers}
        tasks={mockAdminTasks}
        withdrawals={mockAdminWithdrawals}
        onApproveWithdrawal={vi.fn()}
      />
    )
    const buyerCount = mockAdminUsers.filter((u) => u.role === 'buyer').length
    expect(screen.getAllByText(String(buyerCount)).length).toBeGreaterThan(0)
  })

  it('shows pending withdrawal worker names in the table', () => {
    render(
      <AdminHome
        users={mockAdminUsers}
        tasks={mockAdminTasks}
        withdrawals={mockAdminWithdrawals}
        onApproveWithdrawal={vi.fn()}
      />
    )
    const pending = mockAdminWithdrawals.filter((w) => w.status === WithdrawalStatus.Pending)
    for (const w of pending) {
      expect(screen.getByText(w.workerName)).toBeInTheDocument()
    }
  })

  it('shows empty message when no pending withdrawals', () => {
    const approvedOnly: WithdrawalRecord[] = mockAdminWithdrawals.map((w) => ({
      ...w,
      status: WithdrawalStatus.Approved,
    }))
    render(
      <AdminHome
        users={mockAdminUsers}
        tasks={mockAdminTasks}
        withdrawals={approvedOnly}
        onApproveWithdrawal={vi.fn()}
      />
    )
    expect(screen.getByText(/no pending withdrawal requests/i)).toBeInTheDocument()
  })

  it('calls onApproveWithdrawal with the correct id', () => {
    const onApprove = vi.fn()
    render(
      <AdminHome
        users={mockAdminUsers}
        tasks={mockAdminTasks}
        withdrawals={mockAdminWithdrawals}
        onApproveWithdrawal={onApprove}
      />
    )
    const pending = mockAdminWithdrawals.filter((w) => w.status === WithdrawalStatus.Pending)
    fireEvent.click(screen.getAllByRole('button', { name: /payment success/i })[0])
    expect(onApprove).toHaveBeenCalledWith(pending[0].id)
  })

  it('displays total coin sum across all users', () => {
    render(
      <AdminHome
        users={mockAdminUsers}
        tasks={mockAdminTasks}
        withdrawals={mockAdminWithdrawals}
        onApproveWithdrawal={vi.fn()}
      />
    )
    const total = mockAdminUsers.reduce((sum, u) => sum + u.coins, 0)
    expect(screen.getByText(total.toLocaleString())).toBeInTheDocument()
  })
})

// ─── ManageUsers ───────────────────────────────────────────────────────────

describe('ManageUsers', () => {
  it('renders all user names', () => {
    render(<ManageUsers users={mockAdminUsers} onRoleChange={vi.fn()} onRemove={vi.fn()} />)
    for (const u of mockAdminUsers) {
      expect(screen.getByText(u.name)).toBeInTheDocument()
    }
  })

  it('shows empty state when user list is empty', () => {
    render(<ManageUsers users={[]} onRoleChange={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })

  it('calls onRoleChange with correct id and role when dropdown changes', () => {
    const onRoleChange = vi.fn()
    render(<ManageUsers users={mockAdminUsers} onRoleChange={onRoleChange} onRemove={vi.fn()} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'admin' } })
    expect(onRoleChange).toHaveBeenCalledWith(mockAdminUsers[0].id, 'admin')
  })

  it('calls onRemove with correct user id on Remove click', () => {
    const onRemove = vi.fn()
    render(<ManageUsers users={mockAdminUsers} onRoleChange={vi.fn()} onRemove={onRemove} />)
    fireEvent.click(screen.getAllByRole('button', { name: /remove/i })[0])
    expect(onRemove).toHaveBeenCalledWith(mockAdminUsers[0].id)
  })

  it('renders one profile image per user', () => {
    render(<ManageUsers users={mockAdminUsers} onRoleChange={vi.fn()} onRemove={vi.fn()} />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(mockAdminUsers.length)
  })

  it('shows user coin balance', () => {
    const singleUser: AdminUser[] = [{
      id: 'x',
      name: 'Test User',
      email: 'test@test.com',
      photoUrl: 'https://i.pravatar.cc/150',
      role: 'worker',
      coins: 777,
    }]
    render(<ManageUsers users={singleUser} onRoleChange={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('🪙 777')).toBeInTheDocument()
  })
})

// ─── ManageTasks ───────────────────────────────────────────────────────────

describe('ManageTasks', () => {
  it('renders all task titles', () => {
    render(<ManageTasks tasks={mockAdminTasks} onDelete={vi.fn()} />)
    for (const t of mockAdminTasks) {
      expect(screen.getByText(t.title)).toBeInTheDocument()
    }
  })

  it('shows empty state when no tasks', () => {
    render(<ManageTasks tasks={[]} onDelete={vi.fn()} />)
    expect(screen.getByText(/no tasks on the platform/i)).toBeInTheDocument()
  })

  it('calls onDelete with correct task id when delete button clicked', () => {
    const onDelete = vi.fn()
    render(<ManageTasks tasks={mockAdminTasks} onDelete={onDelete} />)
    fireEvent.click(screen.getAllByRole('button', { name: /delete task/i })[0])
    expect(onDelete).toHaveBeenCalledWith(mockAdminTasks[0].id)
  })

  it('shows buyer name for each task', () => {
    render(<ManageTasks tasks={mockAdminTasks} onDelete={vi.fn()} />)
    expect(screen.getByText(mockAdminTasks[0].buyerName)).toBeInTheDocument()
  })

  it('shows status badges', () => {
    render(<ManageTasks tasks={mockAdminTasks} onDelete={vi.fn()} />)
    // Multiple Active tasks exist — use getAllByText
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Paused').length).toBeGreaterThan(0)
  })
})
