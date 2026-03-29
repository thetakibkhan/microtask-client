import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '@/firebase/firebase.config'
import type { Role } from '@/types'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || undefined

function getRoleKey(uid: string) {
  return `taskOrbit_role_${uid}`
}

function resolveRole(uid: string, email: string | null): Role {
  const stored = localStorage.getItem(getRoleKey(uid)) as Role | null
  if (stored) return stored
  if (ADMIN_EMAIL && email === ADMIN_EMAIL) return 'admin'
  return 'worker'
}

interface AuthContextType {
  user: User | null
  role: Role | null
  loading: boolean
  registerWithEmail: (name: string, email: string, password: string, role: Role, photoURL?: string) => Promise<User>
  loginWithEmail: (email: string, password: string) => Promise<User>
  loginWithGoogle: () => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setRole(resolveRole(currentUser.uid, currentUser.email))
      } else {
        setRole(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const registerWithEmail = async (
    name: string,
    email: string,
    password: string,
    role: Role,
    photoURL?: string,
  ): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name, photoURL: photoURL ?? null })
    const resolvedRole: Role = ADMIN_EMAIL && email === ADMIN_EMAIL ? 'admin' : role
    localStorage.setItem(getRoleKey(result.user.uid), resolvedRole)
    setRole(resolvedRole)
    setUser(result.user)
    return result.user
  }

  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const resolvedRole = resolveRole(result.user.uid, result.user.email)
    setRole(resolvedRole)
    return result.user
  }

  const loginWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const resolvedRole = resolveRole(result.user.uid, result.user.email)
    // If no role stored yet (first Google login), default to worker
    if (!localStorage.getItem(getRoleKey(result.user.uid))) {
      localStorage.setItem(getRoleKey(result.user.uid), resolvedRole)
    }
    setRole(resolvedRole)
    return result.user
  }

  const logout = async (): Promise<void> => {
    await signOut(auth)
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, registerWithEmail, loginWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
