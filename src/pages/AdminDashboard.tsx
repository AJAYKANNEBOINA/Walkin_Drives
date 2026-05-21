import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2, XCircle, Trash2, Clock, BarChart3,
  MapPin, Briefcase, Calendar, Users, Mail, ChevronDown, LogOut, ShieldCheck, Loader2,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useAdminDrives, useAdminStats, useApproveDrive, useRejectDrive, useDeleteDrive } from '@/hooks/useAdmin'
import type { DriveStatus, AdminDrive } from '@/lib/api/admin'

const TABS: { label: string; value: DriveStatus | 'all' }[] = [
  { label: 'Pending',  value: 'pending'  },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All',      value: 'all'      },
]

const STATUS_BADGE: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<DriveStatus | 'all'>('pending')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const { data: stats } = useAdminStats(isAdmin)
  const { data: drives = [], isLoading, error } = useAdminDrives(tab === 'all' ? undefined : tab, isAdmin)

  const approve = useApproveDrive()
  const reject  = useRejectDrive()
  const remove  = useDeleteDrive()

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground mt-2">You don't have admin privileges.</p>
          <button onClick={() => navigate('/')} className="mt-6 rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-background">

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-blue text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Admin Panel</p>
              <p className="text-[11px] text-muted-foreground">WalkinDrives.in</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Pending Review', value: stats?.pending ?? 0,  color: 'text-amber-500',   icon: <Clock className="h-5 w-5" /> },
            { label: 'Approved',       value: stats?.approved ?? 0, color: 'text-emerald-500', icon: <CheckCircle2 className="h-5 w-5" /> },
            { label: 'Rejected',       value: stats?.rejected ?? 0, color: 'text-red-500',     icon: <XCircle className="h-5 w-5" /> },
            { label: 'Total Drives',   value: stats?.total ?? 0,    color: 'text-brand-blue',  icon: <BarChart3 className="h-5 w-5" /> },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-border bg-secondary p-1 w-fit mb-6">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
              {t.value === 'pending' && (stats?.pending ?? 0) > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-white font-bold">
                  {stats?.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Drive list */}
        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
            <strong>Query error:</strong> {(error as Error).message}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading drives…</div>
        ) : drives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-medium text-foreground">No {tab === 'all' ? '' : tab} drives</p>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === 'pending' ? 'All caught up! No drives waiting for review.' : 'Nothing here yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {drives.map(drive => (
              <DriveCard
                key={drive.id}
                drive={drive}
                today={today}
                approving={approve.isPending}
                rejecting={reject.isPending}
                deleting={remove.isPending}
                confirmDelete={confirmDelete}
                onApprove={() => approve.mutate(drive.id)}
                onReject={() => reject.mutate(drive.id)}
                onDelete={() => setConfirmDelete(drive.id)}
                onConfirmDelete={() => { remove.mutate(drive.id); setConfirmDelete(null) }}
                onCancelDelete={() => setConfirmDelete(null)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function DriveCard({
  drive, today, approving, rejecting, deleting, confirmDelete,
  onApprove, onReject, onDelete, onConfirmDelete, onCancelDelete,
}: {
  drive: AdminDrive
  today: string
  approving: boolean
  rejecting: boolean
  deleting: boolean
  confirmDelete: string | null
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
  onConfirmDelete: () => void
  onCancelDelete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isExpired = drive.drive_date < today

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden transition-all ${
      drive.status === 'pending' ? 'border-amber-200' :
      drive.status === 'approved' ? 'border-emerald-200/60' :
      'border-red-200/60'
    }`}>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[drive.status]}`}>
                {drive.status === 'pending'  && <Clock className="h-3 w-3" />}
                {drive.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                {drive.status === 'rejected' && <XCircle className="h-3 w-3" />}
                {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
              </span>
              {isExpired && (
                <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Expired
                </span>
              )}
              {drive.is_priority && (
                <span className="rounded-full bg-brand-yellow/20 px-2.5 py-0.5 text-[11px] font-semibold text-brand-yellow-foreground">
                  Priority
                </span>
              )}
            </div>

            <h3 className="font-bold text-foreground">{drive.role}</h3>
            <p className="text-sm font-medium text-brand-blue">{drive.company.name}
              {drive.company.industry && <span className="text-muted-foreground font-normal"> · {drive.company.industry}</span>}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{drive.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{drive.experience}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{drive.drive_date} · {drive.drive_time}</span>
              {drive.openings && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{drive.openings} openings</span>}
              {drive.contact_email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{drive.contact_email}</span>}
            </div>

            {drive.contact_email && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Contact: <span className="text-foreground font-medium">{drive.contact_email}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {drive.status === 'pending' && (
              <>
                <button
                  onClick={onApprove}
                  disabled={approving}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-60"
                >
                  {approving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  Approve
                </button>
                <button
                  onClick={onReject}
                  disabled={rejecting}
                  className="flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                >
                  {rejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                  Reject
                </button>
              </>
            )}
            {drive.status === 'approved' && (
              <button
                onClick={onReject}
                disabled={rejecting}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-red-300 hover:text-red-600 transition disabled:opacity-60"
              >
                <XCircle className="h-3.5 w-3.5" /> Revoke
              </button>
            )}
            {drive.status === 'rejected' && (
              <button
                onClick={onApprove}
                disabled={approving}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-emerald-300 hover:text-emerald-600 transition disabled:opacity-60"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Re-approve
              </button>
            )}

            {confirmDelete === drive.id ? (
              <div className="flex items-center gap-1">
                <button onClick={onConfirmDelete} disabled={deleting} className="rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 transition">
                  Confirm
                </button>
                <button onClick={onCancelDelete} className="rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={onDelete}
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:border-red-300 hover:text-red-500 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary transition"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {drive.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{drive.description}</p>
            )}
            {drive.skills && drive.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {drive.skills.map(s => (
                  <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">{s}</span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Submitted: {new Date(drive.created_at).toLocaleString('en-IN')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
