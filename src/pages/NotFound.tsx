import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6">
      <Zap className="w-8 h-8 text-primary-foreground" />
    </div>
    <h1 className="text-6xl font-bold tracking-tighter text-foreground mb-4">404</h1>
    <p className="text-xl text-muted-foreground mb-8 max-w-md">
      This page doesn't exist or has been moved.
    </p>
    <Link to="/">
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">
        Back to Home
      </Button>
    </Link>
  </div>
)

export default NotFoundPage
