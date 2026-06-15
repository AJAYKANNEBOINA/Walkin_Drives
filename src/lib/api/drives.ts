import {
  collection, doc, getDoc, getDocs, addDoc, query, where,
} from 'firebase/firestore'
import { db, isConfigured } from '@/lib/firebase'
import { auth } from '@/lib/firebase'
import { mockDrives } from '@/lib/mockData'
import type { Drive, WorkMode } from '@/types'

const COMPANY_LOGO_MAP: Record<string, string> = {
  'Genpact': '/logos/genpact.svg', 'Capgemini': '/logos/capgemini.svg',
  'HDFC Life': '/logos/hdfc.svg', 'Hewlett Packard Enterprise': '/logos/hpe.svg',
  'Kotak Mahindra Bank': '/logos/kotak.svg', 'TCS': '/logos/tcs.svg',
  'Wipro': '/logos/wipro.svg', 'Infosys BPM': '/logos/infosys.svg',
  'LTIMindtree': '/logos/ltim.svg', 'Tech Mahindra': '/logos/techm.svg',
  'ICICI Bank': '/logos/icici.svg', 'Sopra Steria': '/logos/sopra.svg',
}

// Firestore drive documents embed company data directly
interface FirestoreDrive {
  id: string
  role: string
  location: string
  city: string
  mode: string
  experience: string
  eligibility: string | null
  salary: string | null
  skills: string[] | null
  openings: number | null
  drive_date: string
  drive_time: string
  description: string | null
  status: string
  is_active: boolean
  is_priority: boolean
  contact_email: string | null
  posted_by: string | null
  created_at: string
  company_id: string
  company_name: string
  company_industry: string | null
  company_verified: boolean
  company_logo_url: string | null
}

function mapDrive(row: FirestoreDrive): Drive {
  const daysDiff = Math.floor(
    (Date.now() - new Date(row.created_at).getTime()) / 86_400_000
  )
  return {
    id:              row.id,
    role:            row.role,
    location:        row.location,
    city:            row.city,
    mode:            row.mode as WorkMode,
    experience:      row.experience,
    eligibility:     row.eligibility ?? '',
    salary:          row.salary ?? undefined,
    skills:          row.skills ?? [],
    openings:        row.openings ?? undefined,
    drive_date:      row.drive_date,
    drive_time:      row.drive_time,
    description:     row.description ?? undefined,
    is_priority:     row.is_priority,
    is_active:       row.is_active,
    posted_days_ago: daysDiff,
    created_at:      row.created_at,
    company: {
      id:       row.company_id,
      name:     row.company_name,
      industry: row.company_industry ?? undefined,
      verified: row.company_verified,
      logo_url: COMPANY_LOGO_MAP[row.company_name] ?? row.company_logo_url ?? '',
    },
  }
}

export interface DrivesFilter {
  query?:      string
  cities?:     string[]
  experience?: string
  mode?:       string
}

export async function fetchDrives(filter: DrivesFilter = {}): Promise<Drive[]> {
  if (!isConfigured) return mockDrives

  const today = new Date().toISOString().split('T')[0]

  // Fetch only approved drives — all other filtering is client-side to avoid composite index requirements
  const q = query(collection(db, 'drives'), where('status', '==', 'approved'))
  const snap = await getDocs(q)

  let drives = snap.docs
    .map(d => mapDrive({ id: d.id, ...d.data() } as FirestoreDrive))
    .filter(d => d.is_active && d.drive_date >= today)

  if (filter.cities?.length)  drives = drives.filter(d => filter.cities!.includes(d.city))
  if (filter.experience)      drives = drives.filter(d => d.experience === filter.experience)
  if (filter.mode)            drives = drives.filter(d => d.mode === filter.mode)
  if (filter.query) {
    const q = filter.query.toLowerCase()
    drives = drives.filter(d =>
      d.role.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)
    )
  }

  // Priority first, then by date
  drives.sort((a, b) => {
    if (b.is_priority !== a.is_priority) return (b.is_priority ? 1 : 0) - (a.is_priority ? 1 : 0)
    return a.drive_date.localeCompare(b.drive_date)
  })

  return drives
}

export async function fetchDriveById(id: string): Promise<Drive | null> {
  if (!isConfigured) return mockDrives.find(d => d.id === id) ?? null

  const snap = await getDoc(doc(db, 'drives', id))
  if (!snap.exists()) return null
  return mapDrive({ id: snap.id, ...snap.data() } as FirestoreDrive)
}

export interface PostDrivePayload {
  company:      string
  contactEmail: string
  role:         string
  location:     string
  city:         string
  experience:   string
  eligibility:  string
  salary:       string
  mode:         'Onsite' | 'Hybrid' | 'Remote'
  driveDate:    string
  driveTime:    string
  openings:     string
  description:  string
  skills:       string
}

export async function postDrive(payload: PostDrivePayload, userId: string): Promise<void> {
  if (!isConfigured) throw new Error('Firebase is not configured. Check your .env file.')
  if (!userId) throw new Error('You must be logged in to post a drive.')

  const user = auth.currentUser

  // Ensure user profile doc exists
  const { setDoc, doc: firestoreDoc } = await import('firebase/firestore')
  await setDoc(firestoreDoc(db, 'users', userId), {
    email:      user?.email ?? null,
    full_name:  user?.displayName ?? null,
    updated_at: new Date().toISOString(),
  }, { merge: true })

  // Find or create company
  const companiesSnap = await getDocs(
    query(collection(db, 'companies'), where('name_lower', '==', payload.company.toLowerCase()))
  )

  let companyId: string
  let companyVerified = false

  if (!companiesSnap.empty) {
    const existing = companiesSnap.docs[0]
    companyId = existing.id
    companyVerified = existing.data().verified ?? false
  } else {
    const ref = await addDoc(collection(db, 'companies'), {
      name:       payload.company,
      name_lower: payload.company.toLowerCase(),
      verified:   false,
      created_at: new Date().toISOString(),
    })
    companyId = ref.id
  }

  await addDoc(collection(db, 'drives'), {
    company_id:       companyId,
    company_name:     payload.company,
    company_industry: null,
    company_verified: companyVerified,
    company_logo_url: null,
    role:             payload.role,
    location:         payload.location,
    city:             payload.city,
    mode:             payload.mode,
    experience:       payload.experience,
    eligibility:      payload.eligibility || null,
    salary:           payload.salary || null,
    skills:           payload.skills ? payload.skills.split(',').map(s => s.trim()) : null,
    openings:         payload.openings ? parseInt(payload.openings) : null,
    drive_date:       payload.driveDate,
    drive_time:       payload.driveTime,
    description:      payload.description || null,
    contact_email:    payload.contactEmail,
    posted_by:        userId,
    status:           'pending',
    is_active:        false,
    is_priority:      false,
    created_at:       new Date().toISOString(),
  })
}
