import { X } from 'lucide-react'
import { CITIES, EXPERIENCES, MODES } from '@/lib/mockData'
import type { FilterState } from '@/types'

interface DriveFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function DriveFilters({ filters, onChange }: DriveFiltersProps) {
  const update = (key: keyof FilterState, value: FilterState[keyof FilterState]) =>
    onChange({ ...filters, [key]: value })

  const toggleCity = (city: string) => {
    const next = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city]
    update('cities', next)
  }

  const clearAll = () => onChange({ query: filters.query, cities: [], experience: '', mode: '', salary: '' })

  const activeCount = filters.cities.length + (filters.experience ? 1 : 0) + (filters.mode ? 1 : 0)

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 h-fit">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-brand-blue hover:underline">
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* City */}
      <div className="mt-5">
        <h4 className="text-sm font-semibold text-foreground mb-3">Location</h4>
        <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {CITIES.map((city) => (
            <li key={city}>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  checked={filters.cities.includes(city)}
                  onChange={() => toggleCity(city)}
                  className="accent-[oklch(0.62_0.22_260)] h-4 w-4 rounded border-border"
                />
                {city}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Experience */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Experience</h4>
        <ul className="space-y-2">
          <li>
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <input type="radio" name="exp" checked={filters.experience === ''} onChange={() => update('experience', '')} className="accent-[oklch(0.62_0.22_260)]" />
              Any Experience
            </label>
          </li>
          {EXPERIENCES.map((exp) => (
            <li key={exp}>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                <input type="radio" name="exp" checked={filters.experience === exp} onChange={() => update('experience', exp)} className="accent-[oklch(0.62_0.22_260)]" />
                {exp}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Work Mode */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Work Mode</h4>
        <div className="flex flex-wrap gap-2">
          {MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => update('mode', filters.mode === mode ? '' : mode)}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors',
                filters.mode === mode
                  ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20'
                  : 'border-border text-muted-foreground hover:border-brand-blue/40 hover:text-brand-blue',
              ].join(' ')}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
