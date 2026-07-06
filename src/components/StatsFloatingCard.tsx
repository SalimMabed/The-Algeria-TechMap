import type { Entity } from '../types'

const ROWS: { category: Entity['category']; label: string }[] = [
  { category: 'startup', label: 'Startups' },
  { category: 'company', label: 'Companies' },
  { category: 'event', label: 'Events' },
  { category: 'incubator', label: 'Incubators' },
  { category: 'hosting', label: 'Hosting Providers' },
]

export function StatsFloatingCard({ entities }: { entities: Entity[] }) {
  return (
    <div className="hidden w-52 flex-col gap-1.5 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-lg shadow-black/5 backdrop-blur-md sm:flex">
      {ROWS.map((r) => {
        const count = entities.filter((e) => e.category === r.category).length
        return (
          <div key={r.category} className="flex items-center justify-between text-[13px]">
            <span className="text-neutral-500">{r.label}</span>
            <span className="font-semibold tabular-nums text-neutral-900">
              {count.toLocaleString('en-US')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
