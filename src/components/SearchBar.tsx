import type { Entity } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'

interface Props {
  value: string
  onChange: (v: string) => void
  suggestions: Entity[]
  onSelect: (e: Entity) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchBar({ value, onChange, suggestions, onSelect, open, onOpenChange }: Props) {
  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-md transition focus-within:ring-2 focus-within:ring-neutral-900/10">
        <svg
          className="h-4 w-4 shrink-0 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            onOpenChange(true)
          }}
          onFocus={() => onOpenChange(true)}
          placeholder="Search startups, companies, incubators, events..."
          className="w-full bg-transparent text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              onOpenChange(false)
            }}
            className="shrink-0 text-neutral-400 hover:text-neutral-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {open && value && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-black/5 bg-white/95 p-2 shadow-xl shadow-black/10 backdrop-blur-md">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-neutral-100"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[s.category] }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-neutral-900">
                  {s.name}
                </span>
                <span className="block truncate text-[11px] text-neutral-500">
                  {CATEGORY_LABELS[s.category]} · {s.city}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
