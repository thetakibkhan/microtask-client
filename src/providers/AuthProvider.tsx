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

interface AuthContextType {
  user: User | null
  loading: boolean
  registerWithEmail: (name: string, email: string, password: string) => Promise<User>
  loginWithEmail: (email: string, password: string) => Promise<User>
  loginWithGoogle: () => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const registerWithEmail = async (name: string, email: string, password: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    setUser(result.user)
    return result.user
  }

  const loginWithEmail = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const loginWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  }

  const logout = async (): Promise<void> => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, registerWithEmail, loginWithEmail, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
