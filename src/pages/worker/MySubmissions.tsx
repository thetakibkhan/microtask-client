import { useState } from 'react'
import { motion } from 'framer-motion'
import { SubmissionStatus } from '@/types'
import type { WorkerOwnSubmission } from '@/types'
import Pagination from '@/components/ui/Pagination'

interface MySubmissionsProps {
  submissions: WorkerOwnSubmission[]
}

const statusStyles: Record<string, string> = {
  [SubmissionStatus.Approved]: 'bg-success/15 text-success border border-success/20',
  [SubmissionStatus.Pending]: 'bg-warning/15 text-warning border border-warning/20',
  [SubmissionStatus.Rejected]: 'bg-destructive/15 text-destructive border border-destructive/20',
}

const statusLabel: Record<string, string> = {
  [SubmissionStatus.Approved]: 'Approved',
  [SubmissionStatus.Pending]: 'Pending',
  [SubmissionStatus.Rejected]: 'Rejected',
}

const PAGE_SIZE = 5

const MySubmissions = ({ submissions }: MySubmissionsProps) => {
  const [currentPage, setCurrentPage] = useState(1)

  const sorted = [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  )

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">My Submissions</h1>
      <p className="text-sm text-muted-foreground mb-8">
        All your submitted work and their current status.
        {sorted.length > 0 && (
          <span className="ml-2 text-foreground font-medium">({sorted.length} total)</span>
        )}
      </p>

      <div className="bg-card rounded-2xl orbit-shadow overflow-hidden">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No submissions yet. Browse tasks to get started!
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-xs text-muted-foreground font-medium">
                    <th className="text-left px-6 py-4">Task Title</th>
                    <th className="text-left px-6 py-4 hidden sm:table-cell">Buyer</th>
                    <th className="text-left px-6 py-4 hidden md:table-cell">Submitted</th>
                    <th className="text-left px-6 py-4">Payable</th>
                    <th className="text-right px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-border hover:bg-accent/40 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground max-w-[180px] truncate">
                        {s.taskTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                        {s.buyerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">
                        {new Date(s.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-success tabular-nums">
                        {s.payableAmount} coins
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[s.status]}`}
                        >
                          {statusLabel[s.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 pb-5 border-t border-border pt-4 flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-muted-foreground">
                Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, sorted.length)} of {sorted.length}
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default MySubmissions
