import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, CheckCircle2, Briefcase, Search } from 'lucide-react'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Input } from '@/components/ui/Input'
import { CITIES } from '@/lib/mockData'

const googleProvider = new GoogleAuthProvider()

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate')
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', experience: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(user, { displayName: form.name })
      await setDoc(doc(db, 'users', user.uid), {
        email:      form.email,
        full_name:  form.name,
        phone:      form.phone,
        city:       form.city,
        experience: form.experience,
        is_admin:   false,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      // Create profile doc if first time
      const profileRef = doc(db, 'users', user.uid)
      await setDoc(profileRef, {
        email:      user.email ?? '',
        full_name:  user.displayName ?? '',
        is_admin:   false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { merge: true })
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign up failed.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* Visual side */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-[oklch(0.18_0.04_260)] via-[oklch(0.22_0.06_260)] to-[oklch(0.16_0.04_260)] px-16 relative overflow-hidden">
        <div aria-hidden className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[oklch(0.62_0.22_260/0.3)] blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[oklch(0.84_0.17_85/0.2)] blur-3xl" />
        <div className="relative max-w-md text-white">
          <div className="text-5xl font-bold leading-tight mb-8">
            Your next job<br />is one<br /><span className="text-brand-yellow">walk away.</span>
          </div>
          <ul className="space-y-4">
            {['Get notified instantly when new drives match your profile', 'Track all your applications in one dashboard', 'Free forever — no hidden fees or subscriptions'].map((t) => (
              <li key={t} className="flex items-start gap-3 text-white/70 text-sm">
                <CheckCircle2 className="h-5 w-5 text-brand-blue mt-0.5 shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src="/logos/logo.jpg" alt="Walkins" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-[22px] font-black tracking-[-0.04em] text-[oklch(0.13_0.04_264)]">Walkins</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Free forever. Choose your account type below.</p>

          {/* Role toggle */}
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-secondary p-1">
            {([
              { value: 'candidate', label: 'Job Seeker', icon: Search, sub: 'Find walk-in drives' },
              { value: 'recruiter', label: 'Recruiter / HR', icon: Briefcase, sub: 'Post & manage drives' },
            ] as const).map(({ value, label, icon: Icon, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex flex-col items-center gap-0.5 rounded-xl py-3 px-2 text-center transition-all ${
                  role === value
                    ? 'bg-card shadow-sm border border-border text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 mb-0.5 ${role === value ? 'text-brand-blue' : ''}`} />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[10px] text-muted-foreground">{sub}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleGoogle}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full Name" placeholder="Rahul Sharma" required value={form.name} onChange={set('name')} icon={<User className="h-4 w-4" />} />
              <Input label="Phone" placeholder="9876543210" value={form.phone} onChange={set('phone')} icon={<Phone className="h-4 w-4" />} />
            </div>
            <Input label="Email address" type="email" placeholder="you@example.com" required value={form.email} onChange={set('email')} icon={<Mail className="h-4 w-4" />} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select value={form.city} onChange={set('city')} className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40">
                    <option value="">Select city</option>
                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Experience</label>
                <select value={form.experience} onChange={set('experience')} className="w-full rounded-full border border-border bg-card py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue/40">
                  <option value="">Select</option>
                  {['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years'].map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" required value={form.password} onChange={set('password')} icon={<Lock className="h-4 w-4" />} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[34px] text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Input label="Confirm Password" type="password" placeholder="Re-enter password" required value={form.confirmPassword} onChange={set('confirmPassword')} icon={<Lock className="h-4 w-4" />} />

            {error && <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

            <label className="flex items-start gap-2.5 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 accent-[oklch(0.62_0.22_260)]" />
              I agree to the <Link to="/terms" className="text-brand-blue hover:underline">Terms of Use</Link> and <Link to="/privacy" className="text-brand-blue hover:underline">Privacy Policy</Link>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-primary-foreground bg-gradient-to-b from-[oklch(0.68_0.2_258)] to-[oklch(0.62_0.22_260)] shadow-[0_10px_30px_-10px_oklch(0.62_0.22_260/0.6),inset_0_1px_0_oklch(1_0_0/0.35)] ring-1 ring-[oklch(0.62_0.22_260/0.4)] hover:shadow-[0_18px_40px_-12px_oklch(0.62_0.22_260/0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60"
            >
              <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              {loading ? 'Creating account…' : 'Create Free Account'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-blue hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
