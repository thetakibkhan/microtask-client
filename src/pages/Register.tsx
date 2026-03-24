import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Zap, ArrowRight, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type PublicRole = 'worker' | 'buyer'

const roleOptions: { key: PublicRole; icon: React.ElementType; label: string; desc: string }[] = [
  { key: 'worker', icon: Users, label: 'Worker', desc: 'Earn by completing tasks' },
  { key: 'buyer', icon: Briefcase, label: 'Buyer', desc: 'Post tasks and get results' },
]

const RegisterPage = () => {
  const [role, setRole] = useState<PublicRole>('worker')

  return (
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
              Start earning<br />in minutes.
            </h2>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Create your free account and start completing tasks immediately. No experience required.
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

          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Choose your role and get started for free.</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roleOptions.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === r.key ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <r.icon className={`w-5 h-5 mb-2 ${role === r.key ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-semibold text-sm text-foreground">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first">First name</Label>
                <Input id="first" placeholder="John" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last">Last name</Label>
                <Input id="last" placeholder="Doe" className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input id="reg-email" type="email" placeholder="you@example.com" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <Input id="reg-password" type="password" placeholder="Min 8 characters" className="h-11 rounded-xl" />
            </div>
            <Link to={role === 'worker' ? '/worker' : '/buyer'}>
              <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2">
                Create Account <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing up, you agree to our{' '}
            <a href="#" className="underline">Terms</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
