import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, isConfigured } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isRecruiter: boolean
  roleSetupNeeded: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshRole: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isRecruiter: false,
  roleSetupNeeded: false,
  loading: true,
  signOut: async () => {},
  refreshRole: async () => {},
})

async function fetchUserRole(userId: string): Promise<{ isAdmin: boolean; isRecruiter: boolean; roleSetupNeeded: boolean }> {
  if (!isConfigured) return { isAdmin: false, isRecruiter: false, roleSetupNeeded: false }
  try {
    const snap = await getDoc(doc(db, 'users', userId))
    if (!snap.exists()) return { isAdmin: false, isRecruiter: false, roleSetupNeeded: true }
    const data = snap.data()
    const hasRole = !!data?.role || data?.is_admin === true
    return {
      isAdmin:         data?.is_admin === true,
      isRecruiter:     data?.role === 'recruiter' || data?.is_admin === true,
      roleSetupNeeded: !hasRole,
    }
  } catch {
    return { isAdmin: false, isRecruiter: false, roleSetupNeeded: false }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                     = useState<User | null>(null)
  const [isAdmin, setIsAdmin]               = useState(false)
  const [isRecruiter, setIsRecruiter]       = useState(false)
  const [roleSetupNeeded, setRoleSetupNeeded] = useState(false)
  const [loading, setLoading]               = useState(true)

  const applyRole = async (u: User) => {
    const { isAdmin, isRecruiter, roleSetupNeeded } = await fetchUserRole(u.uid)
    setIsAdmin(isAdmin)
    setIsRecruiter(isRecruiter)
    setRoleSetupNeeded(roleSetupNeeded)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        await applyRole(u)
      } else {
        setIsAdmin(false)
        setIsRecruiter(false)
        setRoleSetupNeeded(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const refreshRole = async () => {
    if (user) await applyRole(user)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setIsAdmin(false)
    setIsRecruiter(false)
    setRoleSetupNeeded(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isRecruiter, roleSetupNeeded, loading, signOut, refreshRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
