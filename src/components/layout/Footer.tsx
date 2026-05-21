import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

const cols = [
  { title: 'Company',     links: ['About Us', 'Careers', 'Press', 'Contact Us'] },
  { title: 'Job Seekers', links: ['All Walk-ins', 'By Category', 'By Location', 'Job Alerts', 'Resume Builder'] },
  { title: 'Employers',   links: ['Post a Walk-in', 'Pricing', 'Bulk Hiring', 'For Recruiters'] },
  { title: 'Resources',   links: ['Blog', 'Help Center', 'Privacy Policy', 'Terms of Use'] },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue text-primary-foreground font-black text-sm">W</span>
              <span className="text-[15px] font-bold text-foreground tracking-tight">WalkinDrives<span className="text-brand-blue">.in</span></span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              India's only niche portal exclusively for walk-in interview drives — verified, updated daily, 100% free.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-brand-blue hover:border-brand-blue/40 transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{c.title}</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="hover:text-brand-blue transition">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© 2026 WalkinDrives.in — All rights reserved.</p>
          <p>Made with care for India's hiring community</p>
        </div>
      </div>
    </footer>
  )
}
