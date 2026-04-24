import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Zap, Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  isLoggedIn?: boolean
  coinBalance?: number
  userAvatar?: string
}

const Navbar = ({ isLoggedIn = false, coinBalance = 150, userAvatar }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-background/85 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-foreground group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          TaskOrbit
        </Link>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/worker">
                <Button variant="ghost" size="sm" className="transition-all duration-200">Dashboard</Button>
              </Link>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20 text-sm font-semibold text-success">
                🪙 <span className="tabular-nums">{coinBalance.toLocaleString()}</span>
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/30 ring-2 ring-primary/10 transition-all duration-200 hover:ring-primary/30">
                <img
                  src={userAvatar ?? 'https://i.pravatar.cc/150?img=12'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive transition-all duration-200">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="transition-all duration-200">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground transition-transform duration-200 active:scale-90"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          {isLoggedIn ? (
            <>
              <Link to="/worker" className="block" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
                  <img src={userAvatar ?? 'https://i.pravatar.cc/150?img=12'} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-semibold text-success">🪙 {coinBalance.toLocaleString()}</span>
              </div>
              <Link to="/" className="block" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="block" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">Login</Button>
              </Link>
              <Link to="/register" className="block" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Register</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
