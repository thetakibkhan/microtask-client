import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Coins, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Modal from '@/components/ui/modal'
import type { AvailableTask, WorkerOwnSubmission } from '@/types'
import { SubmissionStatus } from '@/types'

interface TaskListProps {
  tasks: AvailableTask[]
  onSubmit: (submission: WorkerOwnSubmission) => void
}

const TaskList = ({ tasks, onSubmit }: TaskListProps) => {
  const [viewTask, setViewTask] = useState<AvailableTask | null>(null)
  const [submissionDetails, setSubmissionDetails] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const openTask = (task: AvailableTask) => {
    setViewTask(task)
    setSubmissionDetails('')
    setSubmitted(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!viewTask) return

    const newSubmission: WorkerOwnSubmission = {
      id: `ws_${Date.now()}`,
      taskId: viewTask.id,
      taskTitle: viewTask.title,
      payableAmount: viewTask.payableAmount,
      buyerName: viewTask.buyerName,
      submissionDetails,
      submittedAt: new Date().toISOString(),
      status: SubmissionStatus.Pending,
    }

    onSubmit(newSubmission)
    setSubmitted(true)
  }

  const available = tasks.filter((t) => t.requiredWorkers > 0)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Task List</h1>
      <p className="text-sm text-muted-foreground mb-8">Browse available tasks and start earning coins.</p>

      {available.length === 0 ? (
        <div className="p-12 bg-card rounded-2xl orbit-shadow text-center text-muted-foreground text-sm">
          No tasks available right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {available.map((task) => (
            <div
              key={task.id}
              className="bg-card rounded-2xl orbit-shadow border border-border hover:border-primary/20 transition-all duration-200 flex flex-col overflow-hidden"
            >
              {task.imageUrl && (
                <img src={task.imageUrl} alt={task.title} className="w-full h-36 object-cover" />
              )}
              <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{task.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{task.detail}</p>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>By <strong className="text-foreground">{task.buyerName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Deadline: <strong className="text-foreground">{task.completionDate}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Coins className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Pay: <strong className="text-success">{task.payableAmount} coins</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Slots left: <strong className="text-foreground">{task.requiredWorkers}</strong></span>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => openTask(task)}
                className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View Details
              </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task detail + submission modal */}
      {viewTask && (
        <Modal title={viewTask.title} onClose={() => setViewTask(null)}>
          {submitted ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <p className="font-semibold text-foreground mb-1">Submission sent!</p>
              <p className="text-sm text-muted-foreground">Your work has been submitted and is pending review.</p>
              <Button
                className="mt-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setViewTask(null)}
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {viewTask.imageUrl && (
                <img src={viewTask.imageUrl} alt={viewTask.title} className="w-full h-40 object-cover rounded-xl" />
              )}
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <span className="text-muted-foreground">Buyer</span>
                  <span className="text-foreground font-medium">{viewTask.buyerName}</span>
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="text-foreground">{viewTask.completionDate}</span>
                  <span className="text-muted-foreground">Payable</span>
                  <span className="text-success font-semibold">{viewTask.payableAmount} coins</span>
                  <span className="text-muted-foreground">Slots left</span>
                  <span className="text-foreground">{viewTask.requiredWorkers}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-accent/50 border border-border text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wide">Task Details</p>
                {viewTask.detail}
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                <p className="font-medium text-primary mb-1 text-xs uppercase tracking-wide">Submission Requirements</p>
                {viewTask.submissionInfo}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="submission-details">Your Submission Details</Label>
                  <Textarea
                    id="submission-details"
                    placeholder="Describe what you did or add any relevant info..."
                    value={submissionDetails}
                    onChange={(e) => setSubmissionDetails(e.target.value)}
                    required
                    rows={3}
                    className="rounded-xl resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                >
                  Submit Work
                </Button>
              </form>
            </div>
          )}
        </Modal>
      )}
    </motion.div>
  )
}

export default TaskList
