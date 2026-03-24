import { motion } from 'framer-motion'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Plus, DollarSign, Users, ClipboardList, CheckCircle2,
  XCircle, ArrowUpRight, ExternalLink, CreditCard, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { BuyerTask, PendingSubmission, CreditPackage } from '@/types'

const buyerStats = [
  { label: 'Active Campaigns', value: '8', trend: '+2 this week', icon: ClipboardList, color: 'text-warning' },
  { label: 'Total Spent', value: '$4,280', trend: '+18.5%', icon: DollarSign, color: 'text-success' },
  { label: 'Submissions Received', value: '1,247', trend: '94% approved', icon: CheckCircle2, color: 'text-success' },
  { label: 'Active Workers', value: '342', trend: '+28 today', icon: Users, color: 'text-primary' },
]

const campaignData = [
  { name: 'Mon', tasks: 45 }, { name: 'Tue', tasks: 62 }, { name: 'Wed', tasks: 78 },
  { name: 'Thu', tasks: 54 }, { name: 'Fri', tasks: 91 }, { name: 'Sat', tasks: 38 }, { name: 'Sun', tasks: 25 },
]

const myTasks: BuyerTask[] = [
  { title: 'Image Classification — Vehicles', submissions: 245, approved: 230, reward: '$0.45', status: 'Active' },
  { title: 'Sentiment Analysis — App Store', submissions: 180, approved: 172, reward: '$0.80', status: 'Active' },
  { title: 'Data Entry — Business Contacts', submissions: 500, approved: 485, reward: '$0.60', status: 'Completed' },
  { title: 'Audio Labeling — Voice Commands', submissions: 89, approved: 82, reward: '$1.50', status: 'Active' },
  { title: 'Website Screenshot Verification', submissions: 120, approved: 115, reward: '$0.35', status: 'Paused' },
]

const pendingSubmissions: PendingSubmission[] = [
  { worker: 'Ryan M.', task: 'Image Classification', proof: 'screenshot_042.png', time: '5m ago' },
  { worker: 'Omar H.', task: 'Sentiment Analysis', proof: 'analysis_report.csv', time: '12m ago' },
  { worker: 'Yuki T.', task: 'Data Entry', proof: 'contacts_batch_18.xlsx', time: '28m ago' },
  { worker: 'Marcus J.', task: 'Audio Labeling', proof: 'audio_labels_89.json', time: '45m ago' },
]

const packages: CreditPackage[] = [
  { name: 'Starter', credits: '500', price: '$49', popular: false },
  { name: 'Growth', credits: '2,000', price: '$149', popular: true },
  { name: 'Scale', credits: '10,000', price: '$499', popular: false },
]

const taskStatusStyles: Record<string, string> = {
  Active: 'bg-success/15 text-success border border-success/20',
  Completed: 'bg-muted text-muted-foreground',
  Paused: 'bg-warning/15 text-warning border border-warning/20',
}

const BuyerDashboardPage = () => (
  <DashboardLayout role="buyer">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Buyer Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your campaigns and review submissions.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" /> Create Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {buyerStats.map((s) => (
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
        {/* Chart */}
        <div className="lg:col-span-2 p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-1">Submissions This Week</h3>
          <p className="text-xs text-muted-foreground mb-6">Daily submission volume across all campaigns</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={campaignData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 13%, 60%)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(220, 13%, 60%)' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(220, 20%, 18%)', background: 'hsl(221, 39%, 14%)', color: 'hsl(220, 20%, 91%)' }} />
              <Bar dataKey="tasks" fill="hsl(239, 84%, 67%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Task Form */}
        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-4">Quick Task</h3>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <Label className="text-xs">Task Title</Label>
              <Input placeholder="e.g., Image Classification" className="h-10 rounded-lg text-sm bg-accent border-border/60" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Instructions</Label>
              <Textarea placeholder="Describe what workers need to do..." className="rounded-lg text-sm resize-none bg-accent border-border/60" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Reward ($)</Label>
                <Input placeholder="0.45" className="h-10 rounded-lg text-sm bg-accent border-border/60" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Max Workers</Label>
                <Input placeholder="500" className="h-10 rounded-lg text-sm bg-accent border-border/60" />
              </div>
            </div>
            <Button className="w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-sm mt-1 transition-all duration-200">
              Create Task
            </Button>
          </form>
        </div>
      </div>

      {/* My Tasks */}
      <div className="p-6 bg-card rounded-2xl orbit-shadow mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">My Tasks</h3>
          <Button variant="ghost" size="sm" className="text-xs text-primary transition-all duration-200">
            View All <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left py-3 pr-4">Task</th>
                <th className="text-left py-3 pr-4">Submissions</th>
                <th className="text-left py-3 pr-4">Approved</th>
                <th className="text-left py-3 pr-4">Reward</th>
                <th className="text-right py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.map((t) => (
                <tr key={t.title} className="border-t border-border hover:bg-accent/50 transition-colors duration-200">
                  <td className="py-3 pr-4 text-sm font-medium text-foreground">{t.title}</td>
                  <td className="py-3 pr-4 text-sm text-foreground tabular-nums">{t.submissions}</td>
                  <td className="py-3 pr-4 text-sm text-foreground tabular-nums">{t.approved}</td>
                  <td className="py-3 pr-4 text-sm font-semibold text-success tabular-nums">{t.reward}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${taskStatusStyles[t.status]}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Reviews + Packages */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-4">Pending Reviews</h3>
          <div className="space-y-3">
            {pendingSubmissions.map((s) => (
              <div key={s.worker + s.time} className="flex items-center justify-between p-3 rounded-xl bg-accent/50 border border-border transition-all duration-200 hover:border-primary/20">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0">
                    {s.worker.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{s.task}</p>
                    <p className="text-xs text-muted-foreground">{s.worker} • {s.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button className="p-1.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors duration-200">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors duration-200">
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-accent text-muted-foreground hover:text-foreground transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-card rounded-2xl orbit-shadow">
          <h3 className="font-semibold text-foreground mb-4">Credit Packages</h3>
          <div className="space-y-3">
            {packages.map((p) => (
              <div key={p.name} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                p.popular ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{p.name}</p>
                    {p.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold border border-primary/20">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{p.credits} credits</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground tabular-nums">{p.price}</p>
                  <Button
                    size="sm"
                    variant={p.popular ? 'default' : 'outline'}
                    className={`mt-1 rounded-lg text-xs transition-all duration-200 ${
                      p.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border-border/60'
                    }`}
                  >
                    <CreditCard className="w-3 h-3 mr-1" /> Buy Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </DashboardLayout>
)

export default BuyerDashboardPage
