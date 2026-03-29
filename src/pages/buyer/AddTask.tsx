import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUploadField from '@/components/ImageUploadField'
import type { BuyerTaskFull } from '@/types'
import { TaskStatus } from '@/types'

interface AddTaskProps {
  coinBalance: number
  onTaskCreated: (task: BuyerTaskFull) => void
  onGoToPurchase: () => void
}

const AddTask = ({ coinBalance, onTaskCreated, onGoToPurchase }: AddTaskProps) => {
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [requiredWorkers, setRequiredWorkers] = useState('')
  const [payableAmount, setPayableAmount] = useState('')
  const [submissionInfo, setSubmissionInfo] = useState('')
  const [completionDate, setCompletionDate] = useState('')
  const [coinError, setCoinError] = useState(false)

  const workers = Number(requiredWorkers) || 0
  const amount = Number(payableAmount) || 0
  const totalCost = workers * amount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCoinError(false)

    if (totalCost > coinBalance) {
      setCoinError(true)
      return
    }

    const newTask: BuyerTaskFull = {
      id: `t_${Date.now()}`,
      title,
      detail,
      imageUrl,
      requiredWorkers: workers,
      payableAmount: amount,
      submissionInfo,
      completionDate,
      status: TaskStatus.Active,
      submissionsReceived: 0,
    }

    onTaskCreated(newTask)

    setTitle('')
    setDetail('')
    setImageUrl('')
    setRequiredWorkers('')
    setPayableAmount('')
    setSubmissionInfo('')
    setCompletionDate('')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Add New Task</h1>
      <p className="text-sm text-muted-foreground mb-8">Fill in the details below to create a new task for workers.</p>

      <div className="max-w-2xl bg-card rounded-2xl orbit-shadow p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <p className="text-sm text-muted-foreground">Available coins</p>
          <span className="text-lg font-bold text-success tabular-nums">🪙 {coinBalance}</span>
        </div>

        {totalCost > 0 && (
          <div className={`mb-5 px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${
            totalCost > coinBalance
              ? 'bg-destructive/10 border-destructive/20 text-destructive'
              : 'bg-success/10 border-success/20 text-success'
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Task cost: {totalCost.toFixed(2)} coins
            {totalCost > coinBalance && ' — insufficient balance'}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Task Title</Label>
            <Input
              id="task-title"
              placeholder="e.g., Image Classification — Vehicles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-detail">Task Detail</Label>
            <Textarea
              id="task-detail"
              placeholder="Describe exactly what the worker needs to do..."
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              required
              rows={3}
              className="rounded-xl resize-none"
            />
          </div>

          <ImageUploadField
            label="Task Image (optional)"
            value={imageUrl}
            onChange={setImageUrl}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="required-workers">Required Workers</Label>
              <Input
                id="required-workers"
                type="number"
                min="1"
                placeholder="e.g., 100"
                value={requiredWorkers}
                onChange={(e) => setRequiredWorkers(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payable-amount">Payable Amount (coins)</Label>
              <Input
                id="payable-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g., 0.45"
                value={payableAmount}
                onChange={(e) => setPayableAmount(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="submission-info">Submission Info</Label>
            <Textarea
              id="submission-info"
              placeholder="What should the worker submit as proof of completion?"
              value={submissionInfo}
              onChange={(e) => setSubmissionInfo(e.target.value)}
              required
              rows={2}
              className="rounded-xl resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="completion-date">Completion Date</Label>
            <Input
              id="completion-date"
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </div>

          {coinError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Not enough coins.{' '}
              <button
                type="button"
                className="underline font-medium"
                onClick={onGoToPurchase}
              >
                Purchase more coins
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2 transition-all duration-200"
          >
            Create Task
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

export default AddTask
