import { describe, it, expect } from 'vitest'

// ── Matching logic extracted from alerts.ts ──────────────────────
function matchesAlert(alert: any, drive: any): boolean {
  if (alert.cities?.length > 0 && !alert.cities.includes(drive.city)) return false
  if (alert.experience && alert.experience !== drive.experience)        return false
  if (alert.mode       && alert.mode       !== drive.mode)              return false
  if (alert.keywords?.length > 0) {
    const text  = `${drive.role} ${drive.city}`.toLowerCase()
    const match = alert.keywords.some((kw: string) => text.includes(kw.toLowerCase()))
    if (!match) return false
  }
  return true
}

const mockDrive = {
  role:       'Java Developer',
  city:       'Bengaluru',
  experience: '3-5 years',
  mode:       'Onsite',
}

describe('Job Alert Matching Logic', () => {

  it('matches when all filters are empty (no filters set)', () => {
    const alert = { cities: [], experience: null, mode: null, keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })

  it('matches when city is correct', () => {
    const alert = { cities: ['Bengaluru'], experience: null, mode: null, keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })

  it('does NOT match when city is wrong', () => {
    const alert = { cities: ['Mumbai'], experience: null, mode: null, keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(false)
  })

  it('matches when experience is correct', () => {
    const alert = { cities: [], experience: '3-5 years', mode: null, keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })

  it('does NOT match when experience is wrong', () => {
    const alert = { cities: [], experience: '0-1 years', mode: null, keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(false)
  })

  it('matches when mode is correct', () => {
    const alert = { cities: [], experience: null, mode: 'Onsite', keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })

  it('does NOT match when mode is wrong', () => {
    const alert = { cities: [], experience: null, mode: 'Remote', keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(false)
  })

  it('matches when at least one keyword is found in role', () => {
    const alert = { cities: [], experience: null, mode: null, keywords: ['Java', 'Python'] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })

  it('does NOT match when no keyword is found', () => {
    const alert = { cities: [], experience: null, mode: null, keywords: ['React', 'Angular'] }
    expect(matchesAlert(alert, mockDrive)).toBe(false)
  })

  it('keyword match is case-insensitive', () => {
    const alert = { cities: [], experience: null, mode: null, keywords: ['java'] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })

  it('matches all filters together (AND logic)', () => {
    const alert = { cities: ['Bengaluru'], experience: '3-5 years', mode: 'Onsite', keywords: ['Java'] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })

  it('fails if one filter does not match (AND logic)', () => {
    const alert = { cities: ['Bengaluru'], experience: '3-5 years', mode: 'Remote', keywords: ['Java'] }
    expect(matchesAlert(alert, mockDrive)).toBe(false)
  })

  it('matches multiple cities (OR within cities)', () => {
    const alert = { cities: ['Mumbai', 'Bengaluru'], experience: null, mode: null, keywords: [] }
    expect(matchesAlert(alert, mockDrive)).toBe(true)
  })
})
