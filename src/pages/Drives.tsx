import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, MapPin, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DriveCard } from '@/components/drives/DriveCard'
import { DriveFilters } from '@/components/drives/DriveFilters'
import { useDrives } from '@/hooks/useDrives'
import type { FilterState } from '@/types'

const defaultFilters: FilterState = { query: '', cities: [], experience: '', mode: '', salary: '' }

export default function Drives() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const { data: drives = [], isLoading } = useDrives({
    query:      filters.query,
    cities:     filters.cities,
    experience: filters.experience,
    mode:       filters.mode,
  })

  const activeTags = [
    ...filters.cities.map((c) => ({ label: c, clear: () => setFilters((f) => ({ ...f, cities: f.cities.filter((x) => x !== c) })) })),
    ...(filters.experience ? [{ label: filters.experience, clear: () => setFilters((f) => ({ ...f, experience: '' })) }] : []),
    ...(filters.mode ? [{ label: filters.mode, clear: () => setFilters((f) => ({ ...f, mode: '' })) }] : []),
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Page header */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <p className="mt-6 text-xs font-semibold tracking-widest text-muted-foreground">ALL WALK-IN DRIVES</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Find your next walk-in drive
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Filter by location, experience and work mode to find the perfect match.
          </p>

          {/* Search bar */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={filters.query}
                onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
                placeholder="Skills / Roles / Companies"
                className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="relative sm:w-72">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Location"
                onChange={(e) => setFilters((f) => ({ ...f, cities: e.target.value ? [e.target.value] : [] }))}
                className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              className="sm:hidden flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeTags.length > 0 && (
                <span className="rounded-full bg-brand-blue text-primary-foreground text-xs px-1.5 py-0.5">{activeTags.length}</span>
              )}
            </button>
            <button className="hidden sm:inline-flex rounded-full bg-brand-blue px-7 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition">
              Search
            </button>
          </div>

          {/* Active filter tags */}
          {activeTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {activeTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={tag.clear}
                  className="flex items-center gap-1.5 rounded-full bg-brand-blue/10 text-brand-blue px-3 py-1 text-xs font-semibold hover:bg-brand-blue/20 transition-colors"
                >
                  {tag.label} <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Content */}
        <section className="bg-section-soft border-t border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[260px_1fr] gap-8">

            {/* Desktop sidebar */}
            <div className="hidden lg:block">
              <DriveFilters filters={filters} onChange={setFilters} />
            </div>

            {/* Drive grid */}
            <div>
              <p className="text-xs font-semibold tracking-widest text-muted-foreground">OPEN WALK-IN DRIVES</p>
              {isLoading ? (
                <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading drives…
                </div>
              ) : (
                <>
                  <h2 className="mt-2 text-2xl font-bold text-foreground">{drives.length} walk-ins available</h2>
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    {drives.map((d) => <DriveCard key={d.id} drive={d} />)}
                    {drives.length === 0 && (
                      <div className="col-span-2 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                        No walk-ins match your filters.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Mobile filter drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-background p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <DriveFilters filters={filters} onChange={setFilters} />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="mt-5 w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-primary-foreground"
              >
                Show {drives.length} Results
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
