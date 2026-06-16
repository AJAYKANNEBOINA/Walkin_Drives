import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, isConfigured } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isRecruiter: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isRecruiter: false,
  loading: true,
  signOut: async () => {},
})

async function fetchUserRole(userId: string): Promise<{ isAdmin: boolean; isRecruiter: boolean }> {
  if (!isConfigured) return { isAdmin: false, isRecruiter: false }
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    if (!snap.exists()) return { isAdmin: false, isRecruiter: false }
    const data = snap.data()
    return {
      isAdmin:     data?.is_admin === true,
      isRecruiter: data?.role === 'recruiter' || data?.is_admin === true,
    }
  } catch {
    return { isAdmin: false, isRecruiter: false }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]             = useState<User | null>(null)
  const [isAdmin, setIsAdmin]       = useState(false)
  const [isRecruiter, setIsRecruiter] = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const { isAdmin, isRecruiter } = await fetchUserRole(u.uid)
        setIsAdmin(isAdmin)
        setIsRecruiter(isRecruiter)
      } else {
        setIsAdmin(false)
        setIsRecruiter(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setIsAdmin(false)
    setIsRecruiter(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isRecruiter, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
