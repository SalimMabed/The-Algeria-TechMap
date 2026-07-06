import type { VercelRequest, VercelResponse } from '@vercel/node'

// Repo new submissions are filed against as GitHub Issues for review.
const GITHUB_REPO = 'SalimMabed/The-Algeria-TechMap'

interface SubmissionBody {
  type?: string
  name?: string
  location?: string
  sector?: string
  description?: string
  website?: string
  email?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { type, name, location, sector, description, website, email } =
    (req.body || {}) as SubmissionBody

  if (!type || !name || !location || !sector || !description || !email) {
    res.status(400).json({ error: 'Missing required fields' })
    return
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
