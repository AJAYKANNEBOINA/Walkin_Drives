import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, isConfigured } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
})

async function fetchIsAdmin(userId: string): Promise<boolean> {
  if (!isConfigured) return false
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    return snap.exists() && snap.data()?.is_admin === true
  } catch (err) {
    console.error('[fetchIsAdmin] error:', err)
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const admin = await fetchIsAdmin(u.uid)
        setIsAdmin(admin)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
