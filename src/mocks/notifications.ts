import type { AppNotification } from '@/types'

// In production these emails come from auth. For mocks we use fixed values.
export const MOCK_WORKER_EMAIL = 'worker@example.com'
export const MOCK_BUYER_EMAIL = 'buyer@example.com'
export const MOCK_ADMIN_EMAIL = 'admin@example.com'

export const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    message: 'Your submission for "Image Classification — Vehicles" was approved by TechVision Inc. You earned 0.45 coins.',
    toEmail: MOCK_WORKER_EMAIL,
    actionRoute: '/worker',
    time: '2026-03-29T10:00:00Z',
    read: false,
  },
  {
    id: 'n2',
    message: 'Your submission for "Audio Labeling — Voice Commands" was rejected by VoiceAI Corp. Please review the task requirements.',
    toEmail: MOCK_WORKER_EMAIL,
    actionRoute: '/worker',
    time: '2026-03-28T15:30:00Z',
    read: false,
  },
  {
    id: 'n3',
    message: 'A new submission was received for your task "Sentiment Analysis — App Store Reviews" from Omar H.',
    toEmail: MOCK_BUYER_EMAIL,
    actionRoute: '/buyer',
    time: '2026-03-29T09:48:00Z',
    read: false,
  },
  {
    id: 'n4',
    message: 'Your withdrawal request of 200 coins ($10.00) via Bkash has been approved by Admin.',
    toEmail: MOCK_WORKER_EMAIL,
    actionRoute: '/worker',
    time: '2026-03-27T11:00:00Z',
    read: true,
  },
  {
    id: 'n5',
    message: 'A new submission was received for your task "Image Classification — Vehicles" from Ryan M.',
    toEmail: MOCK_BUYER_EMAIL,
    actionRoute: '/buyer',
    time: '2026-03-29T10:05:00Z',
    read: true,
  },
]

// Helper to build a notification message for common events
export function makeSubmissionApprovedNotification(
  taskTitle: string,
  buyerName: string,
  payableAmount: number,
  workerEmail: string,
): AppNotification {
  return {
    id: `n_${Date.now()}`,
    message: `Your submission for "${taskTitle}" was approved by ${buyerName}. You earned ${payableAmount} coins.`,
    toEmail: workerEmail,
    actionRoute: '/worker',
    time: new Date().toISOString(),
    read: false,
  }
}

export function makeSubmissionRejectedNotification(
  taskTitle: string,
  buyerName: string,
  workerEmail: string,
): AppNotification {
  return {
    id: `n_${Date.now()}`,
    message: `Your submission for "${taskTitle}" was rejected by ${buyerName}. Please review the task requirements.`,
    toEmail: workerEmail,
    actionRoute: '/worker',
    time: new Date().toISOString(),
    read: false,
  }
}

export function makeNewSubmissionNotification(
  taskTitle: string,
  workerName: string,
  buyerEmail: string,
): AppNotification {
  return {
    id: `n_${Date.now()}`,
    message: `A new submission was received for your task "${taskTitle}" from ${workerName}.`,
    toEmail: buyerEmail,
    actionRoute: '/buyer',
    time: new Date().toISOString(),
    read: false,
  }
}

export function makeWithdrawalApprovedNotification(
  coins: number,
  amount: number,
  paymentSystem: string,
  workerEmail: string,
): AppNotification {
  return {
    id: `n_${Date.now()}`,
    message: `Your withdrawal request of ${coins} coins ($${amount}) via ${paymentSystem} has been approved.`,
    toEmail: workerEmail,
    actionRoute: '/worker',
    time: new Date().toISOString(),
    read: false,
  }
}
