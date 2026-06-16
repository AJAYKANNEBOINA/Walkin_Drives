import { describe, it, expect } from 'vitest'

// ── Posted time label logic from DriveCard ───────────────────────
function getPostedLabel(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime()
  const mins  = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days  = Math.floor(diffMs / 86400000)
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

describe('Posted Time Label', () => {

  it('shows minutes ago when less than 1 hour', () => {
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60000).toISOString()
    expect(getPostedLabel(thirtyMinsAgo)).toBe('30m ago')
  })

  it('shows hours ago when less than 24 hours', () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 3600000).toISOString()
    expect(getPostedLabel(fiveHoursAgo)).toBe('5h ago')
  })

  it('shows 1d ago when exactly 1 day', () => {
    const oneDayAgo = new Date(Date.now() - 1 * 86400000).toISOString()
    expect(getPostedLabel(oneDayAgo)).toBe('1d ago')
  })

  it('shows days ago for older posts', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString()
    expect(getPostedLabel(fiveDaysAgo)).toBe('5d ago')
  })
})
