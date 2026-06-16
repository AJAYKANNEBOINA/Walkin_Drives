import { describe, it, expect } from 'vitest'
import type { Drive } from '@/types'

// ── Sorting logic extracted from Drives.tsx ──────────────────────
function applySorting(drives: Drive[], sort: string): Drive[] {
  const arr = [...drives]
  switch (sort) {
    case 'date':     return arr.sort((a, b) => a.drive_date.localeCompare(b.drive_date))
    case 'recent':   return arr.sort((a, b) => b.created_at.localeCompare(a.created_at))
    case 'salary':   return arr.sort((a, b) => (parseInt(b.salary?.replace(/\D/g,'')??'0')||0) - (parseInt(a.salary?.replace(/\D/g,'')??'0')||0))
    case 'company':  return arr.sort((a, b) => a.company.name.localeCompare(b.company.name))
    case 'openings': return arr.sort((a, b) => (b.openings ?? 0) - (a.openings ?? 0))
    default:         return arr
  }
}

const makeDrive = (overrides: Partial<Drive>): Drive => ({
  id: '1', role: 'Developer', city: 'Bengaluru', location: 'Bengaluru',
  experience: '1-3 years', mode: 'Onsite', eligibility: 'Any Graduate',
  drive_date: '2025-07-01', drive_time: '10:00 AM', is_priority: false,
  is_active: true, created_at: '2025-06-01T00:00:00Z', posted_days_ago: 1,
  company: { id: 'c1', name: 'Acme', verified: true },
  ...overrides,
})

const drives = [
  makeDrive({ id: '1', drive_date: '2025-07-10', created_at: '2025-06-01T00:00:00Z', salary: '3 LPA', openings: 5, company: { id: 'c1', name: 'Zebra Corp', verified: true } }),
  makeDrive({ id: '2', drive_date: '2025-07-05', created_at: '2025-06-03T00:00:00Z', salary: '8 LPA', openings: 2, company: { id: 'c2', name: 'Acme Inc', verified: true } }),
  makeDrive({ id: '3', drive_date: '2025-07-01', created_at: '2025-06-02T00:00:00Z', salary: '5 LPA', openings: 10, company: { id: 'c3', name: 'Mindtree', verified: true } }),
]

describe('Drive Sorting', () => {

  it('sorts by drive date ascending', () => {
    const sorted = applySorting(drives, 'date')
    expect(sorted[0].id).toBe('3')
    expect(sorted[2].id).toBe('1')
  })

  it('sorts by most recently posted', () => {
    const sorted = applySorting(drives, 'recent')
    expect(sorted[0].id).toBe('2')
    expect(sorted[2].id).toBe('1')
  })

  it('sorts by salary highest first', () => {
    const sorted = applySorting(drives, 'salary')
    expect(sorted[0].id).toBe('2') // 8 LPA
    expect(sorted[2].id).toBe('1') // 3 LPA
  })

  it('sorts by company name A–Z', () => {
    const sorted = applySorting(drives, 'company')
    expect(sorted[0].company.name).toBe('Acme Inc')
    expect(sorted[2].company.name).toBe('Zebra Corp')
  })

  it('sorts by most openings first', () => {
    const sorted = applySorting(drives, 'openings')
    expect(sorted[0].id).toBe('3') // 10 openings
    expect(sorted[2].id).toBe('2') // 2 openings
  })

  it('returns drives unchanged for unknown sort key', () => {
    const sorted = applySorting(drives, 'unknown')
    expect(sorted).toHaveLength(3)
  })
})

describe('Drive Expiry', () => {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const tomorrow  = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  it('identifies expired drive (past date)', () => {
    const drive = makeDrive({ drive_date: yesterday })
    expect(drive.drive_date < today).toBe(true)
  })

  it('identifies active drive (future date)', () => {
    const drive = makeDrive({ drive_date: tomorrow })
    expect(drive.drive_date >= today).toBe(true)
  })

  it('identifies today drive', () => {
    const drive = makeDrive({ drive_date: today })
    expect(drive.drive_date === today).toBe(true)
  })
})
