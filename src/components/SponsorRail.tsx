export function SponsorRail() {
  return (
    <div className="hidden h-full w-[200px] shrink-0 flex-col gap-3 border-neutral-100 p-4 lg:flex">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-center text-[12px] text-neutral-400"
        >
          Advertise here
        </div>
      ))}
    </div>
  )
}
