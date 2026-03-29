import { motion } from 'framer-motion'
import { Users, Briefcase, Coins, DollarSign, CheckCircle2 } from 'lucide-react'
import { WithdrawalStatus } from '@/types'
import type { AdminUser, AdminTask, WithdrawalRecord } from '@/types'

interface AdminHomeProps {
  users: AdminUser[]
  tasks: AdminTask[]
  withdrawals: WithdrawalRecord[]
  onApproveWithdrawal: (id: string) => void
}

const AdminHome = ({ users, tasks, withdrawals, onApproveWithdrawal }: AdminHomeProps) => {
  const totalWorkers = users.filter((u) => u.role === 'worker').length
  const totalBuyers = users.filter((u) => u.role === 'buyer').length
  const totalCoins = users.reduce((sum, u) => sum + u.coins, 0)
  const totalPayments = tasks.reduce(
    (sum, t) => sum + t.submissionsReceived * t.payableAmount,
    0,
  )

  const stats = [
    { label: 'Total Workers', value: String(totalWorkers), icon: Users, color: 'text-primary' },
    { label: 'Total Buyers', value: String(totalBuyers), icon: Briefcase, color: 'text-success' },
    { label: 'Total Available Coins', value: totalCoins.toLocaleString(), icon: Coins, color: 'text-warning' },
    { label: 'Total Payments ($)', value: `$${totalPayments.toFixed(2)}`, icon: DollarSign, color: 'text-success' },
  ]

  const pendingWithdrawals = withdrawals.filter((w) => w.status === WithdrawalStatus.Pending)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Admin Home</h1>
      <p className="text-sm text-muted-foreground mb-8">Platform-wide overview and pending withdrawal requests.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="p-5 bg-card rounded-2xl orbit-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className={`text-2xl font-bold tracking-tight tabular-nums ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Pending withdrawals */}
      <div className="p-6 bg-card rounded-2xl orbit-shadow">
        <h2 className="font-semibold text-foreground mb-4">
          Pending Withdrawal Requests
          <span className="ml-2 px-2 py-0.5 rounded-full bg-warning/15 text-warning text-xs font-medium border border-warning/20">
            {pendingWithdrawals.length}
          </span>
        </h2>

        {pendingWithdrawals.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No pending withdrawal requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground font-medium">
                  <th className="text-left py-3 pr-4">Worker</th>
                  <th className="text-left py-3 pr-4">Payment System</th>
                  <th className="text-left py-3 pr-4">Account</th>
                  <th className="text-left py-3 pr-4">Coins</th>
                  <th className="text-left py-3 pr-4">Amount</th>
                  <th className="text-left py-3 pr-4">Date</th>
                  <th className="text-right py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingWithdrawals.map((w) => (
                  <tr key={w.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                    <td className="py-3 pr-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{w.workerName}</p>
                        <p className="text-xs text-muted-foreground">{w.workerEmail}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm text-foreground">{w.paymentSystem}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-mono">{w.accountNumber}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-foreground tabular-nums">🪙 {w.withdrawalCoin}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-success tabular-nums">${w.withdrawalAmount}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{w.withdrawDate}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onApproveWithdrawal(w.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 text-xs font-medium transition-colors duration-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Payment Success
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AdminHome
