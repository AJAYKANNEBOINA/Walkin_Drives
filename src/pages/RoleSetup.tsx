import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Search, ArrowRight, CheckCircle2 } from 'lucide-react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

const roles = [
  {
    value: 'candidate',
    icon: Search,
    title: 'Job Seeker',
    desc: 'I\'m looking for walk-in drive opportunities near me.',
    bullets: ['Get instant job alerts', 'Track all applications', 'One-click apply'],
    color: 'from-[oklch(0.62_0.22_260)] to-[oklch(0.55_0.22_260)]',
  },
  {
    value: 'recruiter',
    icon: Briefcase,
    title: 'Recruiter / HR',
    desc: 'I want to post walk-in drives and hire candidates.',
    bullets: ['Post drives for free', 'Manage applicants', 'Send shortlist emails'],
    color: 'from-[oklch(0.58_0.18_160)] to-[oklch(0.50_0.18_160)]',
  },
] as const

export default function RoleSetup() {
  const { user, refreshRole } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<'candidate' | 'recruiter' | null>(null)
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    if (!selected || !user) return
    setSaving(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        role:       selected,
        email:      user.email ?? '',
        full_name:  user.displayName ?? '',
        updated_at: new Date().toISOString(),
      }, { merge: true })
      await refreshRole()
      navigate('/dashboard')
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <img src="/logos/logo.jpg" alt="Walkins" className="h-9 w-9 rounded-xl object-contain" />
        <span className="text-[22px] font-black tracking-[-0.04em] text-foreground">Walkins</span>
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.displayName?.split(' ')[0] ?? 'there'}!</h1>
          <p className="mt-2 text-muted-foreground text-sm">Tell us what you're here for so we can set up the right experience.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {roles.map(({ value, icon: Icon, title, desc, bullets, color }) => {
            const isSelected = selected === value
            return (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={`relative text-left rounded-2xl border-2 p-6 transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-blue shadow-[0_0_0_4px_oklch(0.62_0.22_260/0.15)]'
                    : 'border-border hover:border-brand-blue/40 hover:-translate-y-0.5'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="h-5 w-5 text-brand-blue" />
                  </div>
                )}
                <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${color} text-white mb-4 shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4 leading-relaxed">{desc}</p>
                <ul className="space-y-1.5">
                  {bullets.map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selected || saving}
            className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-10 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6)] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'Setting up…' : 'Continue'}
            {!saving && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">You can always change this later in your profile settings.</p>
      </div>
    </div>
  )
}
