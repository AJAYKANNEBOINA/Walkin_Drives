import {
  collection, doc, getDocs, updateDoc, query, where, orderBy, getDoc,
} from 'firebase/firestore'
import emailjs from '@emailjs/browser'
import { db, isConfigured } from '@/lib/firebase'

export interface Applicant {
  id: string
  drive_id: string
  user_id: string
  name: string
  email: string
  phone: string
  experience: string
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected'
  applied_at: string
}

export interface RecruiterDrive {
  id: string
  role: string
  company_name: string
  city: string
  drive_date: string
  drive_time: string
  status: string
  openings: number | null
  created_at: string
  applicant_count?: number
}

export async function fetchRecruiterDrives(userId: string): Promise<RecruiterDrive[]> {
  if (!isConfigured) return []
  const q = query(collection(db, 'drives'), where('posted_by', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({
    id:           d.id,
    role:         d.data().role,
    company_name: d.data().company_name,
    city:         d.data().city,
    drive_date:   d.data().drive_date,
    drive_time:   d.data().drive_time,
    status:       d.data().status,
    openings:     d.data().openings ?? null,
    created_at:   d.data().created_at,
  })).sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function fetchDriveApplicants(driveId: string): Promise<Applicant[]> {
  if (!isConfigured) return []
  const q = query(
    collection(db, 'applications'),
    where('drive_id', '==', driveId),
    orderBy('applied_at', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({
    id:         d.id,
    drive_id:   d.data().drive_id,
    user_id:    d.data().user_id,
    name:       d.data().applicant_name   ?? 'Unknown',
    email:      d.data().applicant_email  ?? '',
    phone:      d.data().applicant_phone  ?? '',
    experience: d.data().applicant_experience ?? '',
    status:     d.data().status ?? 'applied',
    applied_at: d.data().applied_at,
  }))
}

export async function updateApplicantStatus(
  applicationId: string,
  status: 'shortlisted' | 'rejected' | 'selected',
  applicant: Pick<Applicant, 'name' | 'email'>,
  drive: Pick<RecruiterDrive, 'role' | 'company_name' | 'drive_date' | 'drive_time' | 'city'>
): Promise<void> {
  if (!isConfigured) return
  await updateDoc(doc(db, 'applications', applicationId), { status })

  if (status === 'shortlisted' || status === 'selected') {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_SHORTLIST_TEMPLATE_ID,
      {
        to_name:      applicant.name,
        to_email:     applicant.email,
        role:         drive.role,
        company_name: drive.company_name,
        drive_date:   drive.drive_date,
        drive_time:   drive.drive_time,
        venue:        drive.city,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
  }
}

export async function notifyHROnApplication(
  contactEmail: string,
  applicantName: string,
  role: string,
  companyName: string
): Promise<void> {
  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_HR_NOTIFY_TEMPLATE_ID,
      {
        to_email:       contactEmail,
        applicant_name: applicantName,
        role,
        company_name:   companyName,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
  } catch {
    // Non-blocking — don't fail apply if email fails
  }
}
