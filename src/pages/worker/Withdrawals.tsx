import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PaymentSystem, WithdrawalStatus } from '@/types'
import type { WithdrawalRecord } from '@/types'

const COINS_PER_DOLLAR = 20
const MIN_WITHDRAWAL_COINS = 200

interface WithdrawalsProps {
  coinBalance: number
  withdrawals: WithdrawalRecord[]
  onWithdraw: (record: WithdrawalRecord) => void
}

const statusStyles: Record<string, string> = {
  [WithdrawalStatus.Approved]: 'bg-success/15 text-success border border-success/20',
  [WithdrawalStatus.Pending]: 'bg-warning/15 text-warning border border-warning/20',
  [WithdrawalStatus.Rejected]: 'bg-destructive/15 text-destructive border border-destructive/20',
}

const statusLabel: Record<string, string> = {
  [WithdrawalStatus.Approved]: 'Approved',
  [WithdrawalStatus.Pending]: 'Pending',
  [WithdrawalStatus.Rejected]: 'Rejected',
}

const paymentSystems = Object.values(PaymentSystem)

const Withdrawals = ({ coinBalance, withdrawals, onWithdraw }: WithdrawalsProps) => {
  const [coinAmount, setCoinAmount] = useState('')
  const [paymentSystem, setPaymentSystem] = useState<string>(PaymentSystem.Bkash)
  const [accountNumber, setAccountNumber] = useState('')

  const coins = Number(coinAmount) || 0
  const dollarAmount = (coins / COINS_PER_DOLLAR).toFixed(2)
  const canWithdraw = coinBalance >= MIN_WITHDRAWAL_COINS && coins >= MIN_WITHDRAWAL_COINS && coins <= coinBalance

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canWithdraw) return

    const record: WithdrawalRecord = {
      id: `wr_${Date.now()}`,
      workerEmail: 'worker@example.com',
      workerName: 'John Doe',
      withdrawalCoin: coins,
      withdrawalAmount: coins / COINS_PER_DOLLAR,
      paymentSystem: paymentSystem as (typeof PaymentSystem)[keyof typeof PaymentSystem],
      accountNumber,
      withdrawDate: new Date().toISOString().split('T')[0],
      status: WithdrawalStatus.Pending,
    }

    onWithdraw(record)
    setCoinAmount('')
    setAccountNumber('')
  }

  const sorted = [...withdrawals].sort(
    (a, b) => new Date(b.withdrawDate).getTime() - new Date(a.withdrawDate).getTime(),
  )

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Withdrawals</h1>
      <p className="text-sm text-muted-foreground mb-8">Convert your coins to real money. Minimum: 200 coins ($10).</p>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Balance card */}
        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide font-medium">Balance Summary</p>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Coin Balance</p>
              <p className="text-3xl font-extrabold text-success tabular-nums">🪙 {coinBalance}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Dollar Value</p>
              <p className="text-3xl font-extrabold text-foreground tabular-nums">
                ${(coinBalance / COINS_PER_DOLLAR).toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Rate: {COINS_PER_DOLLAR} coins = $1.00</p>
          {coinBalance < MIN_WITHDRAWAL_COINS && (
            <div className="mt-4 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              Insufficient coins — you need at least {MIN_WITHDRAWAL_COINS} coins to withdraw.
            </div>
          )}
        </div>

        {/* Withdrawal form */}
        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide font-medium">Withdraw Coins</p>

          {coinBalance < MIN_WITHDRAWAL_COINS ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              You need at least <strong className="text-foreground">{MIN_WITHDRAWAL_COINS} coins</strong> to make a withdrawal.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="coin-amount">Coins to Withdraw</Label>
                <Input
                  id="coin-amount"
                  type="number"
                  min={MIN_WITHDRAWAL_COINS}
                  max={coinBalance}
                  placeholder={`Min ${MIN_WITHDRAWAL_COINS}`}
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="withdraw-amount">Withdrawal Amount ($)</Label>
                <Input
                  id="withdraw-amount"
                  value={coins > 0 ? `$${dollarAmount}` : ''}
                  readOnly
                  placeholder="Auto-calculated"
                  className="h-11 rounded-xl bg-accent/50 text-muted-foreground cursor-default"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payment-system">Payment System</Label>
                <select
                  id="payment-system"
                  value={paymentSystem}
                  onChange={(e) => setPaymentSystem(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-background text-foreground text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {paymentSystems.map((ps) => (
                    <option key={ps} value={ps}>{ps}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  placeholder="Enter your account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="h-11 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={!canWithdraw}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-200 disabled:opacity-50"
              >
                Request Withdrawal
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* History */}
      <div className="bg-card rounded-2xl orbit-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Withdrawal History</h2>
        </div>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No withdrawals yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground font-medium border-b border-border">
                  <th className="text-left px-6 py-3">Payment System</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">Account</th>
                  <th className="text-left px-6 py-3">Coins</th>
                  <th className="text-left px-6 py-3 hidden sm:table-cell">Amount</th>
                  <th className="text-left px-6 py-3 hidden md:table-cell">Date</th>
                  <th className="text-right px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((w) => (
                  <tr key={w.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{w.paymentSystem}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono hidden sm:table-cell">{w.accountNumber}</td>
                    <td className="px-6 py-4 text-sm text-foreground tabular-nums">🪙 {w.withdrawalCoin}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-success tabular-nums hidden sm:table-cell">${w.withdrawalAmount}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{w.withdrawDate}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[w.status]}`}>
                        {statusLabel[w.status]}
                      </span>
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

export default Withdrawals
