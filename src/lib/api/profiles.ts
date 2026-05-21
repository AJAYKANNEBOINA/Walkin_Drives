import { supabase, isConfigured } from '@/lib/supabase'
import type { DbProfile } from '@/lib/database.types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  if (!isConfigured) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as DbProfile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<DbProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  if (!isConfigured) return

  const { error } = await db
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw error
}

export async function saveJobAlert(
  userId: string,
  prefs: { city?: string; experience?: string; via_email: boolean; via_whatsapp: boolean }
): Promise<void> {
  if (!isConfigured) return

  const { error } = await db
    .from('job_alerts')
    .upsert({ user_id: userId, ...prefs }, { onConflict: 'user_id' })

  if (error) throw error
}
