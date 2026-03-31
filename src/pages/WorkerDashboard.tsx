import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import WorkerHome from '@/pages/worker/WorkerHome'
import TaskList from '@/pages/worker/TaskList'
import MySubmissions from '@/pages/worker/MySubmissions'
import Withdrawals from '@/pages/worker/Withdrawals'
import api from '@/lib/api'
import type {
  WorkerOwnSubmission,
  WithdrawalRecord,
  AppNotification,
  AvailableTask,
} from '@/types'
import { SubmissionStatus, WithdrawalStatus, PaymentSystem } from '@/types'
import { useAuth } from '@/providers/AuthProvider'

// Map MongoDB _id to id for frontend types
function toId(doc: { _id: string }): string {
  return String(doc._id)
}

interface ApiTask {
  _id: string
  title: string
  detail: string
  imageUrl: string
  buyerName: string
  buyerEmail: string
  requiredWorkers: number
  payableAmount: number
  submissionInfo: string
  completionDate: string
}

interface ApiSubmission {
  _id: string
  taskId: string
  taskTitle: string
  buyerName: string
  payableAmount: number
  submissionDetails: string
  submittedAt: string
  status: string
}

interface ApiWithdrawal {
  _id: string
  workerEmail: string
  workerName: string
  coins: number
  amount: number
  paymentMethod: string
  accountNumber: string
  requestedAt: string
  status: string
}

interface ApiNotification {
  _id: string
  message: string
  recipientEmail: string
  read: boolean
  createdAt: string
}

interface ApiUser {
  name: string
  coins: number
}

function mapTask(t: ApiTask): AvailableTask {
  return {
    id: toId(t as { _id: string }),
    title: t.title,
    detail: t.detail,
    imageUrl: t.imageUrl,
    buyerName: t.buyerName,
    buyerEmail: t.buyerEmail,
    requiredWorkers: t.requiredWorkers,
    payableAmount: t.payableAmount,
    submissionInfo: t.submissionInfo,
    completionDate: t.completionDate,
  }
}

function mapSubmission(s: ApiSubmission): WorkerOwnSubmission {
  return {
    id: toId(s as { _id: string }),
    taskId: s.taskId,
    taskTitle: s.taskTitle,
    buyerName: s.buyerName ?? '',
    payableAmount: s.payableAmount,
    submissionDetails: s.submissionDetails,
    submittedAt: s.submittedAt,
    status: s.status as SubmissionStatus,
  }
}

function mapWithdrawal(w: ApiWithdrawal): WithdrawalRecord {
  return {
    id: toId(w as { _id: string }),
    workerEmail: w.workerEmail,
    workerName: w.workerName,
    withdrawalCoin: w.coins,
    withdrawalAmount: w.amount,
    paymentSystem: (w.paymentMethod as PaymentSystem) ?? PaymentSystem.Bkash,
    accountNumber: w.accountNumber,
    withdrawDate: new Date(w.requestedAt).toISOString().split('T')[0],
    status: w.status as WithdrawalStatus,
  }
}

function mapNotification(n: ApiNotification): AppNotification {
  return {
    id: toId(n as { _id: string }),
    message: n.message,
    toEmail: n.recipientEmail,
    actionRoute: '',
    time: n.createdAt,
    read: n.read,
  }
}

const WorkerDashboardPage = () => {
  const { user } = useAuth()
  const [activePage, setActivePage] = useState(0)
  const [tasks, setTasks] = useState<AvailableTask[]>([])
  const [submissions, setSubmissions] = useState<WorkerOwnSubmission[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [coinBalance, setCoinBalance] = useState(0)
  const [userName, setUserName] = useState('')

  const fetchAll = useCallback(async () => {
    const [userRes, tasksRes, subsRes, withdrawalsRes, notifsRes] = await Promise.all([
      api.get<ApiUser>('/api/users/me'),
      api.get<ApiTask[]>('/api/tasks'),
      api.get<{ submissions: ApiSubmission[] }>('/api/submissions/mine'),
      api.get<ApiWithdrawal[]>('/api/withdrawals/mine'),
      api.get<ApiNotification[]>('/api/notifications'),
    ])

    setCoinBalance(userRes.data.coins)
    setUserName(userRes.data.name)
    setTasks(tasksRes.data.map(mapTask))
    setSubmissions(subsRes.data.submissions.map(mapSubmission))
    setWithdrawals(withdrawalsRes.data.map(mapWithdrawal))
    setNotifications(notifsRes.data.map(mapNotification))
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleMarkAllRead = async () => {
    await api.patch('/api/notifications/read-all')
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNewSubmission = async (submission: WorkerOwnSubmission) => {
    await api.post('/api/submissions', {
      taskId: submission.taskId,
      submissionDetails: submission.submissionDetails,
    })
    await fetchAll()
  }

  const handleWithdrawal = async (record: WithdrawalRecord) => {
    await api.post('/api/withdrawals', {
      coins: record.withdrawalCoin,
      paymentMethod: record.paymentSystem,
      accountNumber: record.accountNumber,
    })
    await fetchAll()
  }

  const pages = [
    <WorkerHome key="home" submissions={submissions} coinBalance={coinBalance} />,
    <TaskList key="tasks" tasks={tasks} onSubmit={handleNewSubmission} />,
    <MySubmissions key="submissions" submissions={submissions} />,
    <Withdrawals
      key="withdrawals"
      coinBalance={coinBalance}
      withdrawals={withdrawals}
      onWithdraw={handleWithdrawal}
    />,
  ]

  return (
    <DashboardLayout
      role="worker"
      activeIndex={activePage}
      onNavigate={setActivePage}
      notifications={notifications}
      onMarkAllRead={handleMarkAllRead}
      coinBalance={coinBalance}
      userName={userName || user?.displayName || ''}
    >
      {pages[activePage]}
    </DashboardLayout>
  )
}

export default WorkerDashboardPage
