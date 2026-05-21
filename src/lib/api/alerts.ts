import { supabase } from '@/lib/supabase'

export interface JobAlert {
  id:         string
  user_id:    string
  email:      string
  cities:     string[]
  experience: string | null
  mode:       string | null
  keywords:   string[]
  is_active:  boolean
  created_at: string
}

export interface JobAlertPayload {
  email:      string
  cities:     string[]
  experience: string
  mode:       string
  keywords:   string[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export async function fetchMyAlert(userId: string): Promise<JobAlert | null> {
  const { data } = await supabase
    .from('job_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle()
  return data ?? null
}

export async function saveAlert(payload: JobAlertPayload, userId: string): Promise<void> {
  const { error } = await db.from('job_alerts').upsert(
    {
      user_id:    userId,
      email:      payload.email,
      cities:     payload.cities,
      experience: payload.experience || null,
      mode:       payload.mode       || null,
      keywords:   payload.keywords,
      is_active:  true,
    },
    { onConflict: 'user_id' }
  )
  if (error) throw new Error(error.message)
}

export async function deleteAlert(alertId: string): Promise<void> {
  const { error } = await db
    .from('job_alerts')
    .update({ is_active: false })
    .eq('id', alertId)
  if (error) throw new Error(error.message)
}

// ── Called after admin approves a drive ─────────────────────────────────────
export async function sendJobAlertEmails(driveId: string): Promise<void> {
  const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

  console.log('[alerts] sendJobAlertEmails called, driveId:', driveId)

  const res = await fetch(`${SUPABASE_URL}/functions/v1/notify-job-alerts`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ drive_id: driveId }),
  })

  const result = await res.json().catch(() => ({}))
  if (res.ok) {
    console.log(`✅ Job alert emails sent:`, result)
  } else {
    console.error('❌ Edge function error:', result)
  }
}

