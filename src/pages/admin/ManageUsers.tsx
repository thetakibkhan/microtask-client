import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import type { AdminUser, Role } from '@/types'

interface ManageUsersProps {
  users: AdminUser[]
  onRoleChange: (userId: string, newRole: Role) => void
  onRemove: (userId: string) => void
}

const roleOptions: Role[] = ['worker', 'buyer', 'admin']

const roleStyles: Record<Role, string> = {
  worker: 'bg-primary/15 text-primary border border-primary/20',
  buyer: 'bg-success/15 text-success border border-success/20',
  admin: 'bg-destructive/15 text-destructive border border-destructive/20',
}

const ManageUsers = ({ users, onRoleChange, onRemove }: ManageUsersProps) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
    <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">Manage Users</h1>
    <p className="text-sm text-muted-foreground mb-8">View all users, change roles, or remove accounts.</p>

    <div className="bg-card rounded-2xl orbit-shadow overflow-hidden">
      {users.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left px-6 py-4">User</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Coins</th>
                <th className="text-left px-6 py-4">Update Role</th>
                <th className="text-right px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border hover:bg-accent/40 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.photoUrl}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-border"
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleStyles[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground tabular-nums">
                    🪙 {u.coins}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => onRoleChange(u.id, e.target.value as Role)}
                      className="h-8 rounded-lg border border-border bg-background text-foreground text-xs px-2 focus:outline-none focus:ring-2 focus:ring-primary/40 capitalize"
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r} className="capitalize">{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRemove(u.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 text-xs font-medium transition-colors duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
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

export default ManageUsers
