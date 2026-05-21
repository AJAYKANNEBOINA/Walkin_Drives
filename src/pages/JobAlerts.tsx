import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, BellOff, CheckCircle2, MapPin, Briefcase, Monitor,
  Tag, Loader2, ArrowRight, Trash2, BellRing,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAuth } from '@/context/AuthContext'
import { useMyAlert, useSaveAlert, useDeleteAlert } from '@/hooks/useAlerts'
import { CITIES, EXPERIENCES, MODES } from '@/lib/mockData'

export default function JobAlerts() {
  const { user } = useAuth()

  const { data: existing, isLoading } = useMyAlert(user?.id)
  const save   = useSaveAlert()
  const remove = useDeleteAlert()

  const [saved, setSaved]           = useState(false)
  const [email, setEmail]           = useState(user?.email ?? '')
  const [cities, setCities]         = useState<string[]>([])
  const [experience, setExperience] = useState('')
  const [mode, setMode]             = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords]     = useState<string[]>([])

  // Pre-fill form if alert exists
  useEffect(() => {
    if (existing) {
      setEmail(existing.email)
      setCities(existing.cities ?? [])
      setExperience(existing.experience ?? '')
      setMode(existing.mode ?? '')
      setKeywords(existing.keywords ?? [])
    }
  }, [existing])

  const toggleCity = (city: string) =>
    setCities((prev) => prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city])

  const addKeyword = () => {
    const kw = keywordInput.trim()
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw])
    }
    setKeywordInput('')
  }

  const removeKeyword = (kw: string) =>
    setKeywords((prev) => prev.filter((k) => k !== kw))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    await save.mutateAsync({ payload: { email, cities, experience, mode, keywords }, userId: user.id })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDelete = async () => {
    if (!existing || !user) return
    await remove.mutateAsync({ alertId: existing.id, userId: user.id })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <BellRing className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground">Login to Set Up Alerts</h1>
            <p className="text-sm text-muted-foreground mt-2">You need an account to receive job alerts.</p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white">
              Sign In <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[oklch(0.14_0.05_265)] via-[oklch(0.18_0.06_260)] to-[oklch(0.12_0.04_265)]">
          <div aria-hidden className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[oklch(0.62_0.22_260/0.2)] blur-[100px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[oklch(0.84_0.17_85/0.1)] blur-[100px]" />
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/15">
              <Bell className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Job Alerts</h1>
            <p className="mt-3 text-white/60 max-w-md mx-auto text-sm leading-relaxed">
              Get an email the moment a new walk-in drive matches your preferences — no more checking manually.
            </p>
            {existing && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Alert active — you'll be notified at {existing.email}
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading your alert…
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.62_0.22_260)] to-[oklch(0.55_0.22_260)] text-white">
                    <Bell className="h-4 w-4" />
                  </span>
                  <h2 className="font-semibold text-foreground">Notification Email</h2>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-full border border-border bg-background py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                />
                <p className="mt-2 text-xs text-muted-foreground">We'll send drive alerts to this email address.</p>
              </div>

              {/* Cities */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-foreground">Preferred Cities</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Leave empty to get alerts for all cities</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => toggleCity(city)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        cities.includes(city)
                          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                          : 'border-border text-muted-foreground hover:border-brand-blue/40 hover:text-brand-blue'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience & Mode */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-foreground">Experience & Work Mode</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Leave blank to match any</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Experience</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full rounded-full border border-border bg-background py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                    >
                      <option value="">Any experience</option>
                      {EXPERIENCES.map((e) => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Work Mode</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      className="w-full rounded-full border border-border bg-background py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                    >
                      <option value="">Any mode</option>
                      {MODES.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 text-violet-600">
                    <Tag className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-foreground">Role Keywords</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Match drives that contain these words in the job title</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
                    placeholder="e.g. Java, BPO, Analyst…"
                    className="flex-1 rounded-full border border-border bg-background py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
                  />
                  <button
                    type="button"
                    onClick={addKeyword}
                    className="rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white hover:brightness-110 transition"
                  >
                    Add
                  </button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((kw) => (
                      <span key={kw} className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                        {kw}
                        <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500 transition">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {keywords.length === 0 && (
                  <p className="text-xs text-muted-foreground">No keywords added — you'll receive alerts for all matching drives.</p>
                )}
              </div>

              {/* Save / Delete */}
              {save.isError && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {(save.error as Error)?.message ?? 'Something went wrong. Please try again.'}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-1">
                {existing ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={remove.isPending}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                  >
                    {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellOff className="h-4 w-4" />}
                    Disable Alert
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  disabled={save.isPending}
                  className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)] shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6),inset_0_1px_0_oklch(1_0_0/0.35)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
                >
                  <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                  {save.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  ) : saved ? (
                    <><CheckCircle2 className="h-4 w-4" /> Saved!</>
                  ) : (
                    <><Bell className="h-4 w-4" /> {existing ? 'Update Alert' : 'Enable Alert'}</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
