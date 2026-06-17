import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Clock, Users, CheckCircle2, ArrowRight, Briefcase } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { CITIES, EXPERIENCES, MODES } from '@/lib/mockData'
import { usePostDrive } from '@/hooks/useDrives'
import { useAuth } from '@/context/AuthContext'

export default function PostDrive() {
  const { user } = useAuth()
  const postDriveMutation = usePostDrive()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    company: '', contactEmail: '', role: '', location: '', city: '',
    experience: '', eligibility: '', salary: '', mode: 'Onsite' as const,
    driveDate: '', driveTime: '', openings: '', description: '', skills: '',
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postDriveMutation.mutateAsync({
        payload: form,
        userId: user?.uid ?? '',
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Post drive failed:', err)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.62_0.22_260)] to-[oklch(0.55_0.22_260)] text-primary-foreground shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6)] mb-6">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Drive Submitted!</h1>
            <p className="mt-3 text-muted-foreground">Your walk-in drive has been submitted for review. We'll verify and publish it within 2 hours.</p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/drives"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)] shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6),inset_0_1px_0_oklch(1_0_0/0.35)] ring-1 ring-[oklch(0.62_0.22_260/0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                Browse All Drives <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-full border border-border bg-background px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Post Another Drive
              </button>
            </div>
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
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">

          {/* Page header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
              FOR EMPLOYERS
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Post a Walk-in Drive</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Reach thousands of verified candidates in your city. Free, fast, and verified.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[['₹0', 'Posting fee'], ['2 hrs', 'Go live in'], ['1,000+', 'Avg. candidates reached']].map(([v, l]) => (
              <div key={l} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.2)]">
                <p className="text-2xl font-bold text-brand-blue">{v}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <Section icon={<Briefcase className="h-5 w-5" />} title="Company Information">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Company Name *" placeholder="e.g. Infosys BPM" required value={form.company} onChange={set('company')} />
                <Input label="Contact Email *" type="email" placeholder="hr@company.com" required value={form.contactEmail} onChange={set('contactEmail')} />
              </div>
            </Section>

            <Section icon={<Users className="h-5 w-5" />} title="Drive Details">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Job Role / Position *" placeholder="e.g. Java Developer" required value={form.role} onChange={set('role')} />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Experience Required *</label>
                  <select required value={form.experience} onChange={set('experience')} className="w-full rounded-full border border-border bg-card py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40">
                    <option value="">Select experience</option>
                    {EXPERIENCES.map((e) => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <Input label="Eligibility" placeholder="e.g. B.E / B.Tech / MCA" value={form.eligibility} onChange={set('eligibility')} />
                <Input label="Salary / CTC" placeholder="e.g. ₹4 - 8 LPA" value={form.salary} onChange={set('salary')} />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Work Mode *</label>
                  <div className="flex gap-3">
                    {MODES.map((m) => (
                      <label
                        key={m}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold cursor-pointer transition-colors ${form.mode === m ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-border text-muted-foreground hover:border-brand-blue/40 hover:text-brand-blue'}`}
                      >
                        <input type="radio" name="mode" value={m} checked={form.mode === m} onChange={set('mode')} className="sr-only" />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
                <Input label="No. of Openings" type="number" placeholder="e.g. 25" value={form.openings} onChange={set('openings')} />
                <Input label="Skills Required" placeholder="Java, Spring Boot, SQL (comma separated)" value={form.skills} onChange={set('skills')} />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-1.5">Job Description</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={4}
                  placeholder="Describe the role, responsibilities and what you're looking for in a candidate…"
                  className="w-full rounded-2xl border border-border bg-card py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40 resize-none"
                />
              </div>
            </Section>

            <Section icon={<MapPin className="h-5 w-5" />} title="Venue & Timing">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                  <select required value={form.city} onChange={set('city')} className="w-full rounded-full border border-border bg-card py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40">
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Full Address *" placeholder="Building, Area, City" required value={form.location} onChange={set('location')} icon={<MapPin className="h-4 w-4" />} />
                <Input label="Drive Date *" type="date" required value={form.driveDate} onChange={set('driveDate')} icon={<Calendar className="h-4 w-4" />} />
                <Input label="Timing *" placeholder="e.g. 10:00 AM – 4:00 PM" required value={form.driveTime} onChange={set('driveTime')} icon={<Clock className="h-4 w-4" />} />
              </div>
            </Section>

            {postDriveMutation.isError && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {(postDriveMutation.error as Error)?.message ?? 'Something went wrong. Please try again.'}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={postDriveMutation.isPending}
                className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)] shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6),inset_0_1px_0_oklch(1_0_0/0.35)] ring-1 ring-[oklch(0.62_0.22_260/0.4)] hover:shadow-[0_18px_40px_-12px_oklch(0.62_0.22_260/0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60"
              >
                <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                {postDriveMutation.isPending ? 'Submitting…' : 'Submit Drive for Review'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.62_0.22_260)] to-[oklch(0.55_0.22_260)] text-primary-foreground shadow-[0_8px_20px_-8px_oklch(0.62_0.22_260/0.5)] ring-1 ring-white/10">
          {icon}
        </span>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  )
}
