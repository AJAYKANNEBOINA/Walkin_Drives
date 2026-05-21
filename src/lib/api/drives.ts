import { supabase } from '@/lib/supabase'
import { mockDrives } from '@/lib/mockData'
import { isConfigured } from '@/lib/supabase'
import type { Drive } from '@/types'
import type { DriveWithCompany } from '@/lib/database.types'

const COMPANY_LOGO_MAP: Record<string, string> = {
  'Genpact': '/logos/genpact.svg', 'Capgemini': '/logos/capgemini.svg',
  'HDFC Life': '/logos/hdfc.svg', 'Hewlett Packard Enterprise': '/logos/hpe.svg',
  'Kotak Mahindra Bank': '/logos/kotak.svg', 'TCS': '/logos/tcs.svg',
  'Wipro': '/logos/wipro.svg', 'Infosys BPM': '/logos/infosys.svg',
  'LTIMindtree': '/logos/ltim.svg', 'Tech Mahindra': '/logos/techm.svg',
  'ICICI Bank': '/logos/icici.svg', 'Sopra Steria': '/logos/sopra.svg',
}

function mapDrive(row: DriveWithCompany): Drive {
  const daysDiff = Math.floor(
    (Date.now() - new Date(row.created_at).getTime()) / 86_400_000
  )
  return {
    id:              row.id,
    role:            row.role,
    location:        row.location,
    city:            row.city,
    mode:            row.mode,
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
      id:       row.company.id,
      name:     row.company.name,
      industry: row.company.industry ?? undefined,
      verified: row.company.verified,
      logo_url: COMPANY_LOGO_MAP[row.company.name] ?? row.company.logo_url ?? '',
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

  let q = supabase
    .from('drives')
    .select('*, company:companies(*)')
    .eq('status', 'approved')
    .eq('is_active', true)
    .gte('drive_date', today)
    .order('is_priority', { ascending: false })
    .order('drive_date', { ascending: true })

  if (filter.cities?.length)     q = q.in('city', filter.cities)
  if (filter.experience)         q = q.eq('experience', filter.experience)
  if (filter.mode)               q = q.eq('mode', filter.mode)
  if (filter.query) {
    q = q.or(`role.ilike.%${filter.query}%,city.ilike.%${filter.query}%`)
  }

  const { data, error } = await q
  if (error) throw error
  return (data as DriveWithCompany[]).map(mapDrive)
}

export async function fetchDriveById(id: string): Promise<Drive | null> {
  if (!isConfigured) return mockDrives.find(d => d.id === id) ?? null

  const { data, error } = await supabase
    .from('drives')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single()

  if (error) return null
  return mapDrive(data as DriveWithCompany)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export async function postDrive(payload: PostDrivePayload, userId: string): Promise<void> {
  if (!isConfigured) throw new Error('Supabase is not configured. Check your .env file.')
  if (!userId) throw new Error('You must be logged in to post a drive.')

  // Ensure profile exists for this user (in case trigger didn't fire)
  const { data: { user } } = await supabase.auth.getUser()
  await db.from('profiles').upsert({
    id:        userId,
    email:     user?.email ?? null,
    full_name: user?.user_metadata?.full_name ?? null,
  }, { onConflict: 'id' })

  // Try to find existing company first, then insert if not found
  let companyId: string

  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .ilike('name', payload.company)
    .maybeSingle()

  if (existing) {
    companyId = existing.id
  } else {
    const { data: newCompany, error: cErr } = await db
      .from('companies')
      .insert({ name: payload.company, verified: false })
      .select('id')
      .single()
    if (cErr) throw new Error(`Company error: ${cErr.message}`)
    companyId = newCompany.id
  }

  const { error } = await db.from('drives').insert({
    company_id:    companyId,
    role:          payload.role,
    location:      payload.location,
    city:          payload.city,
    mode:          payload.mode,
    experience:    payload.experience,
    eligibility:   payload.eligibility || null,
    salary:        payload.salary || null,
    skills:        payload.skills ? payload.skills.split(',').map(s => s.trim()) : null,
    openings:      payload.openings ? parseInt(payload.openings) : null,
    drive_date:    payload.driveDate,
    drive_time:    payload.driveTime,
    description:   payload.description || null,
    contact_email: payload.contactEmail,
    posted_by:     userId,
    status:        'pending',
    is_active:     false,
    is_priority:   false,
  })

  if (error) throw new Error(`Drive error: ${error.message}`)
}
