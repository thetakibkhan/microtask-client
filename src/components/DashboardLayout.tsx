import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Zap, Home, ListTodo, Upload, CreditCard, Users,
  ClipboardList, LogOut, Menu, X, Bell, Plus, History, UserCircle
} from 'lucide-react'
import type { Role, NavItem, AppNotification } from '@/types'
import NotificationPanel from '@/components/NotificationPanel'
import { useAuth } from '@/providers/AuthProvider'

const navItems: Record<Role, NavItem[]> = {
  worker: [
    { label: 'Home', icon: Home, path: '/worker' },
    { label: 'Task List', icon: ListTodo, path: '/worker' },
    { label: 'My Submissions', icon: Upload, path: '/worker' },
    { label: 'Withdrawals', icon: CreditCard, path: '/worker' },
  ],
  buyer: [
    { label: 'Home', icon: Home, path: '/buyer' },
    { label: 'Add New Tasks', icon: Plus, path: '/buyer' },
    { label: 'My Tasks', icon: ClipboardList, path: '/buyer' },
    { label: 'Purchase Coin', icon: CreditCard, path: '/buyer' },
    { label: 'Payment History', icon: History, path: '/buyer' },
  ],
  admin: [
    { label: 'Home', icon: Home, path: '/admin' },
    { label: 'Manage Users', icon: Users, path: '/admin' },
    { label: 'Manage Tasks', icon: ClipboardList, path: '/admin' },
  ],
}

const roleLabels: Record<Role, string> = { worker: 'Worker', buyer: 'Buyer', admin: 'Admin' }

const roleColors: Record<Role, string> = {
  worker: 'bg-success/15 text-success border border-success/20',
  buyer: 'bg-primary/15 text-primary border border-primary/20',
  admin: 'bg-destructive/15 text-destructive border border-destructive/20',
}

interface DashboardLayoutProps {
  role: Role
  children: React.ReactNode
  activeIndex?: number
  onNavigate?: (index: number) => void
  notifications?: AppNotification[]
  onMarkAllRead?: () => void
  coinBalance?: number
  userName?: string
}

const DashboardLayout = ({
  role,
  children,
  activeIndex,
  onNavigate,
  notifications = [],
  onMarkAllRead,
  coinBalance,
  userName = 'John Doe',
}: DashboardLayoutProps) => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [internalIdx, setInternalIdx] = useState(0)
  const [notifOpen, setNotifOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const activeIdx = activeIndex !== undefined ? activeIndex : internalIdx

  const handleNav = (i: number) => {
    if (onNavigate) {
      onNavigate(i)
    } else {
      setInternalIdx(i)
    }
    setSidebarOpen(false)
  }

  const items = navItems[role]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 h-16 bg-card/90 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-6 gap-4">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">TaskOrbit</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {coinBalance !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-sm font-semibold text-success">
              🪙 <span className="tabular-nums">{coinBalance.toLocaleString()}</span>
            </div>
          )}
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/30 ring-2 ring-primary/10 flex items-center justify-center bg-accent">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}>
            {roleLabels[role]}
          </span>
          <span className="hidden md:block text-sm font-medium text-foreground">{userName}</span>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-0.5 ring-2 ring-card">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <NotificationPanel
                notifications={notifications}
                onMarkAllRead={() => {
                  onMarkAllRead?.()
                  setNotifOpen(false)
                }}
                onClose={() => setNotifOpen(false)}
              />
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-auto h-screen lg:h-[calc(100vh-4rem)] w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="h-14 px-4 flex items-center justify-between border-b border-border lg:hidden">
            <span className="font-semibold text-foreground text-sm">Menu</span>
            <button
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {items.map((item, i) => (
              <button
                key={item.label}
                onClick={() => handleNav(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeIdx === i
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <button
              onClick={() => { void logout() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
