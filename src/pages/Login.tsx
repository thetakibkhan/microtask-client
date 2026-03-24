import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const LoginPage = () => (
  <div className="min-h-screen bg-background flex">
    {/* Left panel */}
    <div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-success/10" />
      <div className="relative z-10 flex flex-col justify-between p-12 w-full">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          TaskOrbit
        </Link>
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Precision work,<br />delivered at scale.
          </h2>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Join 120,000+ workers earning real money by completing micro-tasks from the world's leading companies.
          </p>
        </div>
        <p className="text-muted-foreground/50 text-sm">© 2026 TaskOrbit Inc.</p>
      </div>
    </div>

    {/* Right panel */}
    <div className="flex-1 flex items-center justify-center p-6 md:p-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="lg:hidden flex items-center gap-2 font-bold text-xl tracking-tight text-foreground mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          TaskOrbit
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-8">Enter your credentials to access your account.</p>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="h-11 rounded-xl bg-accent border-border/60" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <Input id="password" type="password" placeholder="••••••••" className="h-11 rounded-xl bg-accent border-border/60" />
          </div>
          <Link to="/worker">
            <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2">
              Sign In <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11 rounded-xl font-medium">Google</Button>
          <Button variant="outline" className="h-11 rounded-xl font-medium">GitHub</Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  </div>
)

export default LoginPage
