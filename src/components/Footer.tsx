import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'

const Footer = () => (
  <footer className="border-t border-border py-8 px-6 bg-card/30">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground group">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
          <Zap className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        TaskOrbit
      </Link>

      <p className="text-sm text-muted-foreground">© 2026 TaskOrbit Inc. All rights reserved.</p>

      <div className="flex items-center gap-5 text-sm text-muted-foreground">
        <a href="#" className="hover:text-primary transition-colors duration-200">Privacy</a>
        <a href="#" className="hover:text-primary transition-colors duration-200">Terms</a>
        <a href="#" className="hover:text-primary transition-colors duration-200">Support</a>
      </div>
    </div>
  </footer>
)

export default Footer
