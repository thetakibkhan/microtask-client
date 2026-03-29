import { motion } from 'framer-motion'
import { ShoppingCart, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { PaymentType } from '@/types'
import type { PaymentRecord } from '@/types'

interface PaymentHistoryProps {
  payments: PaymentRecord[]
}

const typeStyles: Record<PaymentType, string> = {
  [PaymentType.Purchase]: 'bg-primary/15 text-primary border border-primary/20',
  [PaymentType.Refund]: 'bg-success/15 text-success border border-success/20',
  [PaymentType.TaskPayment]: 'bg-warning/15 text-warning border border-warning/20',
}

const typeLabel: Record<PaymentType, string> = {
  [PaymentType.Purchase]: 'Purchase',
  [PaymentType.Refund]: 'Refund',
  [PaymentType.TaskPayment]: 'Task',
}

const TypeIcon = ({ type }: { type: PaymentType }) => {
  if (type === PaymentType.Purchase) return <ShoppingCart className="w-4 h-4" />
  if (type === PaymentType.Refund) return <ArrowDownCircle className="w-4 h-4" />
  return <ArrowUpCircle className="w-4 h-4" />
}

const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  const sorted = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Payment History</h1>
      <p className="text-sm text-muted-foreground mb-8">All coin purchases, task costs, and refunds.</p>

      <div className="bg-card rounded-2xl orbit-shadow overflow-hidden">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No payment records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-xs text-muted-foreground font-medium">
                  <th className="text-left px-6 py-4">Type</th>
                  <th className="text-left px-6 py-4">Description</th>
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-right px-6 py-4">Amount</th>
                  <th className="text-right px-6 py-4">Coins</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${typeStyles[p.type]}`}>
                        <TypeIcon type={p.type} />
                        {typeLabel[p.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{p.description}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{p.date}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold tabular-nums">
                      {p.amount > 0 ? (
                        <span className="text-foreground">${p.amount}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-semibold tabular-nums">
                      <span className={p.coins > 0 ? 'text-success' : 'text-destructive'}>
                        {p.coins > 0 ? '+' : ''}{p.coins} 🪙
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PaymentHistory
