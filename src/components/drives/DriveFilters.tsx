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
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city]
    update('cities', next)
  }

  const clearAll = () => onChange({ query: filters.query, cities: [], experience: '', mode: '', salary: '', category: filters.category, sort: filters.sort, dateRange: filters.dateRange })
  const activeCount = filters.cities.length + (filters.experience ? 1 : 0) + (filters.mode ? 1 : 0)

  return (
    <aside className="rounded-xl border border-[oklch(0.905_0.01_255)] bg-white overflow-hidden h-fit">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[oklch(0.965_0.007_252)]">
        <h3 className="text-sm font-bold text-[oklch(0.13_0.04_264)]">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-brand-blue hover:underline font-semibold">
            <X className="h-3 w-3" /> Clear ({activeCount})
          </button>
        )}
      </div>

      {/* Location */}
      <div className="px-5 py-4 border-b border-[oklch(0.965_0.007_252)]">
        <h4 className="text-xs font-bold tracking-wide text-[oklch(0.13_0.04_264)] uppercase mb-3">Location</h4>
        <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {CITIES.map(city => (
            <li key={city}>
              <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.cities.includes(city)}
                  onChange={() => toggleCity(city)}
                  className="h-3.5 w-3.5 rounded accent-brand-blue"
                />
                <span className={`text-sm transition-colors ${
                  filters.cities.includes(city)
                    ? 'text-brand-blue font-semibold'
                    : 'text-[oklch(0.42_0.022_258)] group-hover:text-[oklch(0.13_0.04_264)]'
                }`}>
                  {city}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Experience */}
      <div className="px-5 py-4 border-b border-[oklch(0.965_0.007_252)]">
        <h4 className="text-xs font-bold tracking-wide text-[oklch(0.13_0.04_264)] uppercase mb-3">Experience</h4>
        <ul className="space-y-1">
          <li>
            <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
              <input type="radio" name="exp" checked={filters.experience === ''} onChange={() => update('experience', '')} className="h-3.5 w-3.5 accent-brand-blue" />
              <span className={`text-sm ${!filters.experience ? 'text-brand-blue font-semibold' : 'text-[oklch(0.42_0.022_258)] group-hover:text-[oklch(0.13_0.04_264)]'}`}>
                Any Experience
              </span>
            </label>
          </li>
          {EXPERIENCES.map(exp => (
            <li key={exp}>
              <label className="flex items-center gap-2.5 py-1 cursor-pointer group">
                <input type="radio" name="exp" checked={filters.experience === exp} onChange={() => update('experience', exp)} className="h-3.5 w-3.5 accent-brand-blue" />
                <span className={`text-sm ${filters.experience === exp ? 'text-brand-blue font-semibold' : 'text-[oklch(0.42_0.022_258)] group-hover:text-[oklch(0.13_0.04_264)]'}`}>
                  {exp}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Work Mode */}
      <div className="px-5 py-4">
        <h4 className="text-xs font-bold tracking-wide text-[oklch(0.13_0.04_264)] uppercase mb-3">Work Mode</h4>
        <div className="flex flex-col gap-1.5">
          {MODES.map(mode => (
            <button
              key={mode}
              onClick={() => update('mode', filters.mode === mode ? '' : mode)}
              className={[
                'rounded-lg px-3 py-2 text-sm font-medium text-left border transition-all',
                filters.mode === mode
                  ? 'bg-brand-blue/8 text-brand-blue border-brand-blue/20 font-semibold'
                  : 'border-[oklch(0.905_0.01_255)] text-[oklch(0.42_0.022_258)] hover:border-brand-blue/20 hover:text-[oklch(0.13_0.04_264)] hover:bg-[oklch(0.975_0.005_250)]',
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
