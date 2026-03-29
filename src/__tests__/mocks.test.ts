import { describe, it, expect } from 'vitest'
import { mockTasks, mockSubmissions, mockPayments, coinPackages, INITIAL_COIN_BALANCE } from '@/mocks/buyer'
import { mockAvailableTasks, mockWorkerSubmissions, mockWithdrawals, WORKER_INITIAL_COINS } from '@/mocks/worker'
import { mockAdminUsers, mockAdminTasks, mockAdminWithdrawals } from '@/mocks/admin'
import { SubmissionStatus, TaskStatus, PaymentType, WithdrawalStatus } from '@/types'

// ─── Buyer mock data ───────────────────────────────────────────────────────

describe('buyer mock data', () => {
  it('INITIAL_COIN_BALANCE is a positive number', () => {
    expect(INITIAL_COIN_BALANCE).toBeGreaterThan(0)
  })

  it('every task has required fields', () => {
    for (const task of mockTasks) {
      expect(task.id).toBeTruthy()
      expect(task.title).toBeTruthy()
      expect(task.requiredWorkers).toBeGreaterThanOrEqual(0)
      expect(task.payableAmount).toBeGreaterThan(0)
      expect(Object.values(TaskStatus)).toContain(task.status)
    }
  })

  it('every submission has a valid status', () => {
    for (const s of mockSubmissions) {
      expect(Object.values(SubmissionStatus)).toContain(s.status)
    }
  })

  it('every payment has a valid type', () => {
    for (const p of mockPayments) {
      expect(Object.values(PaymentType)).toContain(p.type)
    }
  })

  it('coin packages have increasing price and coins', () => {
    for (let i = 1; i < coinPackages.length; i++) {
      expect(coinPackages[i].price).toBeGreaterThan(coinPackages[i - 1].price)
      expect(coinPackages[i].coins).toBeGreaterThan(coinPackages[i - 1].coins)
    }
  })
})

// ─── Worker mock data ──────────────────────────────────────────────────────

describe('worker mock data', () => {
  it('WORKER_INITIAL_COINS is a positive number', () => {
    expect(WORKER_INITIAL_COINS).toBeGreaterThan(0)
  })

  it('available tasks all have requiredWorkers > 0', () => {
    for (const task of mockAvailableTasks) {
      expect(task.requiredWorkers).toBeGreaterThan(0)
    }
  })

  it('every available task has buyer info', () => {
    for (const task of mockAvailableTasks) {
      expect(task.buyerName).toBeTruthy()
      expect(task.buyerEmail).toContain('@')
    }
  })

  it('worker submissions have valid statuses', () => {
    for (const s of mockWorkerSubmissions) {
      expect(Object.values(SubmissionStatus)).toContain(s.status)
    }
  })

  it('withdrawals have valid statuses', () => {
    for (const w of mockWithdrawals) {
      expect(Object.values(WithdrawalStatus)).toContain(w.status)
      expect(w.withdrawalCoin).toBeGreaterThanOrEqual(200)
      expect(w.withdrawalAmount).toBe(w.withdrawalCoin / 20)
    }
  })
})

// ─── Admin mock data ───────────────────────────────────────────────────────

describe('admin mock data', () => {
  it('users have worker and buyer roles', () => {
    const roles = mockAdminUsers.map((u) => u.role)
    expect(roles).toContain('worker')
    expect(roles).toContain('buyer')
  })

  it('every user has non-negative coins', () => {
    for (const u of mockAdminUsers) {
      expect(u.coins).toBeGreaterThanOrEqual(0)
    }
  })

  it('every admin task has valid status', () => {
    for (const t of mockAdminTasks) {
      expect(Object.values(TaskStatus)).toContain(t.status)
    }
  })

  it('pending admin withdrawals have pending status', () => {
    const pending = mockAdminWithdrawals.filter((w) => w.status === WithdrawalStatus.Pending)
    expect(pending.length).toBeGreaterThan(0)
  })

  it('withdrawal amount equals coins / 20', () => {
    for (const w of mockAdminWithdrawals) {
      expect(w.withdrawalAmount).toBe(w.withdrawalCoin / 20)
    }
  })
})
