import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isConfigured } from '@/lib/firebase'
import type { DbProfile } from '@/lib/database.types'

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  if (!isConfigured) return null

  const snap = await getDoc(doc(db, 'users', userId))
  if (!snap.exists()) return null

  return { id: userId, ...snap.data() } as DbProfile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<DbProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  if (!isConfigured) return

  await setDoc(doc(db, 'users', userId), {
    ...updates,
    updated_at: new Date().toISOString(),
  }, { merge: true })
}

export async function saveJobAlert(
  userId: string,
  prefs: { city?: string; experience?: string; via_email: boolean; via_whatsapp: boolean }
): Promise<void> {
  if (!isConfigured) return

  await setDoc(doc(db, 'job_alerts', userId), {
    user_id: userId,
    ...prefs,
    updated_at: new Date().toISOString(),
  }, { merge: true })
}
