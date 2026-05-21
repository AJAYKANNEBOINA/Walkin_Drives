import { Link } from 'react-router-dom'
import {
  CheckCircle2, ArrowRight, MapPin, Calendar, FileCheck,
  Navigation, Bell, ShieldCheck, Clock3, Users, Zap, TrendingUp, Building2,
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

const features = [
  { icon: MapPin,      title: 'Location-Based Feed',    desc: 'Drives near you, personalised by city and preference.',        accent: 'from-blue-500/20 to-blue-500/0',    color: 'bg-blue-500/10 text-blue-500' },
  { icon: Calendar,    title: 'Daily Walk-In Calendar', desc: 'Every drive, every day — never miss a single opportunity.',     accent: 'from-amber-400/25 to-amber-400/0',  color: 'bg-amber-400/10 text-amber-500' },
  { icon: FileCheck,   title: 'Document Checklist',     desc: 'Know exactly what to carry for every walk-in drive.',          accent: 'from-emerald-500/20 to-emerald-500/0', color: 'bg-emerald-500/10 text-emerald-500' },
  { icon: Navigation,  title: 'Map Directions',         desc: 'Turn-by-turn to the interview venue, with timing estimates.',  accent: 'from-violet-500/20 to-violet-500/0',color: 'bg-violet-500/10 text-violet-500' },
  { icon: Bell,        title: 'Instant Alerts',         desc: 'Real-time notifications when new drives match your profile.',  accent: 'from-rose-500/20 to-rose-500/0',    color: 'bg-rose-500/10 text-rose-500' },
  { icon: ShieldCheck, title: 'Verified Employers',     desc: 'Every posting is verified — no spam, no fake listings.',       accent: 'from-cyan-500/20 to-cyan-500/0',    color: 'bg-cyan-500/10 text-cyan-500' },
]

const empFeatures = [
  { icon: Clock3,  title: 'Post in Minutes',   desc: 'Quick & easy job posting',   color: 'text-amber-400',   bg: 'bg-amber-400/10' },
  { icon: MapPin,  title: 'Local Reach',       desc: 'Target candidates nearby',   color: 'text-blue-400',    bg: 'bg-blue-400/10' },
  { icon: Users,   title: 'Quality Talent',    desc: 'Verified job seekers',       color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: Zap,     title: 'Instant Visibility',desc: 'Go live after approval',     color: 'text-violet-400',  bg: 'bg-violet-400/10' },
]

export default function Home() {
  const { data: drives = [] } = useDrives()
  const priorityDrives = drives.filter((d) => d.is_priority).slice(0, 6)
  const whyStats = [
    { value: `${drives.length || 12}+`, label: 'Active drives',    icon: TrendingUp },
    { value: '120K',                    label: 'Job seekers',       icon: Users },
    { value: '500+',                    label: 'Hiring partners',   icon: Building2 },
    { value: '4.8★',                    label: 'Candidate rating',  icon: CheckCircle2 },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.14_0.05_265)] via-[oklch(0.18_0.06_260)] to-[oklch(0.12_0.04_265)]">
          {/* Glowing orbs */}
          <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[oklch(0.62_0.22_260/0.2)] blur-[120px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.55_0.22_260/0.15)] blur-[140px]" />
          <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[oklch(0.84_0.17_85/0.08)] blur-[100px]" />

          {/* Dot grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: 'radial-gradient(oklch(1_0_0/0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
            }}
          />

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-1.5 text-xs font-semibold text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {drives.length || 12} active walk-in drives live right now
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Walk in.{' '}
              <br className="hidden sm:block" />
              Walk out{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[oklch(0.75_0.2_260)] to-[oklch(0.62_0.22_260)] bg-clip-text text-transparent">
                  hired.
                </span>
                <span className="pointer-events-none absolute -inset-1 rounded-lg bg-[oklch(0.62_0.22_260/0.2)] blur-lg" />
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">
              India's <span className="text-white font-semibold">only</span> niche portal for walk-in interview drives —
              no internships, no freelance, no long waits.{' '}
              <span className="text-white font-semibold">Same-day results, every time.</span>
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/drives"
                className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.58_0.24_260)] shadow-[0_0_30px_oklch(0.62_0.22_260/0.5),inset_0_1px_0_oklch(1_0_0/0.3)] hover:shadow-[0_0_50px_oklch(0.62_0.22_260/0.7)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                Find a Drive <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/30 transition-all"
              >
                Create Free Account
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {['Verified employers', 'Updated daily', '100% free forever'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-sm text-white/50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t}
                </span>
              ))}
            </div>

            {/* Floating stat cards */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {whyStats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur p-4 text-center hover:bg-white/[0.08] transition-colors">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-xs text-white/50 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Partners Marquee ── */}
        <section id="partners" className="border-b border-border bg-gradient-to-b from-[oklch(0.97_0.01_255)] to-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest text-brand-blue uppercase">Hiring Partners</p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">India's top employers,<br className="hidden sm:block" /> all in one place.</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">Walk-in drives from trusted IT, banking and BPM companies — verified and updated daily.</p>
            </div>
            <div className="marquee-mask overflow-hidden">
              <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
                {[...partners, ...partners].map((name, i) => (
                  <div key={`${name}-${i}`} className="shrink-0 w-48 h-24 flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-4 hover:border-brand-blue/40 hover:shadow-[0_8px_24px_-8px_oklch(0.62_0.22_260/0.2)] transition-all">
                    <CompanyLogo name={name} size="marquee" className="border-0 rounded-none bg-transparent p-0" />
                    <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Drives ── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-brand-blue uppercase">Open Walk-In Drives</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">Show up. Get hired.</h2>
            </div>
            <Link
              to="/drives"
              className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary hover:border-brand-blue/30 transition-all"
            >
              Browse all drives <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {priorityDrives.map((d) => <DriveCard key={d.id} drive={d} />)}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              to="/drives"
              className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)] shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6),inset_0_1px_0_oklch(1_0_0/0.35)] ring-1 ring-[oklch(0.62_0.22_260/0.4)] hover:shadow-[0_18px_40px_-12px_oklch(0.62_0.22_260/0.7)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              View all walk-in drives
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* ── Why WalkinDrives ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[oklch(0.97_0.012_255)] via-[oklch(0.975_0.01_255)] to-[oklch(0.97_0.012_255)] border-y border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: 'radial-gradient(oklch(0.62_0.22_260/0.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            }}
          />
          <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-[oklch(0.62_0.22_260/0.07)] blur-[80px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <div className="mx-auto max-w-2xl text-center mb-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-blue uppercase">
                Why WalkinDrives
              </span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                Built for the way India{' '}
                <span className="bg-gradient-to-r from-brand-blue to-[oklch(0.55_0.22_260)] bg-clip-text text-transparent">
                  actually hires.
                </span>
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-lg mx-auto">
                Everything you need to land your next job — verified drives, real-time alerts and prep tools in one place.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_oklch(0.62_0.22_260/0.3)] hover:border-brand-blue/30"
                >
                  <div className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${f.accent} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative flex items-start justify-between">
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${f.color} ring-1 ring-current/20`}>
                      <f.icon className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-mono font-bold text-muted-foreground/40">0{i + 1}</span>
                  </div>
                  <h3 className="relative mt-5 text-[17px] font-bold text-foreground">{f.title}</h3>
                  <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className="relative mt-5 flex items-center gap-1 text-xs font-bold text-brand-blue opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Job Alerts CTA ── */}
        <section id="alerts" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-blue/20 bg-gradient-to-r from-brand-blue/5 via-[oklch(0.62_0.22_260/0.08)] to-brand-blue/5 p-10 sm:p-14 text-center">
            <div aria-hidden className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-[oklch(0.84_0.17_85/0.1)] blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 px-4 py-1.5 text-xs font-bold text-brand-blue uppercase tracking-widest">
                <Bell className="h-3.5 w-3.5" /> Never Miss a Drive
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground">Get instant job alerts</h2>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                New walk-in drives matching your profile, delivered to your inbox the moment they go live.
              </p>
              <Link
                to="/register"
                className="mt-8 group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)] shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.5),inset_0_1px_0_oklch(1_0_0/0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                Enable Job Alerts — Free <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Employer CTA ── */}
        <section id="recruiters" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[oklch(0.16_0.05_265)] via-[oklch(0.20_0.07_260)] to-[oklch(0.14_0.04_265)] p-10 sm:p-16 shadow-[0_40px_100px_-30px_oklch(0.62_0.22_260/0.4)]">
            <div aria-hidden className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-[oklch(0.62_0.22_260/0.25)] blur-[100px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-36 -right-24 h-96 w-96 rounded-full bg-[oklch(0.84_0.17_85/0.15)] blur-[120px]" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: 'linear-gradient(oklch(1_0_0/0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(1_0_0/0.5) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
              }}
            />

            <div className="relative">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1.5 text-xs font-bold tracking-widest text-brand-yellow uppercase">
                  For Employers
                </span>
                <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  Need to hire{' '}
                  <span className="bg-gradient-to-r from-brand-yellow to-[oklch(0.92_0.16_85)] bg-clip-text text-transparent">
                    fast?
                  </span>
                </h2>
                <p className="mt-4 text-white/60 max-w-xl mx-auto text-base">
                  Post your walk-in drive and reach local candidates instantly. No delays — find the right talent today.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {empFeatures.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur p-6 text-center hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className={`inline-grid h-12 w-12 place-items-center rounded-xl ${f.bg} ${f.color} mx-auto`}>
                      <f.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-sm font-bold text-white">{f.title}</h3>
                    <p className="mt-1 text-xs text-white/50">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-8">
                <Link
                  to="/post-drive"
                  className="group relative inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-brand-yellow-foreground bg-gradient-to-b from-brand-yellow to-[oklch(0.78_0.18_85)] shadow-[0_20px_50px_-12px_oklch(0.84_0.17_85/0.6),inset_0_1px_0_oklch(1_0_0/0.5)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  Post a Walk-In Drive — It's Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <div className="grid grid-cols-3 gap-10 sm:gap-16">
                  {[['48 hrs', 'Avg. time to hire'], ['95%', 'Verified applicants'], ['₹0', 'Posting fee']].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <p className="text-2xl sm:text-3xl font-bold text-white">{v}</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">{l}</p>
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
