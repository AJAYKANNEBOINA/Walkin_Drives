import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Calendar, Clock, Users, Star, CheckCircle2,
  Share2, Bookmark, ArrowRight, Loader2, Briefcase, BadgeCheck,
  Facebook, Twitter, Linkedin, Mail, Building2, IndianRupee, Copy,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DriveCard } from '@/components/drives/DriveCard'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { useAuth } from '@/context/AuthContext'
import { useDrive, useDrives } from '@/hooks/useDrives'
import { useApply, useHasApplied } from '@/hooks/useApplications'

const MODE_COLOR: Record<string, string> = {
  Onsite: 'bg-white/10 text-white/80 border-white/20',
  Hybrid: 'bg-white/10 text-white/80 border-white/20',
  Remote: 'bg-white/10 text-white/80 border-white/20',
}

export default function DriveDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applySuccess, setApplySuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const { data: drive, isLoading } = useDrive(id)
  const { data: allDrives = [] } = useDrives()
  const { data: applied = false } = useHasApplied(id ?? '', user?.uid)
  const applyMutation = useApply()

  const related = allDrives.filter((d) => d.id !== id && d.city === drive?.city).slice(0, 4)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  if (!drive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl font-semibold text-muted-foreground">Drive not found</p>
          <Link to="/drives" className="mt-4 inline-block text-brand-blue font-medium hover:underline">Browse all drives</Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(drive.drive_date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const today      = new Date().toISOString().split('T')[0]
  const isExpired  = drive.drive_date < today

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApply = () => {
    if (!user) return navigate('/login')
    if (applied || applyMutation.isPending) return
    applyMutation.mutate({ driveId: drive.id, userId: user.uid })
    setApplySuccess(true)
    setTimeout(() => setApplySuccess(false), 5000)
  }

  const shareUrl = window.location.href

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* ── EXPIRED NOTICE ── */}
      {isExpired && (
        <div className="bg-[oklch(0.97_0.005_255)] border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2.5 text-sm text-[oklch(0.42_0.022_258)]">
            <span className="text-base">⏰</span>
            <span>This walk-in drive has already taken place on <strong>{formattedDate}</strong>. You can still view the details for reference.</span>
          </div>
        </div>
      )}

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.14_0.05_265)] via-[oklch(0.18_0.06_260)] to-[oklch(0.12_0.04_265)]">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-[400px] w-[400px] rounded-full bg-[oklch(0.62_0.22_260/0.18)] blur-[100px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-[350px] w-[350px] rounded-full bg-[oklch(0.55_0.22_260/0.12)] blur-[100px]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(oklch(1_0_0/0.6) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 75%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          <Link
            to="/drives"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> All Drives
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Logo */}
            <div className="shrink-0">
              <div className="h-16 w-16 rounded-2xl border border-white/10 bg-white/10 backdrop-blur flex items-center justify-center overflow-hidden">
                <CompanyLogo name={drive.company.name} size="lg" className="border-0 bg-transparent rounded-none" />
              </div>
            </div>

            {/* Title area */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {drive.is_priority && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 px-2.5 py-0.5 text-[11px] font-bold text-brand-yellow-foreground">
                    ⭐ Priority
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${MODE_COLOR[drive.mode] ?? 'bg-white/10 text-white border-white/20'}`}>
                  {drive.mode}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/70">
                  Walk-in Drive
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{drive.role}</h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/60">
                <span className="flex items-center gap-1.5 font-semibold text-white/80">
                  <Building2 className="h-4 w-4" />
                  {drive.company.name}
                </span>
                {drive.company.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
                {drive.company.industry && (
                  <span className="text-white/40">· {drive.company.industry}</span>
                )}
              </div>

              {/* Meta chips */}
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  { icon: MapPin,   label: 'LOCATION',   value: drive.city },
                  { icon: Calendar, label: 'DATE',        value: new Date(drive.drive_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  { icon: Briefcase,label: 'EXPERIENCE',  value: drive.experience },
                  ...(drive.openings ? [{ icon: Users, label: 'OPENINGS', value: `${drive.openings} positions` }] : []),
                  ...(drive.salary  ? [{ icon: IndianRupee, label: 'SALARY', value: drive.salary }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3.5 py-2">
                    <Icon className="h-3.5 w-3.5 text-white/40 shrink-0" />
                    <div>
                      <p className="text-[9px] font-bold tracking-widest text-white/35 uppercase">{label}</p>
                      <p className="text-xs font-semibold text-white/80">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action icons */}
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <button className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white/50 hover:text-white hover:border-white/30 transition">
                <Bookmark className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/5 text-white/50 hover:text-white hover:border-white/30 transition">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8">

            {/* ── LEFT: Main content ── */}
            <div className="space-y-6">

              {/* About the Company */}
              {drive.company.industry && (
                <div className="rounded-2xl border border-border bg-card p-7">
                  <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-brand-blue" /> About {drive.company.name}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {drive.company.name} is a leading company in the <span className="font-semibold text-foreground">{drive.company.industry}</span> sector,
                    known for quality hiring and growth-oriented culture. This walk-in drive is an opportunity to join their growing team directly.
                  </p>
                </div>
              )}

              {/* About this Drive */}
              {drive.description && (
                <div className="rounded-2xl border border-border bg-card p-7">
                  <h2 className="text-base font-bold text-foreground mb-4">About this Drive</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{drive.description}</p>
                </div>
              )}

              {/* Requirements */}
              <div className="rounded-2xl border border-border bg-card p-7">
                <h2 className="text-base font-bold text-foreground mb-5">Requirements</h2>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">Experience & Eligibility</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm font-medium text-foreground">
                        <Briefcase className="h-3.5 w-3.5 text-brand-blue" /> {drive.experience}
                      </span>
                      {drive.eligibility && (
                        <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm font-medium text-foreground">
                          <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" /> {drive.eligibility}
                        </span>
                      )}
                    </div>
                  </div>

                  {drive.skills && drive.skills.length > 0 && (
                    <div>
                      <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">Skills Required</p>
                      <div className="flex flex-wrap gap-2">
                        {drive.skills.map((s) => (
                          <span key={s} className="rounded-full bg-brand-blue/10 text-brand-blue px-3.5 py-1.5 text-xs font-semibold border border-brand-blue/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Checklist */}
              <div className="rounded-2xl border border-border bg-card p-7">
                <h2 className="text-base font-bold text-foreground mb-2">What to Carry</h2>
                <p className="text-sm text-muted-foreground mb-5">Keep these documents ready before you walk in:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    'Updated Resume (3 copies)',
                    'Aadhar Card / Passport',
                    'PAN Card',
                    '2 Passport Size Photos',
                    'Educational Certificates (originals + copies)',
                    'Experience Letter (if applicable)',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Share row */}
              <div className="rounded-2xl border border-border bg-card px-7 py-5">
                <p className="text-sm font-semibold text-foreground mb-3">Share this Drive</p>
                <div className="flex flex-wrap gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${drive.role} at ${drive.company.name} – Walk-in Drive in ${drive.city}\n${shareUrl}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-[#25D366]/10 hover:border-[#25D366]/40 hover:text-[#25D366]"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  {[
                    { icon: Linkedin, label: 'LinkedIn',    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, color: 'hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 hover:text-[#0077B5]' },
                    { icon: Twitter,  label: 'X',           href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(drive.role + ' at ' + drive.company.name)}`, color: 'hover:bg-foreground/5 hover:border-foreground/20 hover:text-foreground' },
                    { icon: Mail,     label: 'Email',       href: `mailto:?subject=${encodeURIComponent(drive.role + ' – Walk-in Drive')}&body=${encodeURIComponent(shareUrl)}`, color: 'hover:bg-rose-500/10 hover:border-rose-300 hover:text-rose-600' },
                  ].map(({ icon: Icon, label, href, color }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors ${color}`}>
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </a>
                  ))}
                  <button onClick={handleCopyLink}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Sticky sidebar ── */}
            <div>
              <div className="rounded-2xl border border-border bg-card p-6 sticky top-20 space-y-5">

                {/* Salary */}
                {drive.salary && (
                  <div className="rounded-xl bg-gradient-to-br from-brand-blue/5 to-brand-blue/10 border border-brand-blue/15 p-4 text-center">
                    <p className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-1">Salary / CTC</p>
                    <p className="text-2xl font-bold text-foreground">{drive.salary}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Annual package</p>
                  </div>
                )}

                {/* Apply button */}
                {isExpired ? (
                  <div className="w-full rounded-full border border-[oklch(0.905_0.01_255)] bg-[oklch(0.97_0.005_255)] px-8 py-3.5 text-sm font-semibold text-[oklch(0.55_0.020_258)] text-center">
                    ⏰ This drive has expired
                  </div>
                ) : (
                <button
                  onClick={handleApply}
                  disabled={applied || applyMutation.isPending}
                  className="group relative w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)] shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6),inset_0_1px_0_oklch(1_0_0/0.35)] ring-1 ring-[oklch(0.62_0.22_260/0.4)] hover:shadow-[0_18px_40px_-12px_oklch(0.62_0.22_260/0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                  {applyMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Applying…</>
                  ) : applied ? (
                    <><CheckCircle2 className="h-4 w-4" /> Applied</>
                  ) : user ? (
                    <>Apply for this Drive <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                  ) : (
                    <>Login to Apply <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
                )}

                {applySuccess && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" /> Application submitted successfully!
                  </div>
                )}

                <p className="text-center text-xs text-muted-foreground -mt-1">
                  Walk in on {new Date(drive.drive_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · No appointment needed
                </p>

                {/* Quick facts */}
                <div className="border-t border-border pt-4 space-y-3">
                  {[
                    { label: 'Drive Date',  value: formattedDate },
                    { label: 'Timing',      value: drive.drive_time },
                    { label: 'Venue',       value: drive.location },
                    { label: 'City',        value: drive.city },
                    { label: 'Experience',  value: drive.experience },
                    { label: 'Work Mode',   value: drive.mode },
                    ...(drive.openings ? [{ label: 'Openings', value: `${drive.openings} positions` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-2 text-sm">
                      <span className="text-muted-foreground shrink-0">{label}</span>
                      <span className="font-medium text-foreground text-right max-w-[170px] leading-snug">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Map directions CTA */}
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(drive.location + ', ' + drive.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-border bg-secondary py-2.5 text-xs font-semibold text-foreground hover:border-brand-blue/30 hover:text-brand-blue transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5" /> Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* ── Related drives ── */}
          {related.length > 0 && (
            <div className="mt-16">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs font-bold tracking-widest text-brand-blue uppercase">More in {drive.city}</p>
                  <h2 className="mt-1 text-2xl font-bold text-foreground">Similar Walk-in Drives</h2>
                </div>
                <Link
                  to="/drives"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {related.map((d) => <DriveCard key={d.id} drive={d} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
