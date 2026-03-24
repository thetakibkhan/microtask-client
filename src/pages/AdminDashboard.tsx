import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Users, DollarSign, ClipboardList, Shield, Activity,
  ArrowUpRight, ExternalLink, CheckCircle2, XCircle, AlertTriangle, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import type { RecentUser, PendingWithdrawal, ActivityLogItem } from '@/types'

const adminStats = [
  { label: 'Total Users', value: '124,847', trend: '+2.4K this month', icon: Users, color: 'text-primary' },
  { label: 'Revenue (MTD)', value: '$48,290', trend: '+22.1%', icon: DollarSign, color: 'text-success' },
  { label: 'Active Tasks', value: '3,847', trend: '+340 today', icon: ClipboardList, color: 'text-warning' },
  { label: 'Platform Health', value: '99.9%', trend: 'All systems normal', icon: Shield, color: 'text-success' },
]

const revenueData = [
  { day: '1', rev: 1200 }, { day: '5', rev: 1800 }, { day: '10', rev: 2400 },
  { day: '15', rev: 3100 }, { day: '20', rev: 2800 }, { day: '25', rev: 3600 }, { day: '30', rev: 4800 },
]

const userBreakdown = [
  { name: 'Workers', value: 98420, color: 'hsl(239, 84%, 67%)' },
  { name: 'Buyers', value: 24180, color: 'hsl(142, 71%, 45%)' },
  { name: 'Admins', value: 47, color: 'hsl(38, 92%, 50%)' },
]

const recentUsers: RecentUser[] = [
  { name: 'Jake Wilson', email: 'jake@example.com', role: 'Worker', joined: '2h ago', status: 'Active' },
  { name: 'David Kim', email: 'david@scaleai.com', role: 'Buyer', joined: '4h ago', status: 'Active' },
  { name: 'Omar Hassan', email: 'omar@example.com', role: 'Worker', joined: '6h ago', status: 'Pending' },
  { name: 'James Chen', email: 'james@dataloop.io', role: 'Buyer', joined: '8h ago', status: 'Active' },
  { name: 'Carlos Martinez', email: 'carlos@example.com', role: 'Worker', joined: '12h ago', status: 'Suspended' },
]

const pendingWithdrawals: PendingWithdrawal[] = [
  { user: 'Ryan Mitchell', amount: '$1,200.00', method: 'PayPal', requested: 'Mar 17, 2026' },
  { user: 'Omar Hassan', amount: '$850.00', method: 'Bank Transfer', requested: 'Mar 17, 2026' },
  { user: 'Carlos Méndez', amount: '$340.00', method: 'Crypto (USDT)', requested: 'Mar 16, 2026' },
  { user: 'Yuki Tanaka', amount: '$2,100.00', method: 'Bank Transfer', requested: 'Mar 16, 2026' },
]

const activityLog: ActivityLogItem[] = [
  { action: 'User jake@example.com registered as Worker', time: '2h ago', type: 'info' },
  { action: 'Task #4892 flagged for review — unusual submission pattern', time: '3h ago', type: 'warning' },
  { action: 'Withdrawal of $1,200 approved for Ryan Mitchell', time: '4h ago', type: 'success' },
  { action: 'User carlos@example.com suspended — policy violation', time: '5h ago', type: 'error' },
  { action: 'New buyer David Kim deposited $499 (Scale package)', time: '6h ago', type: 'info' },
  { action: 'System maintenance completed — 0 downtime', time: '8h ago', type: 'success' },
]

const userStatusStyles: Record<string, string> = {
  Active: 'bg-success/15 text-success border border-success/20',
  Pending: 'bg-warning/15 text-warning border border-warning/20',
  Suspended: 'bg-destructive/15 text-destructive border border-destructive/20',
}

const activityTypeConfig: Record<ActivityLogItem['type'], { icon: React.ElementType; color: string }> = {
  info: { icon: Activity, color: 'text-primary' },
  warning: { icon: AlertTriangle, color: 'text-warning' },
  success: { icon: CheckCircle2, color: 'text-success' },
  error: { icon: XCircle, color: 'text-destructive' },
}

const AdminDashboardPage = () => (
  <DashboardLayout role="admin">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Console</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and management tools.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {adminStats.map((s) => (
          <div key={s.label} className="p-5 bg-card rounded-2xl orbit-shadow card-hover">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{s.value}</h3>
            <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${s.color}`}>
              <ArrowUpRight className="w-3 h-3" /> {s.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-1">Revenue (March 2026)</h3>
          <p className="text-xs text-muted-foreground mb-6">Daily platform revenue from task fees</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revenueData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 13%, 60%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 13%, 60%)' }} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(220, 20%, 18%)', background: 'hsl(221, 39%, 14%)', color: 'hsl(220, 20%, 91%)' }} />
              <Line type="monotone" dataKey="rev" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Breakdown */}
        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-4">User Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={userBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {userBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {userBreakdown.map((u) => (
              <div key={u.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: u.color }} />
                  <span className="text-muted-foreground">{u.name}</span>
                </div>
                <span className="font-semibold text-foreground tabular-nums">{u.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="p-6 bg-card rounded-2xl orbit-shadow mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Users</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary transition-all duration-200">
            Manage All <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left py-3 pr-4">User</th>
                <th className="text-left py-3 pr-4">Role</th>
                <th className="text-left py-3 pr-4">Joined</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-right py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.email} className="border-t border-border hover:bg-accent/50 transition-colors duration-200">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/15 text-primary font-semibold text-xs flex items-center justify-center">
                        {u.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{u.role}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{u.joined}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${userStatusStyles[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawals + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-4">Pending Withdrawals</h3>
          <div className="space-y-3">
            {pendingWithdrawals.map((w) => (
              <div key={w.user + w.amount} className="flex items-center justify-between p-3 rounded-xl bg-accent/50 border border-border transition-all duration-200 hover:border-primary/20">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{w.user}</p>
                  <p className="text-xs text-muted-foreground">{w.method} • {w.requested}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-bold text-success tabular-nums text-sm">{w.amount}</span>
                  <button className="p-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors duration-200">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-4">Activity Log</h3>
          <div className="space-y-3">
            {activityLog.map((a, i) => {
              const config = activityTypeConfig[a.type]
              const TypeIcon = config.icon
              return (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                  <div className={`mt-0.5 ${config.color}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground leading-snug">{a.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  </DashboardLayout>
)

export default AdminDashboardPage
