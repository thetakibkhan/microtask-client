import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import AdminHome from '@/pages/admin/AdminHome'
import ManageUsers from '@/pages/admin/ManageUsers'
import ManageTasks from '@/pages/admin/ManageTasks'
import api from '@/lib/api'
import type { AdminUser, AdminTask, WithdrawalRecord, Role, AppNotification } from '@/types'
import { TaskStatus, WithdrawalStatus, PaymentSystem } from '@/types'
import { useAuth } from '@/providers/AuthProvider'

interface ApiUser {
  _id: string
  name: string
  email: string
  photoURL: string
  role: Role
  coins: number
}

interface ApiTask {
  _id: string
  title: string
  buyerName: string
  buyerEmail: string
  requiredWorkers: number
  payableAmount: number
  completionDate: string
  status: string
  submissionsReceived: number
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

function mapUser(u: ApiUser): AdminUser {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    photoUrl: u.photoURL ?? '',
    role: u.role,
    coins: u.coins,
  }
}

function mapTask(t: ApiTask): AdminTask {
  return {
    id: String(t._id),
    title: t.title,
    buyerName: t.buyerName ?? t.buyerEmail,
    buyerEmail: t.buyerEmail,
    requiredWorkers: t.requiredWorkers,
    payableAmount: t.payableAmount,
    completionDate: t.completionDate,
    status: t.status as TaskStatus,
    submissionsReceived: t.submissionsReceived,
  }
}

function mapWithdrawal(w: ApiWithdrawal): WithdrawalRecord {
  return {
    id: String(w._id),
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
    id: String(n._id),
    message: n.message,
    toEmail: n.recipientEmail,
    actionRoute: '',
    time: n.createdAt,
    read: n.read,
  }
}

const AdminDashboardPage = () => {
  const { user } = useAuth()
  const [activePage, setActivePage] = useState(0)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [tasks, setTasks] = useState<AdminTask[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([])
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [userName, setUserName] = useState('')

  const fetchAll = useCallback(async () => {
    const [meRes, usersRes, tasksRes, withdrawalsRes, notifsRes] = await Promise.all([
      api.get<{ name: string }>('/api/users/me'),
      api.get<ApiUser[]>('/api/users'),
      api.get<ApiTask[]>('/api/tasks/all'),
      api.get<ApiWithdrawal[]>('/api/withdrawals'),
      api.get<ApiNotification[]>('/api/notifications'),
    ])

    setUserName(meRes.data.name)
    setUsers(usersRes.data.map(mapUser))
    setTasks(tasksRes.data.map(mapTask))
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

  const handleApproveWithdrawal = async (id: string) => {
    await api.patch(`/api/withdrawals/${id}/approve`)
    await fetchAll()
  }

  const handleRoleChange = async (userId: string, newRole: Role) => {
    await api.patch(`/api/users/${userId}/role`, { role: newRole })
    await fetchAll()
  }

  const handleRemoveUser = async (userId: string) => {
    await api.delete(`/api/users/${userId}`)
    await fetchAll()
  }

  const handleDeleteTask = async (taskId: string) => {
    await api.delete(`/api/tasks/${taskId}/admin`)
    await fetchAll()
  }

  const pages = [
    <AdminHome
      key="home"
      users={users}
      tasks={tasks}
      withdrawals={withdrawals}
      onApproveWithdrawal={handleApproveWithdrawal}
    />,
    <ManageUsers
      key="users"
      users={users}
      onRoleChange={handleRoleChange}
      onRemove={handleRemoveUser}
    />,
    <ManageTasks
      key="tasks"
      tasks={tasks}
      onDelete={handleDeleteTask}
    />,
  ]

  return (
    <DashboardLayout
      role="admin"
      activeIndex={activePage}
      onNavigate={setActivePage}
      notifications={notifications}
      onMarkAllRead={handleMarkAllRead}
      userName={userName || user?.displayName || 'Admin'}
    >
      {pages[activePage]}
    </DashboardLayout>
  )
}

export default AdminDashboardPage
