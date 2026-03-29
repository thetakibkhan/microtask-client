import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Modal from '@/components/ui/modal'
import type { BuyerTaskFull } from '@/types'
import { TaskStatus } from '@/types'

interface MyTasksProps {
  tasks: BuyerTaskFull[]
  onUpdate: (updated: BuyerTaskFull) => void
  onDelete: (taskId: string) => void
}

const statusStyles: Record<TaskStatus, string> = {
  [TaskStatus.Active]: 'bg-success/15 text-success border border-success/20',
  [TaskStatus.Completed]: 'bg-muted text-muted-foreground',
  [TaskStatus.Paused]: 'bg-warning/15 text-warning border border-warning/20',
}

const statusLabel: Record<TaskStatus, string> = {
  [TaskStatus.Active]: 'Active',
  [TaskStatus.Completed]: 'Completed',
  [TaskStatus.Paused]: 'Paused',
}

const MyTasks = ({ tasks, onUpdate, onDelete }: MyTasksProps) => {
  const [editingTask, setEditingTask] = useState<BuyerTaskFull | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BuyerTaskFull | null>(null)

  const [editTitle, setEditTitle] = useState('')
  const [editDetail, setEditDetail] = useState('')
  const [editSubmissionInfo, setEditSubmissionInfo] = useState('')

  const sorted = [...tasks].sort(
    (a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime(),
  )

  const openEdit = (task: BuyerTaskFull) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDetail(task.detail)
    setEditSubmissionInfo(task.submissionInfo)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask) return
    onUpdate({ ...editingTask, title: editTitle, detail: editDetail, submissionInfo: editSubmissionInfo })
    setEditingTask(null)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">My Tasks</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage your posted tasks. Deleting a task refunds unused coins.</p>

      {sorted.length === 0 ? (
        <div className="p-12 bg-card rounded-2xl orbit-shadow text-center text-muted-foreground text-sm">
          No tasks yet. Create your first task!
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((task) => {
            const remaining = task.requiredWorkers - task.submissionsReceived
            const refundCoins = remaining * task.payableAmount

            return (
              <div key={task.id} className="p-5 bg-card rounded-2xl orbit-shadow border border-border hover:border-primary/20 transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">{task.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
                        {statusLabel[task.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{task.detail}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>Workers: <strong className="text-foreground">{task.submissionsReceived}/{task.requiredWorkers}</strong></span>
                      <span>Pay: <strong className="text-success">{task.payableAmount} coins</strong></span>
                      <span>Deadline: <strong className="text-foreground">{task.completionDate}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(task)}
                      className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-primary transition-colors duration-200"
                      title="Edit task"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(task)}
                      className="p-2 rounded-xl bg-accent text-muted-foreground hover:text-destructive transition-colors duration-200"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit modal */}
      {editingTask && (
        <Modal title="Update Task" onClose={() => setEditingTask(null)}>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="space-y-1.5">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-detail">Task Detail</Label>
              <Textarea
                id="edit-detail"
                value={editDetail}
                onChange={(e) => setEditDetail(e.target.value)}
                required
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-submission">Submission Info</Label>
              <Textarea
                id="edit-submission"
                value={editSubmissionInfo}
                onChange={(e) => setEditSubmissionInfo(e.target.value)}
                required
                rows={2}
                className="rounded-xl resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <Modal title="Delete Task" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong className="text-foreground">{deleteTarget.title}</strong>?
            </p>
            {deleteTarget.submissionsReceived < deleteTarget.requiredWorkers && (
              <div className="px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm">
                🪙 You will receive a refund of{' '}
                <strong>
                  {((deleteTarget.requiredWorkers - deleteTarget.submissionsReceived) * deleteTarget.payableAmount).toFixed(2)} coins
                </strong>{' '}
                for {deleteTarget.requiredWorkers - deleteTarget.submissionsReceived} unfilled slots.
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  )
}

export default MyTasks
