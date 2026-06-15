import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, SlidersHorizontal, X, Loader2, ArrowUpDown, ChevronRight, ArrowUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DriveCard } from '@/components/drives/DriveCard'
import { DriveFilters } from '@/components/drives/DriveFilters'
import { useDrives } from '@/hooks/useDrives'
import type { Drive, FilterState } from '@/types'

const defaultFilters: FilterState = {
  query: '', cities: [], experience: '', mode: '', salary: '', category: '', sort: 'date', dateRange: 'all',
}

const CATEGORIES = [
  { label: 'All Drives',   value: '',        emoji: '🔍' },
  { label: 'Freshers',     value: 'freshers',emoji: '🎓' },
  { label: 'Experienced',  value: 'exp',     emoji: '💼' },
  { label: 'Today',        value: 'today',   emoji: '⚡' },
  { label: 'IT / Tech',    value: 'it',      emoji: '💻' },
  { label: 'BFSI',         value: 'bfsi',    emoji: '🏦' },
  { label: 'BPO / Voice',  value: 'bpo',     emoji: '🎧' },
  { label: 'Finance',      value: 'finance', emoji: '📊' },
]

const SORT_OPTIONS = [
  { label: 'Walk-in Date',     value: 'date'     },
  { label: 'Most Recent',      value: 'recent'   },
  { label: 'Salary (Highest)', value: 'salary'   },
  { label: 'Company (A–Z)',    value: 'company'  },
  { label: 'Openings (Most)',  value: 'openings' },
]

function applyCategory(drives: Drive[], category: string): Drive[] {
  const today = new Date().toISOString().split('T')[0]
  switch (category) {
    case 'freshers': return drives.filter(d => d.experience.startsWith('0'))
    case 'exp':      return drives.filter(d => !d.experience.startsWith('0'))
    case 'today':    return drives.filter(d => d.drive_date === today)
    case 'it':       return drives.filter(d => /developer|engineer|software|tech|data|cloud|devops|python|java|react|node/i.test(d.role))
    case 'bfsi':     return drives.filter(d => d.company.industry === 'BFSI' || /bank|insurance|finance|credit|loan/i.test(d.role))
    case 'bpo':      return drives.filter(d => d.company.industry === 'BPM' || /customer|support|voice|bpo/i.test(d.role))
    case 'finance':  return drives.filter(d => /accountant|analyst|finance|accounts|audit|tax/i.test(d.role))
    default:         return drives
  }
}

function applySorting(drives: Drive[], sort: string): Drive[] {
  const arr = [...drives]
  switch (sort) {
    case 'date':     return arr.sort((a, b) => a.drive_date.localeCompare(b.drive_date))
    case 'recent':   return arr.sort((a, b) => b.created_at.localeCompare(a.created_at))
    case 'salary':   return arr.sort((a, b) => (parseInt(b.salary?.replace(/\D/g,'')??'0')||0) - (parseInt(a.salary?.replace(/\D/g,'')??'0')||0))
    case 'company':  return arr.sort((a, b) => a.company.name.localeCompare(b.company.name))
    case 'openings': return arr.sort((a, b) => (b.openings ?? 0) - (a.openings ?? 0))
    default:         return arr
  }
}

