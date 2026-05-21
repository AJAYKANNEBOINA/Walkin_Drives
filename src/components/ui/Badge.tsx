interface BadgeProps {
  dot?: boolean
  children: React.ReactNode
  className?: string
  dotClassName?: string
}

export function Badge({ dot, children, className = '', dotClassName = 'bg-brand-blue' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotClassName}`} />}
      {children}
    </span>
  )
}

export function PriorityBadge() {
  return (
    <Badge dot dotClassName="bg-brand-yellow" className="bg-brand-yellow/20 text-brand-yellow-foreground">
      Company Priority
    </Badge>
  )
}

export function ModeBadge({ mode }: { mode: string }) {
  return (
    <Badge dot dotClassName="bg-brand-blue" className="bg-brand-blue/10 text-brand-blue">
      {mode}
    </Badge>
  )
}

export function SalaryBadge({ salary }: { salary: string }) {
  return (
    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
      {salary}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    applied:     'bg-secondary text-foreground',
    shortlisted: 'bg-brand-yellow/20 text-brand-yellow-foreground',
    selected:    'bg-[oklch(0.62_0.22_260/0.1)] text-brand-blue',
    rejected:    'bg-destructive/10 text-destructive',
  }
  const dots: Record<string, string> = {
    applied:     'bg-muted-foreground',
    shortlisted: 'bg-brand-yellow',
    selected:    'bg-brand-blue',
    rejected:    'bg-destructive',
  }
  return (
    <Badge dot dotClassName={dots[status] ?? 'bg-muted-foreground'} className={styles[status] ?? 'bg-secondary text-foreground'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
