interface BadgeProps {
  dot?: boolean
  children: React.ReactNode
  className?: string
  dotClassName?: string
}

export function Badge({ dot, children, className = '', dotClassName = 'bg-brand-blue' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClassName}`} />}
      {children}
    </span>
  )
}

export function PriorityBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-brand-blue/8 px-2 py-0.5 text-[10px] font-bold text-brand-blue ring-1 ring-brand-blue/15">
      Featured
    </span>
  )
}

export function ModeBadge({ mode }: { mode: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[oklch(0.965_0.007_252)] px-2 py-0.5 text-[11px] font-medium text-[oklch(0.42_0.022_258)] ring-1 ring-[oklch(0.905_0.01_255)]">
      {mode}
    </span>
  )
}

export function SalaryBadge({ salary }: { salary: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[oklch(0.965_0.007_252)] px-2 py-0.5 text-[11px] font-medium text-[oklch(0.42_0.022_258)] ring-1 ring-[oklch(0.905_0.01_255)]">
      {salary}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    applied:     'bg-[oklch(0.965_0.007_252)] text-[oklch(0.42_0.022_258)] ring-1 ring-[oklch(0.905_0.01_255)]',
    shortlisted: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    selected:    'bg-brand-blue/8 text-brand-blue ring-1 ring-brand-blue/15',
    rejected:    'bg-red-50 text-red-600 ring-1 ring-red-200',
  }
  const dots: Record<string, string> = {
    applied:     'bg-[oklch(0.70_0.018_258)]',
    shortlisted: 'bg-amber-500',
    selected:    'bg-brand-blue',
    rejected:    'bg-red-500',
  }
  return (
    <Badge dot dotClassName={dots[status] ?? 'bg-[oklch(0.70_0.018_258)]'} className={styles[status] ?? 'bg-[oklch(0.965_0.007_252)] text-[oklch(0.42_0.022_258)]'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
