import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Instagram, ArrowRight } from 'lucide-react'

const links = [
  {
    title: 'For Job Seekers',
    items: [
      { label: 'Browse Walk-ins',   to: '/drives'     },
      { label: 'Job Alerts',        to: '/job-alerts' },
      { label: 'IT / Tech Drives',  to: '/drives'     },
      { label: 'BFSI Drives',       to: '/drives'     },
      { label: 'BPO / Voice',       to: '/drives'     },
    ],
  },
  {
    title: 'For Employers',
    items: [
      { label: 'Post a Walk-in Drive', to: '/post-drive' },
      { label: 'How It Works',         to: '/'           },
      { label: 'Bulk Hiring',          to: '/post-drive' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Us',       to: '/'      },
      { label: 'Blog',           to: '/blogs' },
      { label: 'Contact Us',     to: '/'      },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Use',   to: '/terms'   },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-[oklch(0.905_0.01_255)]">

      {/* Newsletter strip */}
      <div className="bg-[oklch(0.975_0.005_250)] border-b border-[oklch(0.905_0.01_255)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-bold text-[oklch(0.13_0.04_264)]">Get daily walk-in alerts in your inbox</p>
            <p className="text-sm text-[oklch(0.50_0.022_258)] mt-0.5">No spam. Unsubscribe anytime.</p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-60 rounded-lg border border-[oklch(0.905_0.01_255)] bg-white px-4 py-2.5 text-sm text-[oklch(0.13_0.04_264)] placeholder:text-[oklch(0.60_0.018_258)] focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
            />
            <Link
              to="/job-alerts"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors shrink-0"
            >
              Subscribe <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logos/logo.jpg" alt="Walkins" className="h-8 w-8 rounded-lg object-contain" />
              <span className="text-[20px] font-black tracking-[-0.04em] text-[oklch(0.13_0.04_264)]">
                Walkins
              </span>
            </Link>
            <p className="mt-4 text-sm text-[oklch(0.50_0.022_258)] leading-relaxed max-w-[220px]">
              India's only dedicated portal for walk-in interview drives. Verified, updated daily, 100% free.
            </p>
            <div className="mt-5 flex gap-2">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-8 w-8 place-items-center rounded-lg border border-[oklch(0.905_0.01_255)] text-[oklch(0.50_0.022_258)] hover:text-brand-blue hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {links.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold tracking-widest text-[oklch(0.13_0.04_264)] uppercase mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-[oklch(0.50_0.022_258)] hover:text-brand-blue transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[oklch(0.905_0.01_255)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[oklch(0.60_0.018_258)]">
            © 2026 Walkins · All rights reserved
          </p>
          <div className="flex items-center gap-4 text-xs text-[oklch(0.60_0.018_258)]">
            <Link to="/privacy" className="hover:text-brand-blue transition-colors">Privacy</Link>
            <Link to="/terms"   className="hover:text-brand-blue transition-colors">Terms</Link>
            <Link to="/blogs"   className="hover:text-brand-blue transition-colors">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
