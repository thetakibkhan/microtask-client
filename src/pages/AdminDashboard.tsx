import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import AdminHome from '@/pages/admin/AdminHome'
import ManageUsers from '@/pages/admin/ManageUsers'
import ManageTasks from '@/pages/admin/ManageTasks'
import { mockAdminUsers, mockAdminTasks, mockAdminWithdrawals } from '@/mocks/admin'
import { mockNotifications, makeWithdrawalApprovedNotification, MOCK_ADMIN_EMAIL } from '@/mocks/notifications'
import { WithdrawalStatus } from '@/types'
import type { AdminUser, AdminTask, WithdrawalRecord, Role, AppNotification } from '@/types'

const AdminDashboardPage = () => {
  const [activePage, setActivePage] = useState(0)
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers)
  const [tasks, setTasks] = useState<AdminTask[]>(mockAdminTasks)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(mockAdminWithdrawals)
  const [notifications, setNotifications] = useState<AppNotification[]>(
    mockNotifications.filter((n) => n.toEmail === MOCK_ADMIN_EMAIL)
  )

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleApproveWithdrawal = (id: string) => {
    const withdrawal = withdrawals.find((w) => w.id === id)
    if (!withdrawal) return

    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: WithdrawalStatus.Approved } : w)),
    )

    setUsers((prev) =>
      prev.map((u) =>
        u.email === withdrawal.workerEmail
          ? { ...u, coins: Math.max(0, u.coins - withdrawal.withdrawalCoin) }
          : u,
      ),
    )

    // Create a notification for the worker
    const workerNotif = makeWithdrawalApprovedNotification(
      withdrawal.withdrawalCoin,
      withdrawal.withdrawalAmount,
      withdrawal.paymentSystem,
      withdrawal.workerEmail,
    )
    console.info('Worker notification created:', workerNotif)
  }

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    )
  }

  const handleRemoveUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
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
      userName="Admin"
    >
      {pages[activePage]}
    </DashboardLayout>
  )
}

export default AdminDashboardPage
