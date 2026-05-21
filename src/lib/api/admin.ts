import { supabase } from '@/lib/supabase'
import { sendJobAlertEmails } from '@/lib/api/alerts'

export type DriveStatus = 'pending' | 'approved' | 'rejected'

export interface AdminDrive {
  id: string
  role: string
  location: string
  city: string
  experience: string
  salary: string | null
  mode: string
  drive_date: string
  drive_time: string
  status: DriveStatus
  is_active: boolean
  is_priority: boolean
  contact_email: string | null
  posted_by: string | null
  created_at: string
  openings: number | null
  description: string | null
  skills: string[] | null
  company: { id: string; name: string; industry: string | null }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export async function fetchAdminDrives(status?: DriveStatus): Promise<AdminDrive[]> {
  let q = db
    .from('drives')
    .select('*, company:companies(id, name, industry)')
    .order('created_at', { ascending: false })

  if (status) q = q.eq('status', status)

  const { data, error } = await q
  if (error) {
    console.error('fetchAdminDrives error:', error)
    throw error
  }
  return data as AdminDrive[]
}

export async function approveDrive(id: string): Promise<void> {
  const { error } = await db
    .from('drives')
    .update({ status: 'approved', is_active: true })
    .eq('id', id)
  if (error) throw error

  // Fire-and-forget: send email alerts to matching subscribers
  sendJobAlertEmails(id).catch((err) =>
    console.error('sendJobAlertEmails failed:', err)
  )
}

export async function rejectDrive(id: string): Promise<void> {
  const { error } = await db
    .from('drives')
    .update({ status: 'rejected', is_active: false })
    .eq('id', id)
  if (error) throw error
}

export async function deleteDrive(id: string): Promise<void> {
  const { error } = await db.from('drives').delete().eq('id', id)
  if (error) throw error
}

export async function fetchAdminStats() {
  const { data, error } = await db
    .from('drives')
    .select('status, is_active, drive_date')

  if (error) throw error

  const today = new Date().toISOString().split('T')[0]
  const rows = data as { status: string; is_active: boolean; drive_date: string }[]

  return {
    pending:  rows.filter(r => r.status === 'pending').length,
    approved: rows.filter(r => r.status === 'approved').length,
    rejected: rows.filter(r => r.status === 'rejected').length,
    expired:  rows.filter(r => r.drive_date < today).length,
    total:    rows.length,
  }
}
