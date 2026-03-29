import { motion } from 'framer-motion'
import { ClipboardList, Clock, DollarSign } from 'lucide-react'
import { SubmissionStatus } from '@/types'
import type { WorkerOwnSubmission } from '@/types'

interface WorkerHomeProps {
  submissions: WorkerOwnSubmission[]
  coinBalance: number
}

const statusStyles: Record<string, string> = {
  [SubmissionStatus.Approved]: 'bg-success/15 text-success border border-success/20',
  [SubmissionStatus.Pending]: 'bg-warning/15 text-warning border border-warning/20',
  [SubmissionStatus.Rejected]: 'bg-destructive/15 text-destructive border border-destructive/20',
}

const statusLabel: Record<string, string> = {
  [SubmissionStatus.Approved]: 'Approved',
  [SubmissionStatus.Pending]: 'Pending',
  [SubmissionStatus.Rejected]: 'Rejected',
}

const WorkerHome = ({ submissions, coinBalance }: WorkerHomeProps) => {
  const totalSubmissions = submissions.length
  const pendingCount = submissions.filter((s) => s.status === SubmissionStatus.Pending).length
  const totalEarnings = submissions
    .filter((s) => s.status === SubmissionStatus.Approved)
    .reduce((sum, s) => sum + s.payableAmount, 0)

  const approved = submissions.filter((s) => s.status === SubmissionStatus.Approved)

  const stats = [
    { label: 'Total Submissions', value: String(totalSubmissions), icon: ClipboardList, color: 'text-primary' },
    { label: 'Pending Submissions', value: String(pendingCount), icon: Clock, color: 'text-warning' },
    { label: 'Total Earnings (coins)', value: totalEarnings.toFixed(2), icon: DollarSign, color: 'text-success' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Worker Home</h1>
      <p className="text-sm text-muted-foreground mb-8">Your performance overview and approved submissions.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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

      {/* Coin balance banner */}
      <div className="mb-8 px-5 py-4 bg-card rounded-2xl orbit-shadow flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Current Coin Balance</p>
          <p className="text-xl font-bold text-success tabular-nums">🪙 {coinBalance}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-0.5">Dollar Equivalent</p>
          <p className="text-xl font-bold text-foreground tabular-nums">${(coinBalance / 20).toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">20 coins = $1</p>
        </div>
      </div>

      {/* Approved submissions table */}
      <div className="p-6 bg-card rounded-2xl orbit-shadow">
        <h2 className="font-semibold text-foreground mb-4">
          Approved Submissions
          <span className="ml-2 px-2 py-0.5 rounded-full bg-success/15 text-success text-xs font-medium border border-success/20">
            {approved.length}
          </span>
        </h2>

        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No approved submissions yet. Start completing tasks!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground font-medium">
                  <th className="text-left py-3 pr-4">Task Title</th>
                  <th className="text-left py-3 pr-4">Buyer</th>
                  <th className="text-left py-3 pr-4">Earned (coins)</th>
                  <th className="text-right py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                    <td className="py-3 pr-4 text-sm font-medium text-foreground">{s.taskTitle}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">{s.buyerName}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-success tabular-nums">{s.payableAmount}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[s.status]}`}>
                        {statusLabel[s.status]}
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

export default WorkerHome
