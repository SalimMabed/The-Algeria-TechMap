import { useMemo, useState } from 'react'
import { Logo } from './components/Logo'
import { SearchBar } from './components/SearchBar'
import { FilterChips } from './components/FilterChips'
import type { Filter } from './components/FilterChips'
import { MapView } from './components/MapView'
import { StatsFloatingCard } from './components/StatsFloatingCard'
import { FloatingAddButton } from './components/FloatingAddButton'
import { EntityDetail } from './components/EntityDetail'
import { ENTITIES } from './data/entities'
import type { Entity } from './types'

const SECTOR_CHIPS = ['AI', 'FinTech', 'Cybersecurity']

function App() {
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>(null)
  const [selected, setSelected] = useState<Entity | null>(null)
  const [detail, setDetail] = useState<Entity | null>(null)

  const filtered = useMemo(() => {
    if (!filter) return ENTITIES
    return ENTITIES.filter((e) =>
      filter.type === 'category' ? e.category === filter.value : e.sector === filter.value,
    )
  }, [filter])

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return ENTITIES.filter((e) =>
      `${e.name} ${e.sector} ${e.city}`.toLowerCase().includes(q),
    ).slice(0, 6)
  }, [search])

  function handlePick(e: Entity) {
    setSelected(e)
    setDetail(e)
    setSearchOpen(false)
    setSearch(e.name)
    setFilter(null)
  }

  return (
    <div className="flex h-screen w-screen bg-white">
      <div className="relative min-w-0 flex-1" onClick={() => setSearchOpen(false)}>
        <MapView entities={filtered} selected={selected} onViewDetails={setDetail} />

        {/* Top bar: logo / search+chips / stats */}
        <div className="pointer-events-none absolute inset-x-4 top-4 z-[900] grid grid-cols-[auto_1fr_auto] items-start gap-3">
          <div className="pointer-events-auto">
            <Logo />
          </div>

          <div
            className="pointer-events-auto mx-auto w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SearchBar
              value={search}
              onChange={setSearch}
              suggestions={suggestions}
              onSelect={handlePick}
              open={searchOpen}
              onOpenChange={setSearchOpen}
            />
            <div className="mt-3">
              <FilterChips filter={filter} onChange={setFilter} sectorChips={SECTOR_CHIPS} />
            </div>
          </div>

          <div className="pointer-events-auto">
            <StatsFloatingCard entities={ENTITIES} />
          </div>
        </div>

        {/* Bottom-right floating add button */}
        <div className="pointer-events-none absolute bottom-6 right-6 z-[900]">
          <div className="pointer-events-auto">
            <FloatingAddButton />
          </div>
        </div>

        {/* Beta / demo-data notice — honest with visitors until the
            starter dataset is replaced with verified real entries.
            z-[800]: below the add-button container, whose subtree also
            renders the submission modal. */}
        <div className="pointer-events-none absolute bottom-6 left-4 z-[800] flex items-center gap-2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-black/5 bg-white/85 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-[11px] font-medium text-neutral-600">
              Beta — most entries are illustrative demo data, help us replace them with real ones
            </span>
          </div>
          <a
            href="/directory.html"
            className="pointer-events-auto rounded-full border border-black/5 bg-white/85 px-3 py-1.5 text-[11px] font-medium text-neutral-600 shadow-sm backdrop-blur-md transition hover:text-neutral-900"
          >
            List view ↗
          </a>
        </div>
      </div>

      {detail && <EntityDetail entity={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}

export default App
