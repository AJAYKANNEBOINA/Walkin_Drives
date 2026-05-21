import { Link } from 'react-router-dom'
import { MapPin, Calendar, Clock, Users, ArrowRight } from 'lucide-react'
import { PriorityBadge, ModeBadge, SalaryBadge } from '@/components/ui/Badge'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import type { Drive } from '@/types'

interface DriveCardProps {
  drive: Drive
  compact?: boolean
}

export function DriveCard({ drive, compact = false }: DriveCardProps) {
  const salary = drive.salary ?? '₹ 4 – 9 LPA'
  const posted = drive.posted_days_ago ?? 1

  return (
    <Link to={`/drives/${drive.id}`} className="group block">
      <div className="rounded-2xl border border-border bg-card p-6 hover:border-brand-blue/40 hover:shadow-md transition">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex items-start gap-3">
            <CompanyLogo name={drive.company.name} />
            <div className="min-w-0">
              <h3 className="text-[17px] font-bold text-foreground leading-tight truncate group-hover:text-brand-blue transition-colors">
                {drive.role}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{drive.company.name}</p>
            </div>
          </div>
          {drive.is_priority && <PriorityBadge />}
        </div>

        {/* Location */}
        <div className="mt-4 flex items-center gap-1.5 text-sm text-foreground">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          {drive.location}
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <ModeBadge mode={drive.mode} />
          <SalaryBadge salary={salary} />
          <span className="rounded-full bg-secondary px-3 py-1 font-medium text-muted-foreground">
            {drive.experience}
          </span>
        </div>

        {!compact && (
          <>
            {/* Date & Time */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {new Date(drive.drive_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {drive.drive_time}
              </span>
              {drive.openings && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {drive.openings} openings
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Posted {posted === 0 ? 'today' : `${posted} day${posted === 1 ? '' : 's'} ago`}
              </p>
              <span className="flex items-center gap-1 text-xs font-semibold text-brand-blue opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                View Details <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
