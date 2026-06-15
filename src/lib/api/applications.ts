import {
  collection, doc, getDoc, getDocs, addDoc, deleteDoc, query,
  where, orderBy,
} from 'firebase/firestore'
import { db, isConfigured } from '@/lib/firebase'
import { mockApplications } from '@/lib/mockData'
import type { Application, WorkMode } from '@/types'

const COMPANY_LOGO_MAP: Record<string, string> = {
  'Genpact': '/logos/genpact.svg', 'Capgemini': '/logos/capgemini.svg',
  'HDFC Life': '/logos/hdfc.svg', 'Hewlett Packard Enterprise': '/logos/hpe.svg',
  'Kotak Mahindra Bank': '/logos/kotak.svg', 'TCS': '/logos/tcs.svg',
  'Wipro': '/logos/wipro.svg', 'Infosys BPM': '/logos/infosys.svg',
  'LTIMindtree': '/logos/ltim.svg', 'Tech Mahindra': '/logos/techm.svg',
  'ICICI Bank': '/logos/icici.svg', 'Sopra Steria': '/logos/sopra.svg',
}

export async function fetchUserApplications(userId: string): Promise<Application[]> {
  if (!isConfigured) return mockApplications

  const q = query(
    collection(db, 'applications'),
    where('user_id', '==', userId),
    orderBy('applied_at', 'desc')
  )
  const snap = await getDocs(q)

  const applications: Application[] = []

  for (const appDoc of snap.docs) {
    const appData = appDoc.data()
    const driveSnap = await getDoc(doc(db, 'drives', appData.drive_id))
    if (!driveSnap.exists()) continue

    const drive = driveSnap.data()
    applications.push({
      id:         appDoc.id,
      user_id:    appData.user_id,
      status:     appData.status ?? 'applied',
      applied_at: appData.applied_at,
      drive: {
        id:              driveSnap.id,
        role:            drive.role,
        location:        drive.location,
        city:            drive.city,
        mode:            drive.mode as WorkMode,
        experience:      drive.experience,
        eligibility:     drive.eligibility ?? '',
        salary:          drive.salary ?? undefined,
        skills:          drive.skills ?? [],
        openings:        drive.openings ?? undefined,
        drive_date:      drive.drive_date,
        drive_time:      drive.drive_time,
        is_priority:     drive.is_priority,
        is_active:       drive.is_active,
        posted_days_ago: 0,
        created_at:      drive.created_at,
        company: {
          id:       drive.company_id,
          name:     drive.company_name,
          industry: drive.company_industry ?? undefined,
          verified: drive.company_verified,
          logo_url: COMPANY_LOGO_MAP[drive.company_name] ?? '',
        },
      },
    })
  }

  return applications
}

export async function applyToDrive(driveId: string, userId: string): Promise<void> {
  if (!isConfigured) return
  await addDoc(collection(db, 'applications'), {
    drive_id:   driveId,
    user_id:    userId,
    status:     'applied',
    applied_at: new Date().toISOString(),
  })
}

export async function withdrawApplication(applicationId: string): Promise<void> {
  if (!isConfigured) return
  await deleteDoc(doc(db, 'applications', applicationId))
}

export async function hasApplied(driveId: string, userId: string): Promise<boolean> {
  if (!isConfigured) return false
  const q = query(
    collection(db, 'applications'),
    where('drive_id', '==', driveId),
    where('user_id', '==', userId)
  )
  const snap = await getDocs(q)
  return !snap.empty
}
