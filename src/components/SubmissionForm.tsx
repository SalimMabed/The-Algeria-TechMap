import { useState, type FormEvent } from 'react'

const TYPE_OPTIONS = [
  'Startup',
  'Company',
  'Freelancer',
  'Incubator',
  'Coworking Space',
  'Event',
  'Hosting Provider',
]

export function SubmissionForm({
  initialType,
  onClose,
}: {
  initialType: string
  onClose: () => void
}) {
  const [type, setType] = useState(initialType)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [sector, setSector] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  // Honeypot: invisible to humans, bots fill it in. Sent along so the
  // API can silently drop automated submissions.
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, location, sector, description, website, email, company }),
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/30 backdrop-blur-sm sm:items-center animate-[fadeIn_0.18s_ease-out]"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-black/5 bg-white p-6 shadow-2xl animate-[sheetIn_0.22s_cubic-bezier(0.16,1,0.3,1)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'sent' ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
              ✓
            </span>
            <h2 className="mt-4 text-lg font-semibold text-neutral-900">Thanks!</h2>
            <p className="mt-1 text-[13px] text-neutral-500">
              Your submission was sent. We'll review it and add it to the map.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-full bg-neutral-900 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-neutral-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                Submit an entry
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-500 transition hover:bg-neutral-50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1 text-[12px] font-medium text-neutral-600">
                Type
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-medium text-neutral-600">
                Name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-medium text-neutral-600">
                City / Wilaya
                <input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-medium text-neutral-600">
                Sector
                <input
                  required
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="FinTech, AI, E-commerce..."
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-medium text-neutral-600">
                Description
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none rounded-lg border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-medium text-neutral-600">
                Website (optional)
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-medium text-neutral-600">
                Contact email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-[14px] text-neutral-900 focus:border-neutral-400 focus:outline-none"
                />
              </label>

              {/* Honeypot — hidden from real users, catches naive bots */}
              <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                <label>
                  Company
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </label>
              </div>

              <p className="text-[11px] leading-snug text-neutral-400">
                Submissions are reviewed publicly as GitHub issues on the project's
                open-source repository — the details you enter here, including your
                contact email, will be publicly visible.
              </p>

              {status === 'error' && (
                <p className="text-[12px] text-red-600">
                  Something went wrong sending your submission. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-2 rounded-full bg-neutral-900 py-2.5 text-[13px] font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
