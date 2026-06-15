import {
  collection, doc, getDocs, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
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

export async function fetchAdminDrives(status?: DriveStatus): Promise<AdminDrive[]> {
  // Fetch all drives, filter + sort client-side to avoid composite index requirement
  const snap = await getDocs(collection(db, 'drives'))

  return snap.docs
    .map(d => {
    const data = d.data()
    return {
      id:            d.id,
      role:          data.role,
      location:      data.location,
      city:          data.city,
      experience:    data.experience,
      salary:        data.salary ?? null,
      mode:          data.mode,
      drive_date:    data.drive_date,
      drive_time:    data.drive_time,
      status:        data.status,
      is_active:     data.is_active,
      is_priority:   data.is_priority,
      contact_email: data.contact_email ?? null,
      posted_by:     data.posted_by ?? null,
      created_at:    data.created_at,
      openings:      data.openings ?? null,
      description:   data.description ?? null,
      skills:        data.skills ?? null,
      company: {
        id:       data.company_id,
        name:     data.company_name,
        industry: data.company_industry ?? null,
      },
    } as AdminDrive
    })
    .filter(d => !status || d.status === status)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function approveDrive(id: string): Promise<void> {
  await updateDoc(doc(db, 'drives', id), { status: 'approved', is_active: true })

  sendJobAlertEmails(id).catch(err =>
    console.error('sendJobAlertEmails failed:', err)
  )
}

export async function rejectDrive(id: string): Promise<void> {
  await updateDoc(doc(db, 'drives', id), { status: 'rejected', is_active: false })
}

export async function deleteDrive(id: string): Promise<void> {
  await deleteDoc(doc(db, 'drives', id))
}

export async function fetchAdminStats() {
  const snap = await getDocs(collection(db, 'drives'))
  const today = new Date().toISOString().split('T')[0]
  const rows = snap.docs.map(d => d.data() as { status: string; is_active: boolean; drive_date: string })

  return {
    pending:  rows.filter(r => r.status === 'pending').length,
    approved: rows.filter(r => r.status === 'approved').length,
    rejected: rows.filter(r => r.status === 'rejected').length,
    expired:  rows.filter(r => r.drive_date < today).length,
    total:    rows.length,
  }
}
