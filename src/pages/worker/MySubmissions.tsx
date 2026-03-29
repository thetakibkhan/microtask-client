import { motion } from 'framer-motion'
import { SubmissionStatus } from '@/types'
import type { WorkerOwnSubmission } from '@/types'

interface MySubmissionsProps {
  submissions: WorkerOwnSubmission[]
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

const MySubmissions = ({ submissions }: MySubmissionsProps) => {
  const sorted = [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">My Submissions</h1>
      <p className="text-sm text-muted-foreground mb-8">All your submitted work and their current status.</p>

      <div className="bg-card rounded-2xl orbit-shadow overflow-hidden">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No submissions yet. Browse tasks to get started!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-xs text-muted-foreground font-medium">
                  <th className="text-left px-6 py-4">Task Title</th>
                  <th className="text-left px-6 py-4">Buyer</th>
                  <th className="text-left px-6 py-4">Submitted</th>
                  <th className="text-left px-6 py-4">Payable</th>
                  <th className="text-right px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{s.taskTitle}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.buyerName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(s.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-success tabular-nums">
                      {s.payableAmount} coins
                    </td>
                    <td className="px-6 py-4 text-right">
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

export default MySubmissions
