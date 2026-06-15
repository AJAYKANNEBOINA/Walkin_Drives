import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users, BadgeCheck } from 'lucide-react'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import type { Drive } from '@/types'

interface DriveCardProps {
  drive: Drive
  compact?: boolean
}

export function DriveCard({ drive, compact = false }: DriveCardProps) {
  const today     = new Date().toISOString().split('T')[0]
  const isToday   = drive.drive_date === today
  const driveDate = new Date(drive.drive_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  const postedLabel = (() => {
    const diffMs = Date.now() - new Date(drive.created_at).getTime()
    const mins  = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMs / 3600000)
    const days  = Math.floor(diffMs / 86400000)
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days === 1) return '1d ago'
    return `${days}d ago`
  })()

  return (
    <Link to={`/drives/${drive.id}`} className="group block">
      <article className="relative bg-white rounded-xl border border-[oklch(0.905_0.01_255)] transition-all duration-200 hover:border-brand-blue/30 hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(99,102,241,0.06)] hover:-translate-y-px overflow-hidden">

        {/* Today indicator — thin top line */}
        {isToday && (
          <div className="absolute top-0 inset-x-0 h-[2px] bg-brand-blue" />
        )}

        <div className="p-5">
          {/* Company + role */}
          <div className="flex items-start gap-3.5">
            <CompanyLogo name={drive.company.name} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[15px] font-bold text-[oklch(0.13_0.04_264)] leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                  {drive.role}
                </h3>
                {drive.is_priority && (
                  <span className="shrink-0 text-[10px] font-bold text-brand-blue bg-brand-blue/8 ring-1 ring-brand-blue/15 rounded px-1.5 py-0.5">
                    Featured
                  </span>
                )}
              </div>

              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[oklch(0.50_0.022_258)]">
                <span>{drive.company.name}</span>
                {drive.company.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                )}
                <span className="text-[oklch(0.82_0.01_255)]">·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="h-3 w-3 shrink-0" />{drive.city}
                </span>
              </div>
            </div>

            {/* Salary — desktop only */}
            {drive.salary && (
              <div className="shrink-0 hidden sm:block text-right">
                <span className="text-sm font-bold text-[oklch(0.13_0.04_264)]">{drive.salary}</span>
                <p className="text-[10px] text-[oklch(0.60_0.018_258)] mt-0.5">per annum</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs text-[oklch(0.42_0.022_258)] font-medium">{drive.mode}</span>
            <span className="text-[oklch(0.82_0.01_255)]">·</span>
            <span className="text-xs text-[oklch(0.42_0.022_258)]">{drive.experience}</span>
            {drive.salary && (
              <><span className="text-[oklch(0.82_0.01_255)]">·</span>
              <span className="text-xs text-[oklch(0.42_0.022_258)] sm:hidden">{drive.salary}</span></>
            )}
            {drive.skills?.slice(0, 3).map(skill => (
              <span key={skill} className="text-xs text-[oklch(0.55_0.020_258)]">· {skill}</span>
            ))}
            {(drive.skills?.length ?? 0) > 3 && (
              <span className="text-xs text-[oklch(0.65_0.015_258)]">+{(drive.skills?.length ?? 0) - 3} more</span>
            )}
          </div>

          {/* Footer */}
          {!compact && (
            <div className="mt-4 pt-3.5 border-t border-[oklch(0.965_0.007_252)] flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 text-xs text-[oklch(0.50_0.022_258)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {isToday ? <span className="font-semibold text-brand-blue">Today</span> : driveDate}
                  {' · '}{drive.drive_time}
                </span>
                {drive.openings && (
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {drive.openings} openings
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[oklch(0.65_0.015_258)]">{postedLabel}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
