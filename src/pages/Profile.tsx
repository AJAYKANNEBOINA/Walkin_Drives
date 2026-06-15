import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Phone, MapPin, Briefcase, Save, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { fetchProfile, updateProfile } from '@/lib/api/profiles'
import { CITIES, EXPERIENCES } from '@/lib/mockData'

export default function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({ full_name: '', phone: '', city: '', experience: '' })

  useEffect(() => {
    if (!user) return
    fetchProfile(user.uid).then(profile => {
      if (profile) {
        setForm({
          full_name:  profile.full_name ?? '',
          phone:      (profile as any).phone      ?? '',
          city:       (profile as any).city       ?? '',
          experience: (profile as any).experience ?? '',
        })
      }
      setLoading(false)
    })
  }, [user])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true); setError('')
    try {
      await updateProfile(user.uid, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[oklch(0.99_0.003_250)]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-[oklch(0.50_0.022_258)]">Please log in to view your profile.</p>
            <Link to="/login" className="mt-3 inline-block text-brand-blue font-semibold hover:underline">Sign In</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.99_0.003_250)]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">

          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-[oklch(0.50_0.022_258)] hover:text-brand-blue mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-8">
            <span className="h-14 w-14 rounded-full bg-brand-blue flex items-center justify-center text-white text-xl font-bold shrink-0">
              {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
            </span>
            <div>
              <h1 className="text-xl font-bold text-[oklch(0.13_0.04_264)]">{user.displayName ?? 'My Profile'}</h1>
              <p className="text-sm text-[oklch(0.50_0.022_258)]">{user.email}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-[oklch(0.50_0.022_258)]">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">

              {/* Personal */}
              <div className="bg-white rounded-xl border border-[oklch(0.905_0.01_255)] p-6">
                <h2 className="text-sm font-bold text-[oklch(0.13_0.04_264)] mb-5 flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-blue" /> Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name" placeholder="Rahul Sharma" value={form.full_name} onChange={set('full_name')} icon={<User className="h-4 w-4" />} />
                  <Input label="Phone Number" placeholder="9876543210" value={form.phone} onChange={set('phone')} icon={<Phone className="h-4 w-4" />} />
                </div>
              </div>

              {/* Job prefs */}
              <div className="bg-white rounded-xl border border-[oklch(0.905_0.01_255)] p-6">
                <h2 className="text-sm font-bold text-[oklch(0.13_0.04_264)] mb-5 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-blue" /> Job Preferences
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[oklch(0.13_0.04_264)] mb-1.5 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Preferred City</label>
                    <select value={form.city} onChange={set('city')} className="w-full rounded-lg border border-[oklch(0.905_0.01_255)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40">
                      <option value="">Select city</option>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[oklch(0.13_0.04_264)] mb-1.5 flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />Experience</label>
                    <select value={form.experience} onChange={set('experience')} className="w-full rounded-lg border border-[oklch(0.905_0.01_255)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40">
                      <option value="">Select experience</option>
                      {EXPERIENCES.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

              <div className="flex justify-end">
                <button type="submit" disabled={saving} className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors ${saved ? 'bg-emerald-500' : 'bg-brand-blue hover:bg-[oklch(0.56_0.22_262)]'} disabled:opacity-60`}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> :
                   saved  ? <><CheckCircle2 className="h-4 w-4" />Saved!</> :
                            <><Save className="h-4 w-4" />Save Changes</>}
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
