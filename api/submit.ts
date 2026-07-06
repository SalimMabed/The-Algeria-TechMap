import type { VercelRequest, VercelResponse } from '@vercel/node'

// Repo new submissions are filed against as GitHub Issues for review.
const GITHUB_REPO = 'SalimMabed/The-Algeria-TechMap'

// Best-effort per-IP rate limit. The map lives at module scope, so it
// persists across invocations on a warm serverless instance — enough to
// stop casual spam floods, though not a hard guarantee across instances.
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const recentByIp = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (recentByIp.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (timestamps.length >= RATE_LIMIT_MAX) {
    recentByIp.set(ip, timestamps)
    return true
  }
  timestamps.push(now)
  recentByIp.set(ip, timestamps)
  // Keep the map from growing unbounded on long-lived instances.
  if (recentByIp.size > 10_000) recentByIp.clear()
  return false
}

const ALLOWED_TYPES = new Set([
  'Startup',
  'Company',
  'Freelancer',
  'Incubator',
  'Coworking Space',
  'Event',
  'Hosting Provider',
])

const MAX_LENGTHS: Record<string, number> = {
  name: 120,
  location: 120,
  sector: 80,
  description: 1200,
  website: 300,
  email: 200,
}

interface SubmissionBody {
  type?: string
  name?: string
  location?: string
  sector?: string
  description?: string
  website?: string
  email?: string
  company?: string // honeypot — humans never see this field
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const forwarded = req.headers['x-forwarded-for']
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || '').split(',')[0].trim() || 'unknown'
  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many submissions, please try again later' })
    return
  }

  const { type, name, location, sector, description, website, email, company } =
    (req.body || {}) as SubmissionBody

  // Honeypot: bots auto-fill every field; real users can't see this one.
  // Pretend success so bots don't adapt.
  if (company) {
    res.status(200).json({ ok: true })
    return
  }

  if (!type || !name || !location || !sector || !description || !email) {
    res.status(400).json({ error: 'Missing required fields' })
    return
  }

  if (!ALLOWED_TYPES.has(type)) {
    res.status(400).json({ error: 'Invalid type' })
    return
  }

  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const value = { name, location, sector, description, website, email }[
      field as keyof typeof MAX_LENGTHS
    ] as string | undefined
    if (value && value.length > max) {
      res.status(400).json({ error: `Field "${field}" is too long (max ${max} characters)` })
      return
    }
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    res.status(500).json({ error: 'Server is not configured (missing GITHUB_TOKEN)' })
    return
  }

  const title = `[Submission] ${type}: ${name}`
  const body = [
    `**Type:** ${type}`,
    `**Name:** ${name}`,
    `**City / Wilaya:** ${location}`,
    `**Sector:** ${sector}`,
    `**Description:** ${description}`,
    `**Website:** ${website || '_none_'}`,
    `**Contact email:** ${email}`,
  ].join('\n')

  const ghResponse = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'algeria-techmap-submit',
    },
    body: JSON.stringify({ title, body }),
  })

  if (!ghResponse.ok) {
    const detail = await ghResponse.text()
    res.status(502).json({ error: 'Failed to record submission', detail })
    return
  }

  res.status(200).json({ ok: true })
}
