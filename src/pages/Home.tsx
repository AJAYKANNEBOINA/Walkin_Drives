import { Link } from 'react-router-dom'
import {
  CheckCircle2, ArrowRight, MapPin, Search,
  Bell, Clock3, Users, Zap, TrendingUp, BadgeCheck,
  Building2, ChevronRight,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DriveCard } from '@/components/drives/DriveCard'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { useDrives } from '@/hooks/useDrives'

const partners = [
  'Genpact', 'Capgemini', 'HDFC Life', 'Hewlett Packard Enterprise',
  'Kotak Mahindra Bank', 'Infosys BPM', 'Tech Mahindra', 'Sopra Steria',
  'ICICI Bank', 'Wipro', 'LTIMindtree', 'TCS',
]

export default function Home() {
  const { data: drives = [] } = useDrives()
  const featuredDrives = drives.filter(d => d.is_priority).slice(0, 6)

  const today        = new Date().toISOString().split('T')[0]
  const todayCount   = drives.filter(d => d.drive_date === today).length
  const fresherCount = drives.filter(d => d.experience.startsWith('0')).length
  const companyCount = new Set(drives.map(d => d.company.name)).size

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.003_250)] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-white border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-16">
            <div className="grid lg:grid-cols-2 gap-10 items-center">

              {/* Left: Text */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.905_0.01_255)] bg-[oklch(0.975_0.005_250)] px-3.5 py-1.5 text-xs font-medium text-[oklch(0.50_0.022_258)] mb-7">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {drives.length || 0} walk-in drives live right now
                </div>

                <h1 className="text-[36px] sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[oklch(0.13_0.04_264)] leading-[1.08]">
                  Walk in.<br />
                  <span className="text-brand-blue">Walk out hired.</span>
                </h1>

                <p className="mt-5 text-base text-[oklch(0.50_0.022_258)] max-w-md leading-relaxed">
                  India's only platform for walk-in interview drives.
                  No waiting weeks — show up and get hired the same day.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/drives" className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors shadow-[0_4px_14px_oklch(0.60_0.22_262/0.35)]">
                    Find Walk-in Drives <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/register" className="inline-flex items-center gap-2 rounded-lg border border-[oklch(0.905_0.01_255)] px-6 py-3 text-sm font-semibold text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.975_0.005_250)] transition-colors">
                    Create Free Account
                  </Link>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
                  {['Verified employers', 'Updated daily', '100% free'].map(t => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-sm text-[oklch(0.60_0.018_258)]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: drives.length || 0, label: 'Active drives'    },
                    { value: todayCount,          label: "Today's drives"   },
                    { value: fresherCount,        label: 'Fresher roles'    },
                    { value: companyCount,        label: 'Companies'        },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl border border-[oklch(0.905_0.01_255)] bg-[oklch(0.975_0.005_250)] p-3.5 text-center">
                      <p className="text-xl font-bold text-[oklch(0.13_0.04_264)]">{s.value}</p>
                      <p className="mt-0.5 text-[11px] text-[oklch(0.55_0.020_258)] font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Hero person photo */}
              <div className="hidden lg:flex items-end justify-center relative">
                {/* Gradient blob background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-[420px] w-[420px] rounded-full bg-gradient-to-br from-brand-blue via-[oklch(0.50_0.25_280)] to-[oklch(0.42_0.22_290)]" />
                </div>
                {/* Ghost / reflection */}
                <img
                  src="/images/person_10_a.webp"
                  alt=""
                  aria-hidden
                  className="absolute right-4 bottom-0 h-[380px] object-contain opacity-20 blur-[1px] scale-x-[-1] translate-x-10"
                />
                {/* Main photo */}
                <img
                  src="/images/person_10_a.webp"
                  alt="Job seeker"
                  className="relative z-10 h-[420px] object-contain drop-shadow-2xl"
                />
                {/* Floating badge — Hired! */}
                <div className="absolute top-16 right-8 z-20 flex items-center gap-2 rounded-2xl bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)] px-4 py-3 border border-[oklch(0.905_0.01_255)]">
                  <span className="text-xl">🎉</span>
                  <div>
                    <p className="text-xs font-bold text-[oklch(0.13_0.04_264)]">Offer Received!</p>
                    <p className="text-[10px] text-[oklch(0.55_0.020_258)]">Same day · Walk-in drive</p>
                  </div>
                </div>
                {/* Floating badge — Live drives */}
                <div className="absolute bottom-20 left-0 z-20 flex items-center gap-2 rounded-2xl bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] px-4 py-3 border border-[oklch(0.905_0.01_255)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <p className="text-xs font-bold text-[oklch(0.13_0.04_264)]">{drives.length} Drives Live</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Partners ── */}
        <section className="pt-20 pb-14 bg-white border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold tracking-widest text-[oklch(0.55_0.010_258)] uppercase mb-1.5">Trusted Hiring Partners</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[oklch(0.13_0.04_264)]">India's top employers, all in one place.</h2>
              </div>
              <p className="text-sm text-[oklch(0.50_0.022_258)] max-w-xs">Walk-in drives from verified IT, banking and BPM companies.</p>
            </div>
            <div className="marquee-mask overflow-hidden">
              <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
                {[...partners, ...partners].map((name, i) => (
                  <div key={`${name}-${i}`} className="shrink-0 w-44 h-20 flex flex-col items-center justify-center gap-2 rounded-xl border border-[oklch(0.905_0.01_255)] bg-white px-4 py-3 hover:border-brand-blue/25 hover:shadow-sm transition-all">
                    <CompanyLogo name={name} size="marquee" className="border-0 rounded-none bg-transparent p-0" />
                    <span className="text-[10px] font-medium text-[oklch(0.55_0.020_258)] text-center leading-tight">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-20 bg-[oklch(0.975_0.005_250)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold tracking-widest text-[oklch(0.55_0.010_258)] uppercase mb-2">How It Works</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[oklch(0.13_0.04_264)]">Hired in 4 steps</h2>
              <p className="mt-2 text-sm text-[oklch(0.50_0.022_258)] max-w-sm mx-auto">No resume waiting. Walk in, interview, walk out hired — same day.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: 1, icon: MapPin,        title: 'Set Your City',      desc: 'Choose your city and preferred industry. We surface relevant drives near you.'         },
                { step: 2, icon: Search,         title: 'Browse & Filter',    desc: 'Filter by experience, work mode and salary to find exactly what fits your profile.'   },
                { step: 3, icon: CheckCircle2,   title: 'Prepare to Walk In', desc: 'Check the document list, note the venue and timing — everything in one place.'        },
                { step: 4, icon: TrendingUp,     title: 'Get Hired Today',    desc: 'Attend the drive, ace the interview and receive a same-day offer. No waiting.'        },
              ].map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="bg-white rounded-xl border border-[oklch(0.905_0.01_255)] p-6 hover:border-brand-blue/20 hover:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-3xl font-black text-[oklch(0.82_0.08_262)]">0{step}</span>
                  </div>
                  <h3 className="font-bold text-[oklch(0.13_0.04_264)] text-sm">{title}</h3>
                  <p className="mt-1.5 text-sm text-[oklch(0.50_0.022_258)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Drives ── */}
        <section className="py-16 bg-white border-y border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold tracking-widest text-[oklch(0.55_0.010_258)] uppercase mb-1.5">Open Walk-In Drives</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[oklch(0.13_0.04_264)]">Show up. Get hired.</h2>
              </div>
              <Link to="/drives" className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[oklch(0.905_0.01_255)] px-4 py-2 text-sm font-medium text-[oklch(0.42_0.022_258)] hover:bg-[oklch(0.965_0.007_252)] hover:text-[oklch(0.13_0.04_264)] transition-all">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {featuredDrives.length === 0 ? (
              <div className="text-center py-12 text-sm text-[oklch(0.50_0.022_258)]">
                No featured drives right now. <Link to="/drives" className="text-brand-blue font-semibold hover:underline">Browse all →</Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredDrives.map(d => <DriveCard key={d.id} drive={d} />)}
              </div>
            )}

            <div className="mt-8 flex sm:hidden justify-center">
              <Link to="/drives" className="inline-flex items-center gap-1.5 rounded-lg border border-[oklch(0.905_0.01_255)] px-6 py-2.5 text-sm font-medium text-[oklch(0.42_0.022_258)] hover:bg-[oklch(0.965_0.007_252)] transition-all">
                View all drives <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Why Us (3 points) ── */}
        <section className="py-16 bg-[oklch(0.975_0.005_250)] border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { icon: BadgeCheck, title: 'Verified Employers Only',    desc: 'Every company is manually verified before drives go live. No spam, no fake listings.' },
                { icon: Building2,  title: 'Same-Day Results',           desc: 'Walk-in drives give you an answer the same day. No waiting weeks for a callback.'     },
                { icon: Users,      title: '100% Free for Job Seekers',  desc: 'No subscriptions, no resume fees, no hidden charges — free forever.'                  },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-xl border border-[oklch(0.905_0.01_255)] p-6 hover:border-brand-blue/20 hover:shadow-sm transition-all">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-bold text-[oklch(0.13_0.04_264)] text-sm">{title}</h3>
                  <p className="mt-1.5 text-sm text-[oklch(0.50_0.022_258)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Job Alerts CTA ── */}
        <section className="py-16 bg-white border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.88_0.01_255)] bg-[oklch(0.965_0.007_252)] px-3 py-1 text-xs font-bold text-[oklch(0.42_0.022_258)] uppercase tracking-widest mb-5">
              <Bell className="h-3 w-3" /> Job Alerts
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[oklch(0.13_0.04_264)]">Never miss a walk-in drive</h2>
            <p className="mt-3 text-sm text-[oklch(0.50_0.022_258)] leading-relaxed max-w-md mx-auto">
              Get notified the moment a new drive matching your profile goes live — straight to your inbox.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors shadow-sm">
                Enable Alerts — Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/drives" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[oklch(0.905_0.01_255)] px-6 py-3 text-sm font-medium text-[oklch(0.42_0.022_258)] hover:bg-[oklch(0.965_0.007_252)] transition-colors">
                Browse Drives First
              </Link>
            </div>
          </div>
        </section>

        {/* ── Employer CTA ── */}
        <section className="py-16 bg-[oklch(0.975_0.005_250)] border-t border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden">
              <div className="relative text-center mb-10">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.88_0.01_255)] bg-white px-3 py-1 text-xs font-bold text-[oklch(0.42_0.022_258)] uppercase tracking-widest mb-5">
                  For Employers
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[oklch(0.13_0.04_264)]">Need to hire fast?</h2>
                <p className="mt-2.5 text-[oklch(0.50_0.022_258)] text-sm max-w-md mx-auto">
                  Post your walk-in drive and reach hundreds of local candidates. Go live in under 2 hours. Completely free.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {[
                  { icon: Clock3,  title: 'Post in Minutes',    desc: 'Simple form, instant submit'     },
                  { icon: MapPin,  title: 'Local Reach',        desc: 'City-level candidate targeting'  },
                  { icon: Users,   title: 'Quality Candidates', desc: 'Pre-screened applicants'         },
                  { icon: Zap,     title: 'Go Live in 2 hrs',   desc: 'Reviewed and published fast'    },
                ].map(f => (
                  <div key={f.title} className="rounded-xl border border-[oklch(0.905_0.01_255)] bg-white p-5 hover:shadow-sm transition-all">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-[oklch(0.94_0.005_255)] text-[oklch(0.42_0.022_258)] mb-3">
                      <f.icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-sm font-bold text-[oklch(0.13_0.04_264)]">{f.title}</h3>
                    <p className="mt-0.5 text-[11px] text-[oklch(0.55_0.020_258)]">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-6">
                <Link to="/post-drive" className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-7 py-3 text-sm font-bold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors shadow-sm">
                  Post a Walk-In Drive — Free <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center gap-10">
                  {[['₹0', 'Posting fee'], ['2 hrs', 'Go live in'], ['100%', 'Verified talent']].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <p className="text-xl font-bold text-[oklch(0.13_0.04_264)]">{v}</p>
                      <p className="text-[11px] text-[oklch(0.60_0.018_258)] mt-0.5 uppercase tracking-wide">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
