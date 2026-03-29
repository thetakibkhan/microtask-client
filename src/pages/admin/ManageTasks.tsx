import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { TaskStatus } from '@/types'
import type { AdminTask } from '@/types'

interface ManageTasksProps {
  tasks: AdminTask[]
  onDelete: (taskId: string) => void
}

const statusStyles: Record<string, string> = {
  [TaskStatus.Active]: 'bg-success/15 text-success border border-success/20',
  [TaskStatus.Completed]: 'bg-muted text-muted-foreground',
  [TaskStatus.Paused]: 'bg-warning/15 text-warning border border-warning/20',
}

const statusLabel: Record<string, string> = {
  [TaskStatus.Active]: 'Active',
  [TaskStatus.Completed]: 'Completed',
  [TaskStatus.Paused]: 'Paused',
}

const ManageTasks = ({ tasks, onDelete }: ManageTasksProps) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Manage Tasks</h1>
    <p className="text-sm text-muted-foreground mb-8">Review all platform tasks and remove inappropriate ones.</p>

    <div className="bg-card rounded-2xl orbit-shadow overflow-hidden">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No tasks on the platform.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left px-6 py-4">Task</th>
                <th className="text-left px-6 py-4">Buyer</th>
                <th className="text-left px-6 py-4">Workers</th>
                <th className="text-left px-6 py-4">Pay / slot</th>
                <th className="text-left px-6 py-4">Deadline</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground max-w-xs truncate">{t.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{t.buyerName}</p>
                    <p className="text-xs text-muted-foreground">{t.buyerEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground tabular-nums">
                    {t.submissionsReceived}/{t.requiredWorkers + t.submissionsReceived}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-success tabular-nums">
                    {t.payableAmount} coins
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.completionDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[t.status]}`}>
                      {statusLabel[t.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(t.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 text-xs font-medium transition-colors duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Task
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

export default ManageTasks
