export function Logo() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-[11px]">
          🗺️
        </span>
        <span className="hidden text-[13px] font-semibold tracking-tight text-neutral-900 sm:inline">
          The Algeria TechMap
        </span>
        <span className="hidden rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700 sm:inline">
          Beta
        </span>
      </div>
      <p className="hidden max-w-[220px] pl-1 text-[11px] leading-snug text-neutral-500 sm:block">
        The living map of Algeria's tech ecosystem
      </p>
    </div>
  )
}
