import { supabase, isConfigured } from '@/lib/supabase'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any
import { mockApplications } from '@/lib/mockData'
import type { Application } from '@/types'
import type { ApplicationWithDrive } from '@/lib/database.types'

const COMPANY_LOGO_MAP: Record<string, string> = {
  'Genpact': '/logos/genpact.svg', 'Capgemini': '/logos/capgemini.svg',
  'HDFC Life': '/logos/hdfc.svg', 'Hewlett Packard Enterprise': '/logos/hpe.svg',
  'Kotak Mahindra Bank': '/logos/kotak.svg', 'TCS': '/logos/tcs.svg',
  'Wipro': '/logos/wipro.svg', 'Infosys BPM': '/logos/infosys.svg',
  'LTIMindtree': '/logos/ltim.svg', 'Tech Mahindra': '/logos/techm.svg',
  'ICICI Bank': '/logos/icici.svg', 'Sopra Steria': '/logos/sopra.svg',
}

function mapApplication(row: ApplicationWithDrive): Application {
  return {
    id:         row.id,
    user_id:    row.user_id,
    status:     row.status,
    applied_at: row.applied_at,
    drive: {
      id:              row.drive.id,
      role:            row.drive.role,
      location:        row.drive.location,
      city:            row.drive.city,
      mode:            row.drive.mode,
      experience:      row.drive.experience,
      eligibility:     row.drive.eligibility ?? '',
      salary:          row.drive.salary ?? undefined,
      skills:          row.drive.skills ?? [],
      openings:        row.drive.openings ?? undefined,
      drive_date:      row.drive.drive_date,
      drive_time:      row.drive.drive_time,
      is_priority:     row.drive.is_priority,
      is_active:       row.drive.is_active,
      posted_days_ago: 0,
      created_at:      row.drive.created_at,
      company: {
        id:       row.drive.company.id,
        name:     row.drive.company.name,
        industry: row.drive.company.industry ?? undefined,
        verified: row.drive.company.verified,
        logo_url: COMPANY_LOGO_MAP[row.drive.company.name] ?? '',
      },
    },
  }
}

export async function fetchUserApplications(userId: string): Promise<Application[]> {
  if (!isConfigured) return mockApplications

  const { data, error } = await supabase
    .from('applications')
    .select('*, drive:drives(*, company:companies(*))')
    .eq('user_id', userId)
    .order('applied_at', { ascending: false })

  if (error) throw error
  return (data as ApplicationWithDrive[]).map(mapApplication)
}

export async function applyToDrive(driveId: string, userId: string): Promise<void> {
  if (!isConfigured) return

  const { error } = await db
    .from('applications')
    .insert({ drive_id: driveId, user_id: userId })

  if (error) throw error
}

export async function withdrawApplication(applicationId: string): Promise<void> {
  if (!isConfigured) return

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId)

  if (error) throw error
}

export async function hasApplied(driveId: string, userId: string): Promise<boolean> {
  if (!isConfigured) return false

  const { data } = await supabase
    .from('applications')
    .select('id')
    .eq('drive_id', driveId)
    .eq('user_id', userId)
    .maybeSingle()

  return !!data
}
