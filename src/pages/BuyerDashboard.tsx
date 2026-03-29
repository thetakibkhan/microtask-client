import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import BuyerHome from '@/pages/buyer/BuyerHome'
import AddTask from '@/pages/buyer/AddTask'
import MyTasks from '@/pages/buyer/MyTasks'
import PurchaseCoin from '@/pages/buyer/PurchaseCoin'
import PaymentHistory from '@/pages/buyer/PaymentHistory'
import { mockTasks, mockSubmissions, mockPayments, INITIAL_COIN_BALANCE } from '@/mocks/buyer'
import { PaymentType, SubmissionStatus } from '@/types'
import type { BuyerTaskFull, WorkerSubmission, PaymentRecord, CoinPackage } from '@/types'

const BuyerDashboardPage = () => {
  const [activePage, setActivePage] = useState(0)
  const [tasks, setTasks] = useState<BuyerTaskFull[]>(mockTasks)
  const [submissions, setSubmissions] = useState<WorkerSubmission[]>(mockSubmissions)
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments)
  const [coinBalance, setCoinBalance] = useState(INITIAL_COIN_BALANCE)

  const handleTaskCreated = (task: BuyerTaskFull) => {
    const cost = task.requiredWorkers * task.payableAmount
    setTasks((prev) => [task, ...prev])
    setCoinBalance((prev) => prev - cost)

    const record: PaymentRecord = {
      id: `p_${Date.now()}`,
      type: PaymentType.TaskPayment,
      description: `Task created: ${task.title}`,
      amount: 0,
      coins: -cost,
      date: new Date().toISOString().split('T')[0],
    }
    setPayments((prev) => [record, ...prev])

    setActivePage(2)
  }

  const handleTaskUpdate = (updated: BuyerTaskFull) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  const handleTaskDelete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const refund = (task.requiredWorkers - task.submissionsReceived) * task.payableAmount
    setTasks((prev) => prev.filter((t) => t.id !== taskId))

    if (refund > 0) {
      setCoinBalance((prev) => prev + refund)
      const record: PaymentRecord = {
        id: `p_${Date.now()}`,
        type: PaymentType.Refund,
        description: `Refund: Deleted task (${task.title})`,
        amount: 0,
        coins: refund,
        date: new Date().toISOString().split('T')[0],
      }
      setPayments((prev) => [record, ...prev])
    }
  }

  const handleApprove = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: SubmissionStatus.Approved } : s)),
    )
  }

  const handleReject = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: SubmissionStatus.Rejected } : s)),
    )
  }

  const handlePurchase = (pkg: CoinPackage) => {
    setCoinBalance((prev) => prev + pkg.coins)
    const record: PaymentRecord = {
      id: `p_${Date.now()}`,
      type: PaymentType.Purchase,
      description: `Purchased ${pkg.label} package`,
      amount: pkg.price,
      coins: pkg.coins,
      date: new Date().toISOString().split('T')[0],
    }
    setPayments((prev) => [record, ...prev])
  }

  const pages = [
    <BuyerHome
      key="home"
      coinBalance={coinBalance}
      submissions={submissions}
      onApprove={handleApprove}
      onReject={handleReject}
    />,
    <AddTask
      key="add"
      coinBalance={coinBalance}
      onTaskCreated={handleTaskCreated}
      onGoToPurchase={() => setActivePage(3)}
    />,
    <MyTasks
      key="tasks"
      tasks={tasks}
      onUpdate={handleTaskUpdate}
      onDelete={handleTaskDelete}
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
    >
      {pages[activePage]}
    </DashboardLayout>
  )
}

export default BuyerDashboardPage
