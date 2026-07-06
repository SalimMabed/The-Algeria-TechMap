import type { Category } from '../types'
import { CATEGORY_LABELS_PLURAL } from '../types'

export type Filter = { type: 'category'; value: Category } | { type: 'sector'; value: string } | null

const CATEGORY_CHIPS: Category[] = ['startup', 'company', 'incubator', 'coworking', 'event', 'hosting']

export function FilterChips({
  filter,
  onChange,
  sectorChips,
}: {
  filter: Filter
  onChange: (f: Filter) => void
  sectorChips: string[]
}) {
  function isActive(f: Filter) {
    if (!filter || !f) return false
    return filter.type === f.type && filter.value === f.value
  }

  function toggle(f: Filter) {
    onChange(isActive(f) ? null : f)
  }

  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto">
      {CATEGORY_CHIPS.map((c) => {
        const f: Filter = { type: 'category', value: c }
        return (
          <button
            key={c}
            type="button"
            onClick={() => toggle(f)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-medium shadow-sm backdrop-blur-md transition ${
              isActive(f)
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-black/5 bg-white/80 text-neutral-700 hover:bg-white'
            }`}
          >
            {CATEGORY_LABELS_PLURAL[c]}
          </button>
        )
      })}
      {sectorChips.map((s) => {
        const f: Filter = { type: 'sector', value: s }
        return (
          <button
            key={s}
            type="button"
            onClick={() => toggle(f)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-medium shadow-sm backdrop-blur-md transition ${
              isActive(f)
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-black/5 bg-white/80 text-neutral-700 hover:bg-white'
            }`}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}
