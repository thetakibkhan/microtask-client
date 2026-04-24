import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/providers/AuthProvider'
import { ArrowRight, UserPlus, MousePointerClick, Coins, Clock, Users, CheckCircle2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import type { TopEarner, FeaturedTask, Testimonial } from '@/types'

/* ── Hero ─────────────────────────────────────────────── */

const heroSlides = [
  {
    heading: 'Turn Your Spare Time Into Real Earnings',
    subtitle: 'Complete simple micro-tasks from anywhere in the world and get paid in coins instantly.',
    cta: 'Start Earning Now',
  },
  {
    heading: 'Scale Your Business With a Global Workforce',
    subtitle: 'Post tasks, set budgets, and get thousands of results in hours — not weeks.',
    cta: 'Post Your First Task',
  },
  {
    heading: 'Trusted by 120K+ Workers Worldwide',
    subtitle: 'Join the fastest-growing micro-task platform with verified payouts and transparent reviews.',
    cta: 'Join TaskOrbit Free',
  },
]

const Hero = () => (
  <section className="pt-20 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="w-full relative z-10"
    >
      {heroSlides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 text-balance"
            >
              {slide.heading}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
            >
              {slide.subtitle}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <Link to="/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold rounded-xl orbit-pulse transition-all duration-200">
                  {slide.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
)

/* ── Top Earners ──────────────────────────────────────── */

const topEarners: TopEarner[] = [
  { name: 'Ryan Mitchell', coins: 2840, img: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Marcus Johnson', coins: 2510, img: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Omar Hassan', coins: 2180, img: 'https://i.pravatar.cc/150?img=51' },
  { name: 'Carlos Méndez', coins: 1950, img: 'https://i.pravatar.cc/150?img=53' },
  { name: 'Yuki Tanaka', coins: 1720, img: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Jake Wilson', coins: 1580, img: 'https://i.pravatar.cc/150?img=57' },
]

const TopEarners = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">Top Earners</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Our highest-performing workers this month.</p>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {topEarners.map((w, i) => (
          <motion.div
            key={w.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className={`flex flex-col items-center p-5 bg-card rounded-2xl orbit-shadow card-hover text-center ${
              i >= 3 ? 'sm:translate-y-4' : ''
            }`}
          >
            <img src={w.img} alt={w.name} className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-primary/20 ring-2 ring-primary/5" />
            <p className="font-semibold text-foreground text-sm mb-1">{w.name}</p>
            <p className="text-sm text-success font-medium">🪙 {w.coins.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

/* ── How It Works ─────────────────────────────────────── */

const howSteps = [
  { icon: UserPlus, title: 'Sign Up', desc: 'Create your free account in under 30 seconds — no credit card required.' },
  { icon: MousePointerClick, title: 'Pick a Task', desc: 'Browse available micro-tasks and choose ones that match your skills.' },
  { icon: Coins, title: 'Earn Coins', desc: 'Complete tasks, get approved, and watch your coin balance grow instantly.' },
]

const HowItWorks = () => (
  <section className="py-20 px-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">How It Works</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Three simple steps to start earning.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {howSteps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className={`text-center p-7 rounded-2xl bg-card orbit-shadow card-hover ${
              i === 1 ? 'md:-translate-y-4' : ''
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
              <s.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

/* ── Animated Counter ─────────────────────────────────── */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        start = target
        clearInterval(timer)
      }
      setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])

  return <span ref={ref} className="tabular-nums">{count.toLocaleString()}{suffix}</span>
}

/* ── Platform Stats ───────────────────────────────────── */

const platformStats = [
  { label: 'Tasks Completed', value: 248000, suffix: '+', icon: CheckCircle2, accent: 'text-success bg-success/10' },
  { label: 'Active Workers', value: 12400, suffix: '+', icon: Users, accent: 'text-primary bg-primary/10' },
  { label: 'Total Coins Paid', value: 1850000, suffix: '+', icon: Coins, accent: 'text-warning bg-warning/10' },
  { label: 'Happy Buyers', value: 3200, suffix: '+', icon: Heart, accent: 'text-destructive bg-destructive/10' },
]

const PlatformStats = () => (
  <section className="py-20 px-6 border-y border-border bg-card/50">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {platformStats.map((s) => (
          <div key={s.label} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${s.accent} mb-4`}>
              <s.icon className="w-5 h-5" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </h3>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
)

/* ── Featured Tasks ───────────────────────────────────── */

const featuredTasks: FeaturedTask[] = [
  { title: 'Classify Product Images', buyer: 'ShopVision Inc.', coins: 45, workers: 120, deadline: 'Apr 10, 2026' },
  { title: 'Transcribe Interview Audio', buyer: 'MediaFlow Labs', coins: 80, workers: 50, deadline: 'Apr 5, 2026' },
  { title: 'Verify Business Listings', buyer: 'MapData Co.', coins: 30, workers: 200, deadline: 'Apr 12, 2026' },
  { title: 'Rate App Screenshots', buyer: 'AppReview Pro', coins: 25, workers: 300, deadline: 'Apr 8, 2026' },
]

const FeaturedTasks = () => (
  <section className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">Featured Tasks</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Browse high-paying tasks from verified buyers.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featuredTasks.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-5 bg-card rounded-2xl orbit-shadow card-hover flex flex-col"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-foreground">{t.title}</h4>
              <span className="text-warning font-bold text-sm whitespace-nowrap ml-2">🪙 {t.coins}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">by {t.buyer}</p>
            <div className="space-y-2 text-sm text-muted-foreground mb-5 flex-1">
              <div className="flex justify-between">
                <span>Workers needed</span>
                <span className="font-medium text-foreground">{t.workers}</span>
              </div>
              <div className="flex justify-between">
                <span>Deadline</span>
                <span className="font-medium text-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-warning" /> {t.deadline}
                </span>
              </div>
            </div>
            <Link to="/register">
              <Button variant="outline" size="sm" className="w-full rounded-lg border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
                View Details
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

/* ── Testimonials ─────────────────────────────────────── */

const testimonials: Testimonial[] = [
  { name: 'Ryan Mitchell', role: 'Worker', quote: 'I earn extra income every week doing simple tasks. TaskOrbit makes it effortless to get started.', img: 'https://i.pravatar.cc/150?img=11' },
  { name: 'David Kim', role: 'Buyer', quote: 'We processed 10,000 annotations in just 2 days. The quality and speed were beyond expectations.', img: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Omar Hassan', role: 'Worker', quote: 'Working from home and earning coins that I can withdraw anytime — it changed my daily routine.', img: 'https://i.pravatar.cc/150?img=51' },
  { name: 'James Carter', role: 'Buyer', quote: "TaskOrbit's workforce helped us validate thousands of data points overnight. Highly recommended.", img: 'https://i.pravatar.cc/150?img=60' },
  { name: 'Yuki Tanaka', role: 'Worker', quote: 'The platform is intuitive, payouts are fast, and there\'s always a new task waiting for me.', img: 'https://i.pravatar.cc/150?img=14' },
]

const Testimonials = () => (
  <section className="py-20 px-6 border-t border-border">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">What Our Users Say</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Real stories from workers and buyers on TaskOrbit.</p>
      </motion.div>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{ 768: { slidesPerView: 2 } }}
        className="pb-12"
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <div className="p-6 rounded-2xl bg-card orbit-shadow text-center card-hover">
              <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20 ring-2 ring-primary/5" />
              <p className="text-foreground mb-4 leading-relaxed text-[15px] italic">"{t.quote}"</p>
              <p className="font-semibold text-sm text-foreground">{t.name}</p>
              <p className="text-xs text-primary font-medium">{t.role}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
)

/* ── Page ─────────────────────────────────────────────── */

const roleDashboard = { worker: '/worker', buyer: '/buyer', admin: '/admin' } as const

const IndexPage = () => {
  const { user, role, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user && role) {
      void navigate({ to: roleDashboard[role] })
    }
  }, [user, role, loading, navigate])

  if (loading || (user && role)) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={false} />
      <Hero />
      <TopEarners />
      <HowItWorks />
      <PlatformStats />
      <FeaturedTasks />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default IndexPage
