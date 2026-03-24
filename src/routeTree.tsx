import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import IndexPage from '@/pages/Index'
import LoginPage from '@/pages/Login'
import RegisterPage from '@/pages/Register'
import WorkerDashboardPage from '@/pages/WorkerDashboard'
import BuyerDashboardPage from '@/pages/BuyerDashboard'
import AdminDashboardPage from '@/pages/AdminDashboard'
import NotFoundPage from '@/pages/NotFound'

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const workerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker',
  component: WorkerDashboardPage,
})

const buyerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buyer',
  component: BuyerDashboardPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  workerRoute,
  buyerRoute,
  adminRoute,
])
