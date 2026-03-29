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
import type { WorkerOwnSubmission, WithdrawalRecord } from '@/types'

const WorkerDashboardPage = () => {
  const [activePage, setActivePage] = useState(0)
  const [submissions, setSubmissions] = useState<WorkerOwnSubmission[]>(mockWorkerSubmissions)
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(mockWithdrawals)
  const [coinBalance, setCoinBalance] = useState(WORKER_INITIAL_COINS)

  const handleNewSubmission = (submission: WorkerOwnSubmission) => {
    setSubmissions((prev) => [submission, ...prev])
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
    >
      {pages[activePage]}
    </DashboardLayout>
  )
}

export default WorkerDashboardPage
