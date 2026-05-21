import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Briefcase, Bell, CheckCircle2, TrendingUp, Clock, ArrowRight,
  User, FileText, Settings, LogOut, MapPin, LayoutDashboard,
  ShieldCheck, CheckCircle, XCircle, Trash2, ChevronDown,
  Calendar, Users, Loader2, BarChart3,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DriveCard } from '@/components/drives/DriveCard'
import { StatusBadge } from '@/components/ui/Badge'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { useAuth } from '@/context/AuthContext'
import { useDrives } from '@/hooks/useDrives'
import { useApplications } from '@/hooks/useApplications'
import {
  useAdminDrives, useAdminStats,
  useApproveDrive, useRejectDrive, useDeleteDrive,
} from '@/hooks/useAdmin'
import type { AdminDrive } from '@/lib/api/admin'

export default function Dashboard() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  // User data
  const { data: applications = [] } = useApplications(user?.id)
  const { data: drives = [] }       = useDrives({ enabled: !isAdmin })

  // Admin data
  const { data: pendingDrives = [], isLoading: pendingLoading } = useAdminDrives('pending',  isAdmin)
  const { data: approvedDrives = [] }                           = useAdminDrives('approved', isAdmin)
  const { data: rejectedDrives = [] }                           = useAdminDrives('rejected', isAdmin)
  const { data: adminStats }                                    = useAdminStats(isAdmin)

  const approve = useApproveDrive()
  const reject  = useRejectDrive()
  const remove  = useDeleteDrive()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab]         = useState<'pending' | 'approved' | 'rejected'>('pending')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl font-semibold text-muted-foreground mb-4">Please log in to view your dashboard.</p>
          <Link to="/login" className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition">Sign In</Link>
        </div>
      </div>
    )
  }

  const userName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there'

  // ── User stats ──
  const userStats = [
    { label: 'Total Applied',   value: applications.length,                                              icon: Briefcase,    accent: 'from-blue-500/15 to-blue-500/0' },
    { label: 'Shortlisted',     value: applications.filter((a) => a.status === 'shortlisted').length,    icon: TrendingUp,   accent: 'from-amber-400/20 to-amber-400/0' },
    { label: 'Selected',        value: applications.filter((a) => a.status === 'selected').length,       icon: CheckCircle2, accent: 'from-emerald-500/15 to-emerald-500/0' },
    { label: 'Upcoming Drives', value: drives.filter((d) => new Date(d.drive_date) >= new Date()).length, icon: Clock,        accent: 'from-violet-500/15 to-violet-500/0' },
  ]

  const appliedIds   = new Set(applications.map((a) => a.drive.id))
  const recommended  = drives.filter((d) => !appliedIds.has(d.id)).slice(0, 4)

  // ── Tab drive list ──
  const tabDrives =
    activeTab === 'pending'  ? pendingDrives :
    activeTab === 'approved' ? approvedDrives :
    rejectedDrives

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-[240px_1fr] gap-8">

            {/* ── Sidebar ── */}
            <aside className="space-y-4">
              {/* Profile card */}
              <div className="rounded-2xl border border-border bg-card p-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.62_0.22_260)] to-[oklch(0.55_0.22_260)] text-primary-foreground text-2xl font-bold shadow-[0_8px_20px_-8px_oklch(0.62_0.22_260/0.6)] mb-3">
                  {(userName as string)[0].toUpperCase()}
                </div>
                <p className="font-semibold text-foreground capitalize">{userName}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
                {isAdmin && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-[10px] font-bold text-brand-blue">
                    <ShieldCheck className="h-3 w-3" /> Admin
                  </span>
                )}
                {!isAdmin && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Profile complete</span><span className="font-semibold text-foreground">65%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary">
                      <div className="h-1.5 w-[65%] rounded-full bg-brand-blue" />
                    </div>
                    <Link to="/profile" className="mt-4 block rounded-full border border-border py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                      Complete Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Nav */}
              <nav className="rounded-2xl border border-border bg-card overflow-hidden">
                {isAdmin ? (
                  /* Admin nav */
                  <>
                    <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue">
                      <ShieldCheck className="h-4 w-4" /> Admin Panel
                    </button>
                    {[
                      { label: 'Pending',  count: adminStats?.pending  ?? 0, color: 'bg-amber-500'   },
                      { label: 'Approved', count: adminStats?.approved ?? 0, color: 'bg-emerald-500' },
                      { label: 'Rejected', count: adminStats?.rejected ?? 0, color: 'bg-red-500'     },
                    ].map(({ label, count, color }) => (
                      <button
                        key={label}
                        onClick={() => setActiveTab(label.toLowerCase() as typeof activeTab)}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                          activeTab === label.toLowerCase()
                            ? 'bg-secondary text-foreground'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        <span className="capitalize">{label}</span>
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white ${color}`}>{count}</span>
                      </button>
                    ))}
                  </>
                ) : (
                  /* User nav */
                  <>
                    {[
                      { icon: LayoutDashboard, label: 'Dashboard',    active: true  },
                      { icon: Briefcase,       label: 'Applications', active: false },
                      { icon: Bell,            label: 'Job Alerts',   active: false },
                      { icon: User,            label: 'My Profile',   active: false },
                      { icon: FileText,        label: 'My Resume',    active: false },
                      { icon: Settings,        label: 'Settings',     active: false },
                    ].map(({ icon: Icon, label, active }) => (
                      <button
                        key={label}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${active ? 'bg-brand-blue/10 text-brand-blue border-l-2 border-brand-blue' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                      >
                        <Icon className="h-4 w-4" />{label}
                      </button>
                    ))}
                  </>
                )}
                <button
                  onClick={() => { signOut(); navigate('/') }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors border-t border-border"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </nav>
            </aside>

            {/* ── Main content ── */}
            <div className="space-y-6">

              {/* Welcome banner */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[oklch(0.18_0.04_260)] via-[oklch(0.22_0.06_260)] to-[oklch(0.16_0.04_260)] p-6 shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.5)]">
                <div aria-hidden className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[oklch(0.62_0.22_260/0.3)] blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[oklch(0.84_0.17_85/0.15)] blur-3xl" />
                <div className="relative">
                  <p className="text-sm font-medium text-white/60">
                    {isAdmin ? '🛡️ Admin View' : 'Good to see you 👋'}
                  </p>
                  <h1 className="text-2xl font-bold text-white mt-1 capitalize">
                    Welcome back, {userName}!
                  </h1>
                  <p className="text-white/60 text-sm mt-1.5">
                    {isAdmin ? (
                      <>
                        <span className="text-amber-400 font-semibold">{adminStats?.pending ?? 0} drive(s)</span> pending review ·{' '}
                        <span className="text-emerald-400 font-semibold">{adminStats?.approved ?? 0} approved</span> ·{' '}
                        <span className="text-white/40">{adminStats?.total ?? 0} total</span>
                      </>
                    ) : (
                      <>You have <span className="text-brand-yellow font-semibold">{applications.filter((a) => a.status === 'shortlisted').length} shortlisted</span> application(s) waiting.</>
                    )}
                  </p>
                  {!isAdmin && (
                    <Link
                      to="/drives"
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                    >
                      Browse new drives <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* ════════════ ADMIN VIEW ════════════ */}
              {isAdmin && (
                <>
                  {/* Admin stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Pending Review', value: adminStats?.pending  ?? 0, icon: Clock,        accent: 'from-amber-400/20 to-amber-400/0',    iconColor: 'text-amber-500'   },
                      { label: 'Approved',        value: adminStats?.approved ?? 0, icon: CheckCircle2, accent: 'from-emerald-500/15 to-emerald-500/0', iconColor: 'text-emerald-500' },
                      { label: 'Rejected',        value: adminStats?.rejected ?? 0, icon: XCircle,      accent: 'from-red-500/15 to-red-500/0',         iconColor: 'text-red-500'     },
                      { label: 'Total Drives',    value: adminStats?.total    ?? 0, icon: BarChart3,     accent: 'from-blue-500/15 to-blue-500/0',        iconColor: 'text-brand-blue'  },
                    ].map(({ label, value, icon: Icon, accent, iconColor }) => (
                      <div key={label} className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5`}>
                        <div className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-80`} />
                        <div className="relative">
                          <Icon className={`h-5 w-5 ${iconColor} mb-3`} />
                          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
                          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Drives table with tabs */}
                  <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    {/* Tab bar */}
                    <div className="flex items-center gap-1 border-b border-border px-4 pt-4 pb-0">
                      {(['pending', 'approved', 'rejected'] as const).map((tab) => {
                        const count =
                          tab === 'pending'  ? (adminStats?.pending  ?? 0) :
                          tab === 'approved' ? (adminStats?.approved ?? 0) :
                          (adminStats?.rejected ?? 0)
                        return (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative px-4 py-2.5 text-sm font-semibold transition-colors capitalize ${
                              activeTab === tab
                                ? 'text-foreground after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-brand-blue'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {tab}
                            {count > 0 && (
                              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white ${
                                tab === 'pending' ? 'bg-amber-500' : tab === 'approved' ? 'bg-emerald-500' : 'bg-red-500'
                              }`}>{count}</span>
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {/* Drive rows */}
                    {pendingLoading ? (
                      <div className="flex items-center justify-center py-12 gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                      </div>
                    ) : tabDrives.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                        <p className="text-sm font-semibold text-foreground">No {activeTab} drives</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activeTab === 'pending' ? 'All caught up! Nothing waiting for review.' : 'Nothing here yet.'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {tabDrives.map((drive) => (
                          <PendingDriveRow
                            key={drive.id}
                            drive={drive}
                            activeTab={activeTab}
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
                  </div>
                </>
              )}

              {/* ════════════ USER VIEW ════════════ */}
              {!isAdmin && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {userStats.map(({ label, value, icon: Icon, accent }) => (
                      <div key={label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.2)]">
                        <div className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${accent} blur-2xl opacity-80`} />
                        <div className="relative">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.62_0.22_260)] to-[oklch(0.55_0.22_260)] text-primary-foreground shadow-[0_8px_20px_-8px_oklch(0.62_0.22_260/0.5)] ring-1 ring-white/10 mb-3">
                            <Icon className="h-5 w-5" />
                          </span>
                          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
                          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Applications table */}
                  <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                      <h2 className="font-semibold text-foreground">My Applications</h2>
                      <Link to="/drives" className="text-xs font-semibold text-brand-blue hover:underline">Find more drives →</Link>
                    </div>
                    <div className="divide-y divide-border">
                      {applications.length === 0 ? (
                        <p className="px-6 py-8 text-sm text-center text-muted-foreground">
                          No applications yet. <Link to="/drives" className="text-brand-blue font-semibold hover:underline">Browse drives →</Link>
                        </p>
                      ) : applications.map((app) => {
                        const driveDate = new Date(app.drive.drive_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                        return (
                          <div key={app.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-secondary/50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <CompanyLogo name={app.drive.company.name} size="sm" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{app.drive.role}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                                  {app.drive.company.name}
                                  <span className="text-border">·</span>
                                  <MapPin className="h-3 w-3" />{app.drive.city}
                                  <span className="text-border">·</span>
                                  {driveDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <StatusBadge status={app.status} />
                              <Link to={`/drives/${app.drive.id}`} className="text-xs text-muted-foreground hover:text-brand-blue font-medium transition-colors">View</Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recommended */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <p className="text-xs font-semibold tracking-widest text-muted-foreground">FOR YOU</p>
                        <h2 className="mt-1 text-xl font-bold text-foreground">Recommended Drives</h2>
                      </div>
                      <Link to="/drives" className="text-sm font-semibold text-brand-blue hover:underline inline-flex items-center gap-1">
                        See all <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {recommended.map((d) => <DriveCard key={d.id} drive={d} compact />)}
                    </div>
                  </div>

                  {/* Job Alerts CTA */}
                  <div className="rounded-2xl border border-dashed border-border p-6">
                    <div className="flex items-start gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.62_0.22_260)] to-[oklch(0.55_0.22_260)] text-primary-foreground shadow-[0_8px_20px_-8px_oklch(0.62_0.22_260/0.5)] ring-1 ring-white/10 shrink-0">
                        <Bell className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground">Set Up Job Alerts</h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Get WhatsApp / email notifications when new drives match your profile — never miss a drive again.</p>
                        <Link to="/job-alerts" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-blue px-5 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 transition">
                          Enable Alerts <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

/* ── Pending drive row ── */
function PendingDriveRow({
  drive, activeTab, approving, rejecting, deleting, confirmDelete,
  onApprove, onReject, onDelete, onConfirmDelete, onCancelDelete,
}: {
  drive: AdminDrive
  activeTab: 'pending' | 'approved' | 'rejected'
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
  const today     = new Date().toISOString().split('T')[0]
  const isExpired = drive.drive_date < today

  return (
    <div className="px-6 py-4 hover:bg-secondary/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">

        {/* Drive info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {isExpired && (
              <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Expired</span>
            )}
            {drive.is_priority && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Priority</span>
            )}
          </div>
          <p className="font-bold text-foreground">{drive.role}</p>
          <p className="text-xs text-brand-blue font-medium mt-0.5">
            {drive.company.name}
            {drive.company.industry && <span className="text-muted-foreground font-normal"> · {drive.company.industry}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{drive.location}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{drive.drive_date} · {drive.drive_time}</span>
            {drive.openings && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{drive.openings} openings</span>}
          </div>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              {drive.description && (
                <p className="text-xs text-muted-foreground leading-relaxed">{drive.description}</p>
              )}
              {drive.skills && drive.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {drive.skills.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-foreground">{s}</span>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">Submitted: {new Date(drive.created_at).toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {activeTab === 'pending' && (
            <>
              <button onClick={onApprove} disabled={approving}
                className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-60">
                {approving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Approve
              </button>
              <button onClick={onReject} disabled={rejecting}
                className="flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-60">
                {rejecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />} Reject
              </button>
            </>
          )}
          {activeTab === 'approved' && (
            <button onClick={onReject} disabled={rejecting}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-red-300 hover:text-red-600 transition disabled:opacity-60">
              <XCircle className="h-3.5 w-3.5" /> Revoke
            </button>
          )}
          {activeTab === 'rejected' && (
            <button onClick={onApprove} disabled={approving}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-emerald-300 hover:text-emerald-600 transition disabled:opacity-60">
              <CheckCircle className="h-3.5 w-3.5" /> Re-approve
            </button>
          )}

          {confirmDelete === drive.id ? (
            <div className="flex items-center gap-1">
              <button onClick={onConfirmDelete} disabled={deleting}
                className="rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 transition">Confirm</button>
              <button onClick={onCancelDelete}
                className="rounded-full border border-border px-3 py-2 text-xs font-medium hover:bg-secondary transition">Cancel</button>
            </div>
          ) : (
            <button onClick={onDelete}
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:border-red-300 hover:text-red-500 transition">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          <button onClick={() => setExpanded(!expanded)}
            className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary transition">
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
