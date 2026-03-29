import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import WorkerHome from '@/pages/worker/WorkerHome'
import TaskList from '@/pages/worker/TaskList'
import MySubmissions from '@/pages/worker/MySubmissions'
import Withdrawals from '@/pages/worker/Withdrawals'
import {
  mockAvailableTasks,
  mockWorkerSubmissions,
  mockWithdrawals,
  WORKER_INITIAL_COINS,
} from '@/mocks/worker'
import {
  mockNotifications,
  makeNewSubmissionNotification,
  MOCK_WORKER_EMAIL,
} from '@/mocks/notifications'
import type { WorkerOwnSubmission, WithdrawalRecord, AppNotification } from '@/types'

const WORKER_NAME = 'John Doe'

const WorkerDashboardPage = () => {
  const [activePage, setActivePage] = useState(0)
  const [submissions, setSubmissions] = useState<WorkerOwnSubmission[]>(mockWorkerSubmissions)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(mockWithdrawals)
  const [coinBalance, setCoinBalance] = useState(WORKER_INITIAL_COINS)
  const [notifications, setNotifications] = useState<AppNotification[]>(
    mockNotifications.filter((n) => n.toEmail === MOCK_WORKER_EMAIL)
  )

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleNewSubmission = (submission: WorkerOwnSubmission) => {
    setSubmissions((prev) => [submission, ...prev])

    // Notify the buyer that a new submission arrived
    const buyerNotification = makeNewSubmissionNotification(
      submission.taskTitle,
      WORKER_NAME,
      submission.buyerName,  // used as toEmail placeholder — backend will resolve real email
    )
    // In a real app this goes to the server; here we just log it
    console.info('Buyer notification created:', buyerNotification)
  }

  const handleWithdrawal = (record: WithdrawalRecord) => {
    setCoinBalance((prev) => prev - record.withdrawalCoin)
    setWithdrawals((prev) => [record, ...prev])
  }

  const pages = [
    <WorkerHome
      key="home"
      submissions={submissions}
      coinBalance={coinBalance}
    />,
    <TaskList
      key="tasks"
      tasks={mockAvailableTasks}
      onSubmit={handleNewSubmission}
    />,
    <MySubmissions
      key="submissions"
      submissions={submissions}
    />,
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
      userName={WORKER_NAME}
    >
      {pages[activePage]}
    </DashboardLayout>
  )
}

export default WorkerDashboardPage
