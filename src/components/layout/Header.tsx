import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, BellRing, Globe2, ExternalLink, Menu, X, LogOut, LayoutDashboard, ChevronDown, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Header() {
  const { user, isAdmin, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logos/logo.jpg" alt="WalkinDrives" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-[17px] font-bold text-foreground tracking-tight">WalkinDrives<span className="text-brand-blue">.in</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-foreground/80">
          <Link to="/drives" className="group flex items-center gap-2 hover:text-foreground transition-colors">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-foreground/80 text-foreground transition group-hover:bg-foreground group-hover:text-background">
              <Briefcase className="h-4 w-4" strokeWidth={2} />
            </span>
            Walk-in Drives
          </Link>
          <Link to="/job-alerts" className="group flex items-center gap-2 hover:text-foreground transition-colors">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-foreground/80 text-foreground transition group-hover:bg-foreground group-hover:text-background">
              <BellRing className="h-4 w-4" strokeWidth={2} />
            </span>
            Job Alerts
          </Link>
          <Link to="/blogs" className="group flex items-center gap-2 hover:text-foreground transition-colors">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-foreground/80 text-foreground transition group-hover:bg-foreground group-hover:text-background">
              <Globe2 className="h-4 w-4" strokeWidth={2} />
            </span>
            Blogs
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <Link
            to="/post-drive"
            className="hidden sm:inline-flex items-center rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-yellow-foreground shadow-sm hover:brightness-95 transition"
          >
            Post a Drive
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-primary-foreground text-xs font-bold">
                  {(user.user_metadata?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate">{user.user_metadata?.full_name ?? user.email?.split('@')[0]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-border bg-card shadow-lg py-1 overflow-hidden">
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue/5 transition-colors">
                      <ShieldCheck className="h-4 w-4" /> Admin Panel
                    </Link>
                  )}
                  <div className="my-1 border-t border-border" />
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
              >
                Login
              </Link>
              <a href="#recruiters" className="hidden lg:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                For Recruiters <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          <Link to="/drives" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Briefcase className="h-4 w-4" /> Walk-in Drives
          </Link>
          <Link to="/blogs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Globe2 className="h-4 w-4" /> Blogs
          </Link>
          <Link to="/post-drive" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-yellow-foreground bg-brand-yellow/20 hover:bg-brand-yellow/30 transition-colors">
            Post a Drive
          </Link>
          <div className="border-t border-border pt-3 mt-3 flex gap-2">
            {user ? (
              <div className="flex flex-col gap-2 w-full">
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-full border border-brand-blue/30 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/5 transition-colors">
                    <ShieldCheck className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <button onClick={handleSignOut} className="rounded-full border border-destructive/30 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-full border border-border py-2 text-center text-sm font-semibold text-foreground hover:bg-secondary">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-full bg-brand-blue py-2 text-center text-sm font-semibold text-primary-foreground">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
