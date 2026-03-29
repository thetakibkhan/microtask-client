export type Role = 'worker' | 'buyer' | 'admin'

export const SubmissionStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const
export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus]

export const TaskStatus = {
  Active: 'active',
  Completed: 'completed',
  Paused: 'paused',
} as const
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const PaymentType = {
  Purchase: 'purchase',
  Refund: 'refund',
  TaskPayment: 'task_payment',
} as const
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType]

export interface NavItem {
  label: string
  icon: React.ElementType
  path: string
}

export interface StatCard {
  label: string
  value: string
  trend: string
  up: boolean
  icon: React.ElementType
  glow: string
}

export interface RecentTask {
  title: string
  reward: string
  status: string
  time: string
}

export interface Withdrawal {
  method: string
  amount: string
  date: string
  status: string
}

export interface BuyerTask {
  title: string
  submissions: number
  approved: number
  reward: string
  status: string
}

export interface PendingSubmission {
  worker: string
  task: string
  proof: string
  time: string
}

export interface CreditPackage {
  name: string
  credits: string
  price: string
  popular: boolean
}

export interface RecentUser {
  name: string
  email: string
  role: string
  joined: string
  status: string
}

export interface PendingWithdrawal {
  user: string
  amount: string
  method: string
  requested: string
}

export interface ActivityLogItem {
  action: string
  time: string
  type: 'info' | 'warning' | 'success' | 'error'
}

export interface TopEarner {
  name: string
  coins: number
  img: string
}

export interface FeaturedTask {
  title: string
  buyer: string
  coins: number
  workers: number
  deadline: string
}

export interface Testimonial {
  name: string
  role: string
  quote: string
  img: string
}

export interface BuyerTaskFull {
  id: string
  title: string
  detail: string
  requiredWorkers: number
  payableAmount: number
  submissionInfo: string
  completionDate: string
  status: TaskStatus
  submissionsReceived: number
}

export interface WorkerSubmission {
  id: string
  taskId: string
  taskTitle: string
  workerName: string
  workerEmail: string
  submittedAt: string
  proofLink: string
  status: SubmissionStatus
}

export interface PaymentRecord {
  id: string
  type: PaymentType
  description: string
  amount: number
  coins: number
  date: string
}

export interface CoinPackage {
  id: string
  label: string
  coins: number
  price: number
}

export const WithdrawalStatus = {
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected',
} as const
export type WithdrawalStatus = (typeof WithdrawalStatus)[keyof typeof WithdrawalStatus]

export const PaymentSystem = {
  Stripe: 'Stripe',
  Bkash: 'Bkash',
  Rocket: 'Rocket',
  Nagad: 'Nagad',
  Other: 'Other',
} as const
export type PaymentSystem = (typeof PaymentSystem)[keyof typeof PaymentSystem]

export interface AvailableTask {
  id: string
  title: string
  detail: string
  buyerName: string
  buyerEmail: string
  requiredWorkers: number
  payableAmount: number
  submissionInfo: string
  completionDate: string
}

export interface WorkerOwnSubmission {
  id: string
  taskId: string
  taskTitle: string
  payableAmount: number
  buyerName: string
  submissionDetails: string
  submittedAt: string
  status: SubmissionStatus
}

export interface WithdrawalRecord {
  id: string
  workerEmail: string
  workerName: string
  withdrawalCoin: number
  withdrawalAmount: number
  paymentSystem: PaymentSystem
  accountNumber: string
  withdrawDate: string
  status: WithdrawalStatus
}

export interface AdminUser {
  id: string
  name: string
  email: string
  photoUrl: string
  role: Role
  coins: number
}

export interface AdminTask {
  id: string
  title: string
  buyerName: string
  buyerEmail: string
  requiredWorkers: number
  payableAmount: number
  completionDate: string
  status: TaskStatus
  submissionsReceived: number
}