export default function Drives() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data: rawDrives = [], isLoading } = useDrives({
    query: filters.query, cities: filters.cities, experience: filters.experience, mode: filters.mode,
  })

  const today = new Date().toISOString().split('T')[0]

  const stats = useMemo(() => ({
    total:     rawDrives.length,
    today:     rawDrives.filter(d => d.drive_date === today).length,
    freshers:  rawDrives.filter(d => d.experience.startsWith('0')).length,
    companies: new Set(rawDrives.map(d => d.company.name)).size,
  }), [rawDrives, today])

  const drives = useMemo(() => {
    const cat = applyCategory(rawDrives, filters.category)
    const sorted = applySorting(cat, filters.sort).filter(d => d.drive_date >= today)

    if (filters.dateRange === 'today') return sorted.filter(d => d.drive_date === today)
    if (filters.dateRange === 'week') {
      const weekEnd = new Date()
      weekEnd.setDate(weekEnd.getDate() + 7)
      const weekEndStr = weekEnd.toISOString().split('T')[0]
      return sorted.filter(d => d.drive_date <= weekEndStr)
    }
    if (filters.dateRange === 'month') {
      const monthEnd = new Date()
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      const monthEndStr = monthEnd.toISOString().split('T')[0]
      return sorted.filter(d => d.drive_date <= monthEndStr)
    }
    return sorted
  }, [rawDrives, filters.category, filters.sort, filters.dateRange, today])

  const activeTags = [
    ...filters.cities.map(c => ({ label: c, clear: () => setFilters(f => ({ ...f, cities: f.cities.filter(x => x !== c) })) })),
    ...(filters.experience ? [{ label: filters.experience, clear: () => setFilters(f => ({ ...f, experience: '' })) }] : []),
    ...(filters.mode       ? [{ label: filters.mode,       clear: () => setFilters(f => ({ ...f, mode: '' }))       }] : []),
  ]

  const currentSort = SORT_OPTIONS.find(o => o.value === filters.sort)

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.003_250)] flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Page header */}
        <section className="bg-white border-b border-[oklch(0.905_0.01_255)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-1.5 text-sm text-[oklch(0.50_0.022_258)] mb-5">
              <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-[oklch(0.13_0.04_264)] font-medium">Walk-in Drives</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[oklch(0.13_0.04_264)]">Walk-in Interview Drives</h1>
            <p className="mt-1.5 text-sm text-[oklch(0.50_0.022_258)]">
              Find verified same-day hiring events near you
            </p>

            {/* Search */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.60_0.018_258)]" />
                <input
                  value={filters.query}
                  onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
                  placeholder="Role, company or skill"
                  className="w-full rounded-lg border border-[oklch(0.905_0.01_255)] bg-white pl-10 pr-4 py-2.5 text-sm text-[oklch(0.13_0.04_264)] placeholder:text-[oklch(0.60_0.018_258)] focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50"
                />
              </div>
              <div className="relative sm:w-52">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.60_0.018_258)]" />
                <input
                  placeholder="City"
                  onChange={e => setFilters(f => ({ ...f, cities: e.target.value ? [e.target.value] : [] }))}
                  className="w-full rounded-lg border border-[oklch(0.905_0.01_255)] bg-white pl-10 pr-4 py-2.5 text-sm text-[oklch(0.13_0.04_264)] placeholder:text-[oklch(0.60_0.018_258)] focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50"
                />
              </div>
              <button
                className="sm:hidden flex items-center justify-center gap-2 rounded-lg border border-[oklch(0.905_0.01_255)] bg-white px-4 py-2.5 text-sm font-semibold text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition-colors"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeTags.length > 0 && (
                  <span className="rounded-full bg-brand-blue text-white text-xs w-5 h-5 flex items-center justify-center font-bold">{activeTags.length}</span>
                )}
              </button>
              <button className="hidden sm:inline-flex items-center rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition-colors">
                Search
              </button>
            </div>

            {/* Active tags */}
            {activeTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeTags.map(tag => (
                  <button key={tag.label} onClick={tag.clear} className="flex items-center gap-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-brand-blue px-3 py-1 text-xs font-semibold hover:bg-brand-blue/10 transition-colors">
                    {tag.label} <X className="h-3 w-3" />
                  </button>
                ))}
                <button onClick={() => setFilters(defaultFilters)} className="text-xs text-[oklch(0.50_0.022_258)] hover:text-red-500 transition-colors px-1">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Stats strip */}
          <div className="border-t border-[oklch(0.905_0.01_255)] bg-[oklch(0.975_0.005_250)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
              <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
                {[
                  { label: 'Active drives',    value: stats.total     },
                  { label: "Today's walk-ins", value: stats.today     },
                  { label: 'Fresher roles',    value: stats.freshers  },
                  { label: 'Companies hiring', value: stats.companies },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-1.5 shrink-0 text-sm">
                    <span className="font-bold text-[oklch(0.13_0.04_264)]">{value}</span>
                    <span className="text-[oklch(0.55_0.020_258)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category chips */}
          <div className="border-t border-[oklch(0.905_0.01_255)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
              {CATEGORIES.map(cat => {
                const count = cat.value === '' ? rawDrives.filter(d => d.drive_date >= today).length : applyCategory(rawDrives.filter(d => d.drive_date >= today), cat.value).length
                return (
                  <button
                    key={cat.value}
                    onClick={() => setFilters(f => ({ ...f, category: cat.value }))}
                    className={[
                      'shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all border',
                      filters.category === cat.value
                        ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                        : 'border-[oklch(0.905_0.01_255)] text-[oklch(0.42_0.022_258)] hover:border-brand-blue/30 hover:text-[oklch(0.13_0.04_264)] bg-white',
                    ].join(' ')}
                  >
                    {cat.emoji} {cat.label}
                    <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${filters.category === cat.value ? 'bg-white/20 text-white' : 'bg-[oklch(0.93_0.007_255)] text-[oklch(0.50_0.022_258)]'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Content */}
        <section>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[256px_1fr] gap-7">

            {/* Sidebar */}
            <div className="hidden lg:block">
              <DriveFilters filters={filters} onChange={setFilters} />
            </div>

            {/* Results */}
            <div>
              {/* Date filter tabs */}
              <div className="flex items-center gap-2 mb-5 border-b border-[oklch(0.905_0.01_255)] pb-4">
                {[
                  { label: 'All Dates',  value: 'all'   },
                  { label: 'Today',      value: 'today' },
                  { label: 'This Week',  value: 'week'  },
                  { label: 'This Month', value: 'month' },
                ].map(tab => (
                  <button
                    key={tab.value}
                    onClick={() => setFilters(f => ({ ...f, dateRange: tab.value }))}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      filters.dateRange === tab.value
                        ? 'bg-[oklch(0.13_0.04_264)] text-white border-[oklch(0.13_0.04_264)]'
                        : 'bg-white text-[oklch(0.42_0.022_258)] border-[oklch(0.905_0.01_255)] hover:border-[oklch(0.80_0.01_258)] hover:text-[oklch(0.13_0.04_264)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  {!isLoading && (
                    <p className="text-sm text-[oklch(0.50_0.022_258)]">
                      Showing <span className="font-semibold text-[oklch(0.13_0.04_264)]">{drives.length}</span> walk-in drives
                    </p>
                  )}
                </div>

                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => setShowSort(!showSort)}
                    className="flex items-center gap-2 rounded-lg border border-[oklch(0.905_0.01_255)] bg-white px-3.5 py-2 text-sm font-medium text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition-colors"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5 text-[oklch(0.50_0.022_258)]" />
                    <span className="hidden sm:inline">{currentSort?.label}</span>
                    <span className="sm:hidden">Sort</span>
                  </button>
                  {showSort && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                      <div className="absolute right-0 top-full mt-1.5 z-20 w-52 rounded-xl border border-[oklch(0.905_0.01_255)] bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] overflow-hidden">
                        {SORT_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => { setFilters(f => ({ ...f, sort: opt.value })); setShowSort(false) }}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[oklch(0.975_0.005_250)] ${
                              filters.sort === opt.value
                                ? 'text-brand-blue font-semibold bg-brand-blue/5'
                                : 'text-[oklch(0.13_0.04_264)]'
                            }`}
                          >
                            {opt.label}
                            {filters.sort === opt.value && <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20 gap-2 text-[oklch(0.50_0.022_258)]">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading drives…
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {drives.map(d => <DriveCard key={d.id} drive={d} />)}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Mobile filter drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] flex flex-col rounded-t-2xl bg-white shadow-2xl">
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="h-1 w-10 rounded-full bg-[oklch(0.905_0.01_255)]" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3 pt-1 border-b border-[oklch(0.905_0.01_255)] shrink-0">
                <h3 className="text-base font-bold text-[oklch(0.13_0.04_264)]">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[oklch(0.965_0.007_252)] transition-colors">
                  <X className="h-4 w-4 text-[oklch(0.50_0.022_258)]" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <DriveFilters filters={filters} onChange={setFilters} />
              </div>
              <div className="px-5 py-4 border-t border-[oklch(0.905_0.01_255)] shrink-0 flex gap-3">
                <button
                  onClick={() => { setFilters(defaultFilters); setShowMobileFilters(false) }}
                  className="flex-1 rounded-lg border border-[oklch(0.905_0.01_255)] py-3 text-sm font-semibold text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.965_0.007_252)] transition"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 rounded-lg bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-[oklch(0.56_0.22_262)] transition"
                >
                  Show {drives.length} Results
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />

      {/* Back to top */}
      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.13_0.04_264)] text-white shadow-lg hover:bg-[oklch(0.22_0.04_264)] transition-all"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
