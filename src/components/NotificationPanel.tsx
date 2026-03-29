import { useEffect, useRef } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import type { AppNotification } from '@/types'

interface NotificationPanelProps {
  notifications: AppNotification[]
  onMarkAllRead: () => void
  onClose: () => void
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

const NotificationPanel = ({ notifications, onMarkAllRead, onClose }: NotificationPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside the panel
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const sorted = [...notifications].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-2xl orbit-shadow z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold border border-primary/20">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          sorted.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors duration-200 hover:bg-accent/40 ${
                !n.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{timeAgo(n.time)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default NotificationPanel
