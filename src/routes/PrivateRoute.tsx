import { Navigate } from '@tanstack/react-router'
import { useAuth } from '@/providers/AuthProvider'
import type { Role } from '@/types'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRole?: Role
}

const roleDashboard: Record<Role, string> = {
  worker: '/worker',
  buyer: '/buyer',
  admin: '/admin',
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requiredRole && role && role !== requiredRole) {
    return <Navigate to={roleDashboard[role]} />
  }

  return <>{children}</>
}

export default PrivateRoute
