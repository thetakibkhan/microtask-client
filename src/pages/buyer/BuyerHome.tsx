import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, DollarSign, Users, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { SubmissionStatus } from '@/types'
import type { WorkerSubmission } from '@/types'
import { mockTasks, mockSubmissions } from '@/mocks/buyer'
import Modal from '@/components/ui/modal'

interface BuyerHomeProps {
  coinBalance: number
  onApprove: (submissionId: string) => void
  onReject: (submissionId: string) => void
  submissions: WorkerSubmission[]
}

const BuyerHome = ({ coinBalance, onApprove, onReject, submissions }: BuyerHomeProps) => {
  const [viewSubmission, setViewSubmission] = useState<WorkerSubmission | null>(null)

  const totalTasks = mockTasks.length
  const activeTasks = mockTasks.filter((t) => t.status === 'active')
  const pendingWorkerSlots = activeTasks.reduce(
    (sum, t) => sum + (t.requiredWorkers - t.submissionsReceived),
    0,
  )
  const totalSpentCoins = mockTasks.reduce(
    (sum, t) => sum + t.requiredWorkers * t.payableAmount,
    0,
  )

  const pending = submissions.filter((s) => s.status === SubmissionStatus.Pending)

  const stats = [
    { label: 'Total Tasks', value: String(totalTasks), icon: ClipboardList, color: 'text-primary' },
    { label: 'Pending Worker Slots', value: String(pendingWorkerSlots), icon: Users, color: 'text-warning' },
    { label: 'Your Coin Balance', value: String(coinBalance), icon: DollarSign, color: 'text-success' },
    { label: 'Total Coins Spent', value: totalSpentCoins.toFixed(0), icon: DollarSign, color: 'text-muted-foreground' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Buyer Home</h1>
      <p className="text-sm text-muted-foreground mb-8">Overview of your campaigns and pending reviews.</p>

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

      {/* Pending submissions table */}
      <div className="p-6 bg-card rounded-2xl orbit-shadow">
        <h2 className="font-semibold text-foreground mb-4">
          Pending Submissions
          <span className="ml-2 px-2 py-0.5 rounded-full bg-warning/15 text-warning text-xs font-medium border border-warning/20">
            {pending.length}
          </span>
        </h2>

        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No pending submissions right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground font-medium">
                  <th className="text-left py-3 pr-4">Worker</th>
                  <th className="text-left py-3 pr-4">Task</th>
                  <th className="text-left py-3 pr-4">Proof</th>
                  <th className="text-left py-3 pr-4">Submitted</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/15 text-primary font-semibold text-xs flex items-center justify-center">
                          {s.workerName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-foreground">{s.workerName}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-sm text-foreground">{s.taskTitle}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-mono">{s.proofLink}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground">
                      {new Date(s.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onApprove(s.id)}
                          className="p-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors duration-200"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onReject(s.id)}
                          className="p-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors duration-200"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewSubmission(s)}
                          className="p-1.5 rounded-lg bg-accent text-muted-foreground hover:text-foreground transition-colors duration-200"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewSubmission && (
        <Modal title="Submission Details" onClose={() => setViewSubmission(null)}>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <span className="text-muted-foreground">Worker</span>
              <span className="text-foreground font-medium">{viewSubmission.workerName}</span>
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{viewSubmission.workerEmail}</span>
              <span className="text-muted-foreground">Task</span>
              <span className="text-foreground">{viewSubmission.taskTitle}</span>
              <span className="text-muted-foreground">Proof file</span>
              <span className="text-primary font-mono">{viewSubmission.proofLink}</span>
              <span className="text-muted-foreground">Submitted at</span>
              <span className="text-foreground">{new Date(viewSubmission.submittedAt).toLocaleString()}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { onApprove(viewSubmission.id); setViewSubmission(null) }}
                className="flex-1 py-2 rounded-xl bg-success/15 text-success font-medium hover:bg-success/25 transition-colors duration-200 text-sm"
              >
                Approve
              </button>
              <button
                onClick={() => { onReject(viewSubmission.id); setViewSubmission(null) }}
                className="flex-1 py-2 rounded-xl bg-destructive/15 text-destructive font-medium hover:bg-destructive/25 transition-colors duration-200 text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}

export default BuyerHome
