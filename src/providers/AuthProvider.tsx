import { createContext, useContext, useEffect, useRef, useState } from 'react'
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
import api from '@/lib/api'

const TOKEN_KEY = 'taskOrbit_token'

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

// Exchange Firebase token for server JWT, returns role from DB
async function exchangeToken(firebaseUser: User): Promise<Role> {
  const firebaseToken = await firebaseUser.getIdToken()
  const res = await api.post<{ token: string; role: Role }>('/api/auth', { firebaseToken })
  localStorage.setItem(TOKEN_KEY, res.data.token)
  return res.data.role
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const isRegistering = useRef(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser && !isRegistering.current) {
        try {
          const resolvedRole = await exchangeToken(currentUser)
          setRole(resolvedRole)
        } catch {
          setRole(null)
        }
      } else if (!currentUser) {
        localStorage.removeItem(TOKEN_KEY)
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
    isRegistering.current = true
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name, photoURL: photoURL ?? null })

    // Register user in MongoDB and get server JWT
    const firebaseToken = await result.user.getIdToken()
    const res = await api.post<{ token: string; role: Role }>('/api/users', {
      name,
      email,
      photoURL: photoURL ?? '',
      role,
      firebaseUID: result.user.uid,
      firebaseToken,
    })
    localStorage.setItem(TOKEN_KEY, res.data.token)
    setRole(res.data.role)
    setUser(result.user)
    isRegistering.current = false
    return result.user
  }

  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const resolvedRole = await exchangeToken(result.user)
    setRole(resolvedRole)
    return result.user
  }

  const loginWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)

    // Check if user already exists in DB
    try {
      const resolvedRole = await exchangeToken(result.user)
      setRole(resolvedRole)
    } catch {
      // First-time Google login — register as worker
      const firebaseToken = await result.user.getIdToken()
      const res = await api.post<{ token: string; role: Role }>('/api/users', {
        name: result.user.displayName ?? 'Google User',
        email: result.user.email,
        photoURL: result.user.photoURL ?? '',
        role: 'worker' as Role,
        firebaseUID: result.user.uid,
        firebaseToken,
      })
      localStorage.setItem(TOKEN_KEY, res.data.token)
      setRole(res.data.role)
    }

    return result.user
  }

  const logout = async (): Promise<void> => {
    await signOut(auth)
    localStorage.removeItem(TOKEN_KEY)
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
