import type { Entity } from '../types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types'

export function EntityDetail({
  entity,
  onClose,
}: {
  entity: Entity
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center animate-[fadeIn_0.18s_ease-out]"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-black/5 bg-white p-6 shadow-2xl animate-[sheetIn_0.22s_cubic-bezier(0.16,1,0.3,1)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base font-semibold text-white"
              style={{ backgroundColor: CATEGORY_COLORS[entity.category] }}
            >
              {entity.name.charAt(0)}
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                {entity.name}
              </h2>
              <p className="text-[13px] text-neutral-500">
                {CATEGORY_LABELS[entity.category]} · {entity.city}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-500 transition hover:bg-neutral-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-neutral-700">{entity.description}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
          <div>
            <dt className="text-neutral-400">Sector</dt>
            <dd className="text-neutral-800">{entity.sector}</dd>
          </div>
          {entity.founded && (
            <div>
              <dt className="text-neutral-400">Founded</dt>
              <dd className="text-neutral-800">{entity.founded}</dd>
            </div>
          )}
        </dl>

        {entity.website && (
          <a
            href={entity.website}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-700"
          >
            Visit website ↗
          </a>
        )}
      </div>
    </div>
  )
}
