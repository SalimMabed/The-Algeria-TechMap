import { useState } from 'react'
import { SubmissionForm } from './SubmissionForm'

const ITEMS = [
  { label: 'Add Startup', type: 'Startup' },
  { label: 'Add Company', type: 'Company' },
  { label: 'Add Freelancer', type: 'Freelancer' },
  { label: 'Add Event', type: 'Event' },
  { label: 'Add Incubator', type: 'Incubator' },
  { label: 'Add Hosting Provider', type: 'Hosting Provider' },
]

export function FloatingAddButton() {
  const [open, setOpen] = useState(false)
  const [formType, setFormType] = useState<string | null>(null)

  return (
    <div className="flex flex-col items-end gap-2">
      {open && (
        <div className="flex w-52 flex-col gap-1 rounded-2xl border border-black/5 bg-white/95 p-2 shadow-xl shadow-black/10 backdrop-blur-md">
          {ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setOpen(false)
                setFormType(item.type)
              }}
              className="rounded-xl px-3 py-2 text-left text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Add entry"
        className={`flex h-13 w-13 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white shadow-xl shadow-black/20 transition hover:scale-105 ${open ? 'rotate-45' : ''}`}
        style={{ height: 52, width: 52, transitionDuration: '200ms' }}
      >
        +
      </button>

      {formType && <SubmissionForm initialType={formType} onClose={() => setFormType(null)} />}
    </div>
  )
}
