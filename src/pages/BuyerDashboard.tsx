import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import BuyerHome from '@/pages/buyer/BuyerHome'
import AddTask from '@/pages/buyer/AddTask'
import MyTasks from '@/pages/buyer/MyTasks'
import PurchaseCoin from '@/pages/buyer/PurchaseCoin'
import PaymentHistory from '@/pages/buyer/PaymentHistory'
import api from '@/lib/api'
import { SubmissionStatus, TaskStatus, PaymentType } from '@/types'
import type { BuyerTaskFull, WorkerSubmission, PaymentRecord, CoinPackage, AppNotification } from '@/types'
import { useAuth } from '@/providers/AuthProvider'

interface ApiTask {
  _id: string
  title: string
  detail: string
  imageUrl: string
  requiredWorkers: number
  payableAmount: number
  submissionInfo: string
  completionDate: string
  status: string
  submissionsReceived: number
}

interface ApiSubmission {
  _id: string
  taskId: string
  taskTitle: string
  workerName: string
  workerEmail: string
  submittedAt: string
  submissionDetails: string
  status: string
}

interface ApiPayment {
  _id: string
  type: string
  description: string
  coins: number
  amount: number
  date: string
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

function mapTask(t: ApiTask): BuyerTaskFull {
  return {
    id: String(t._id),
    title: t.title,
    detail: t.detail,
    imageUrl: t.imageUrl,
    requiredWorkers: t.requiredWorkers,
    payableAmount: t.payableAmount,
    submissionInfo: t.submissionInfo,
    completionDate: t.completionDate,
    status: t.status as TaskStatus,
    submissionsReceived: t.submissionsReceived,
  }
}

function mapSubmission(s: ApiSubmission): WorkerSubmission {
  return {
    id: String(s._id),
    taskId: s.taskId,
    taskTitle: s.taskTitle,
    workerName: s.workerName ?? s.workerEmail,
    workerEmail: s.workerEmail,
    submittedAt: s.submittedAt,
    submissionDetails: s.submissionDetails,
    status: s.status as SubmissionStatus,
  }
}

function mapPayment(p: ApiPayment): PaymentRecord {
  return {
    id: String(p._id),
    type: p.type as PaymentType,
    description: p.description,
    amount: p.amount,
    coins: p.coins,
    date: new Date(p.date).toISOString().split('T')[0],
  }
}

function mapNotification(n: ApiNotification): AppNotification {
  return {
    id: String(n._id),
    message: n.message,
    toEmail: n.recipientEmail,
    actionRoute: '',
    time: n.createdAt,
    read: n.read,
  }
}

const BuyerDashboardPage = () => {
  const { user } = useAuth()
  const [activePage, setActivePage] = useState(0)
  const [tasks, setTasks] = useState<BuyerTaskFull[]>([])
  const [submissions, setSubmissions] = useState<WorkerSubmission[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [coinBalance, setCoinBalance] = useState(0)
  const [userName, setUserName] = useState('')

  const fetchAll = useCallback(async () => {
    const [userRes, tasksRes, subsRes, paymentsRes, notifsRes] = await Promise.all([
      api.get<ApiUser>('/api/users/me'),
      api.get<ApiTask[]>('/api/tasks/mine'),
      api.get<ApiSubmission[]>('/api/submissions/pending'),
      api.get<ApiPayment[]>('/api/payments/history'),
      api.get<ApiNotification[]>('/api/notifications'),
    ])

    setCoinBalance(userRes.data.coins)
    setUserName(userRes.data.name)
    setTasks(tasksRes.data.map(mapTask))
    setSubmissions(subsRes.data.map(mapSubmission))
    setPayments(paymentsRes.data.map(mapPayment))
    setNotifications(notifsRes.data.map(mapNotification))
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleMarkAllRead = async () => {
    await api.patch('/api/notifications/read-all')
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleApprove = async (submissionId: string) => {
    await api.patch(`/api/submissions/${submissionId}/approve`)
    await fetchAll()
  }

  const handleReject = async (submissionId: string) => {
    await api.patch(`/api/submissions/${submissionId}/reject`)
    await fetchAll()
  }

  // Stripe not configured yet — mock purchase updates coin balance locally
  const handlePurchase = (pkg: CoinPackage) => {
    setCoinBalance((prev) => prev + pkg.coins)
  }

  const pages = [
    <BuyerHome
      key="home"
      coinBalance={coinBalance}
      tasks={tasks}
      submissions={submissions}
      onApprove={handleApprove}
      onReject={handleReject}
    />,
    <AddTask
      key="add"
      coinBalance={coinBalance}
      onTaskCreated={fetchAll}
      onGoToPurchase={() => setActivePage(3)}
    />,
    <MyTasks
      key="tasks"
      tasks={tasks}
      onUpdate={fetchAll}
      onDelete={fetchAll}
    />,
    <PurchaseCoin
      key="purchase"
      onPurchase={handlePurchase}
    />,
    <PaymentHistory
      key="history"
      payments={payments}
    />,
  ]

  return (
    <DashboardLayout
      role="buyer"
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

export default BuyerDashboardPage
