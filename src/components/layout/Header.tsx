import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Briefcase, BellRing, BookOpen, Menu, X, LogOut, LayoutDashboard, ChevronDown, ShieldCheck, PenSquare } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const NAV = [
  { to: '/drives',     label: 'Find Drives',  icon: Briefcase },
  { to: '/job-alerts', label: 'Job Alerts',   icon: BellRing  },
  { to: '/blogs',      label: 'Blog',         icon: BookOpen  },
]

export function Header() {
  const { user, isAdmin, signOut } = useAuth()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await signOut()
    navigate('/')
  }

  const initials = (user?.displayName ?? user?.email ?? 'U')[0].toUpperCase()
  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? ''

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[oklch(0.905_0.01_255)] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logos/logo.jpg" alt="Walkins" className="h-9 w-9 rounded-xl object-contain" />
          <span className="text-[21px] font-black tracking-[-0.04em] text-[oklch(0.13_0.04_264)]">
            Walkins
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={[
                  'relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'text-brand-blue bg-brand-blue/8'
                    : 'text-[oklch(0.42_0.022_258)] hover:text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)]',
                ].join(' ')}
              >
                {label}
                {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-brand-blue" />}
              </Link>
            )
          })}
        </nav>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            to="/post-drive"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[oklch(0.905_0.01_255)] bg-white px-3.5 py-2 text-sm font-semibold text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] hover:border-brand-blue/30 transition-all"
          >
            <PenSquare className="h-3.5 w-3.5" />
            Post a Drive
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-[oklch(0.905_0.01_255)] bg-white px-2.5 py-1.5 text-sm font-medium text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition-all"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-white text-[11px] font-bold shrink-0">
                  {initials}
                </span>
                <span className="max-w-[96px] truncate text-sm">{displayName}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-[oklch(0.50_0.022_258)] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-52 rounded-xl border border-[oklch(0.905_0.01_255)] bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[oklch(0.965_0.007_252)]">
                      <p className="text-xs font-semibold text-[oklch(0.13_0.04_264)] truncate">{displayName}</p>
                      <p className="text-xs text-[oklch(0.50_0.022_258)] truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.975_0.005_250)] transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-[oklch(0.50_0.022_258)]" /> Dashboard
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue/5 transition-colors">
                          <ShieldCheck className="h-4 w-4" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-[oklch(0.965_0.007_252)] py-1">
                      <button onClick={handleSignOut} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3.5 py-2 text-sm font-medium text-[oklch(0.42_0.022_258)] hover:text-[oklch(0.13_0.04_264)] transition-colors">
                Log in
              </Link>
              <Link to="/register" className="inline-flex items-center rounded-lg bg-brand-blue px-3.5 py-2 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors shadow-sm">
                Sign up free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[oklch(0.965_0.007_252)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[oklch(0.905_0.01_255)] bg-white px-4 py-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition-colors"
            >
              <Icon className="h-4 w-4 text-[oklch(0.50_0.022_258)]" /> {label}
            </Link>
          ))}
          <Link to="/post-drive" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition-colors">
            <PenSquare className="h-4 w-4 text-[oklch(0.50_0.022_258)]" /> Post a Drive
          </Link>

          <div className="pt-3 mt-1 border-t border-[oklch(0.905_0.01_255)] flex gap-2">
            {user ? (
              <div className="flex flex-col gap-2 w-full">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-lg border border-[oklch(0.905_0.01_255)] py-2.5 text-sm font-semibold text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition-colors">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button onClick={handleSignOut} className="rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-[oklch(0.905_0.01_255)] py-2.5 text-center text-sm font-semibold text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)]">Log in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-brand-blue py-2.5 text-center text-sm font-semibold text-white">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
