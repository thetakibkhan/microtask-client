import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import {
  DollarSign, Coins, TrendingUp, Clock, CheckCircle2, Upload,
  ArrowUpRight, ArrowDownRight, CreditCard, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { StatCard, RecentTask, Withdrawal } from '@/types'

const earningsData = [
  { month: 'Jan', amount: 420 }, { month: 'Feb', amount: 580 }, { month: 'Mar', amount: 710 },
  { month: 'Apr', amount: 650 }, { month: 'May', amount: 890 }, { month: 'Jun', amount: 1284 },
]

const statCards: StatCard[] = [
  { label: 'Available Balance', value: '$1,284.50', trend: '+12.3%', up: true, icon: DollarSign, glow: 'card-hover-success' },
  { label: 'Orbit Coins', value: '12,450', trend: 'Level 4', up: true, icon: Coins, glow: 'card-hover' },
  { label: 'Tasks Completed', value: '842', trend: '99.2% SR', up: true, icon: CheckCircle2, glow: 'card-hover' },
  { label: 'Pending Review', value: '$142.20', trend: '12 tasks', up: false, icon: Clock, glow: 'card-hover-warning' },
]

const recentTasks: RecentTask[] = [
  { title: 'Image Classification Batch #42', reward: '$0.45', status: 'Approved', time: '2 min ago' },
  { title: 'Sentiment Analysis — Product Reviews', reward: '$0.80', status: 'In Review', time: '15 min ago' },
  { title: 'Data Entry: Contact Verification', reward: '$0.60', status: 'Approved', time: '1h ago' },
  { title: 'Audio Transcription — Interview #18', reward: '$2.00', status: 'Approved', time: '2h ago' },
  { title: 'Website Usability Test', reward: '$1.20', status: 'Rejected', time: '3h ago' },
  { title: 'Survey: Consumer Preferences Q1', reward: '$0.30', status: 'In Review', time: '4h ago' },
]

const withdrawals: Withdrawal[] = [
  { method: 'PayPal', amount: '$250.00', date: 'Mar 15, 2026', status: 'Completed' },
  { method: 'Bank Transfer', amount: '$500.00', date: 'Mar 10, 2026', status: 'Completed' },
  { method: 'Crypto (USDT)', amount: '$150.00', date: 'Mar 5, 2026', status: 'Processing' },
]

const statusStyles: Record<string, string> = {
  Approved: 'bg-success/15 text-success border border-success/20',
  'In Review': 'bg-warning/15 text-warning border border-warning/20',
  Rejected: 'bg-destructive/15 text-destructive border border-destructive/20',
  Completed: 'bg-success/15 text-success border border-success/20',
  Processing: 'bg-primary/15 text-primary border border-primary/20',
}

const WorkerDashboardPage = () => (
  <DashboardLayout role="worker">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, John 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your earnings overview for this month.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={s.label} className={`p-5 bg-card rounded-2xl orbit-shadow card-hover ${s.glow} ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{s.value}</h3>
            <div className="flex items-center gap-1 mt-2">
              {s.up
                ? <ArrowUpRight className="w-3 h-3 text-success" />
                : <ArrowDownRight className="w-3 h-3 text-warning" />
              }
              <span className={`text-xs font-semibold ${s.up ? 'text-success' : 'text-warning'}`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 p-6 bg-card rounded-2xl orbit-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Earnings Overview</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your earnings over the last 6 months</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg text-xs border-border/60 transition-all duration-200">
              This Year
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={earningsData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 13%, 60%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 13%, 60%)' }} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(220, 20%, 18%)', background: 'hsl(221, 39%, 14%)', color: 'hsl(220, 20%, 91%)' }} />
              <Area type="monotone" dataKey="amount" stroke="hsl(142, 71%, 45%)" strokeWidth={2} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-11 transition-all duration-200">
              <Upload className="w-4 h-4 mr-2" /> Browse Tasks
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl h-11 border-border/60 hover:border-success/40 hover:bg-success/5 transition-all duration-200">
              <CreditCard className="w-4 h-4 mr-2" /> Withdraw Funds
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl h-11 border-border/60 transition-all duration-200">
              <TrendingUp className="w-4 h-4 mr-2" /> View Analytics
            </Button>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-accent/50 border border-border">
            <p className="text-xs font-medium text-foreground mb-1">Worker Level</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-primary rounded-full" />
              </div>
              <span className="text-xs font-bold text-primary tabular-nums">Lv. 4</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">2,550 XP to Level 5</p>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="p-6 bg-card rounded-2xl orbit-shadow mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Recent Submissions</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary transition-all duration-200">
            View All <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left py-3 pr-4">Task</th>
                <th className="text-left py-3 pr-4">Reward</th>
                <th className="text-left py-3 pr-4">Status</th>
                <th className="text-right py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((t) => (
                <tr key={t.title} className="border-t border-border hover:bg-accent/50 transition-colors duration-200">
                  <td className="py-3 pr-4 text-sm font-medium text-foreground">{t.title}</td>
                  <td className="py-3 pr-4 text-sm font-semibold text-success tabular-nums">{t.reward}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground text-right">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="p-6 bg-card rounded-2xl orbit-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Withdrawal History</h3>
          <Button size="sm" className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-xs transition-all duration-200">
            <CreditCard className="w-3 h-3 mr-1" /> New Withdrawal
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left py-3 pr-4">Method</th>
                <th className="text-left py-3 pr-4">Amount</th>
                <th className="text-left py-3 pr-4">Date</th>
                <th className="text-right py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.date} className="border-t border-border hover:bg-accent/50 transition-colors duration-200">
                  <td className="py-3 pr-4 text-sm font-medium text-foreground">{w.method}</td>
                  <td className="py-3 pr-4 text-sm font-semibold text-success tabular-nums">{w.amount}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground">{w.date}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[w.status]}`}>{w.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  </DashboardLayout>
)

export default WorkerDashboardPage
