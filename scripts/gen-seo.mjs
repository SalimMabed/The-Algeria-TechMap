// Build-time SEO generator.
//
// A client-rendered SPA serves almost-empty HTML to crawlers, so we generate
// real, crawlable artifacts from the dataset at build time:
//   - public/directory.html  a plain-HTML listing of every entity (the actual
//                             indexable content — a map has little crawlable text)
//   - public/sitemap.xml      so search engines discover both pages
//   - public/robots.txt       allow crawling + point to the sitemap
//
// Run automatically before `vite build` (see package.json).

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const SITE_URL = 'https://the-algeria-tech-map.vercel.app'

const CATEGORY_LABELS_PLURAL = {
  startup: 'Startups',
  company: 'Companies',
  freelancer: 'Freelancers',
  incubator: 'Incubators',
  coworking: 'Coworking Spaces',
  event: 'Events',
  hosting: 'Hosting Providers',
}

// --- Load the entities array out of the TS source without a TS runtime ---
function loadEntities() {
  const src = readFileSync(join(root, 'src/data/entities.ts'), 'utf8')
  const start = src.indexOf('export const ENTITIES')
  const arrStart = src.indexOf('[', start)
  const arrEnd = src.indexOf('export const WILAYAS')
  const arrText = src.slice(arrStart, arrEnd).trimEnd()
  // The dataset is plain object literals — valid JS once isolated.
  // eslint-disable-next-line no-new-func
  return new Function(`return ${arrText}`)()
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const entities = loadEntities()

// --- directory.html ---------------------------------------------------------
const byCategory = {}
for (const e of entities) {
  ;(byCategory[e.category] ??= []).push(e)
}

const sections = Object.keys(CATEGORY_LABELS_PLURAL)
  .filter((cat) => byCategory[cat]?.length)
  .map((cat) => {
    const items = byCategory[cat]
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((e) => {
        const site = e.website
          ? ` — <a href="${esc(e.website)}" rel="nofollow noopener">${esc(e.website)}</a>`
          : ''
        return `      <li>
        <h3>${esc(e.name)}</h3>
        <p class="meta">${esc(e.city)}, ${esc(e.wilaya)} · ${esc(e.sector)}${e.founded ? ` · Founded ${esc(e.founded)}` : ''}</p>
        <p>${esc(e.description)}${site}</p>
      </li>`
      })
      .join('\n')
    return `    <section>
      <h2>${esc(CATEGORY_LABELS_PLURAL[cat])} in Algeria</h2>
      <ul>
${items}
      </ul>
    </section>`
  })
  .join('\n')

const directoryHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href="${SITE_URL}/directory.html" />
    <title>Directory — The Algeria TechMap | Startups, Companies & Freelancers in Algeria</title>
    <meta
      name="description"
      content="A directory of Algeria's tech ecosystem — startups, companies, freelancers, incubators, coworking spaces, events and hosting providers, listed by city, wilaya and sector."
    />
    <style>
      body { font-family: -apple-system, Segoe UI, system-ui, Roboto, sans-serif; max-width: 820px; margin: 0 auto; padding: 2rem 1.25rem 4rem; color: #1f2937; line-height: 1.55; }
      header a { color: #059669; text-decoration: none; }
      h1 { font-size: 1.9rem; letter-spacing: -0.02em; }
      h2 { margin-top: 2.5rem; font-size: 1.25rem; border-bottom: 1px solid #e5e7eb; padding-bottom: .4rem; }
      h3 { margin: 0 0 .15rem; font-size: 1rem; }
      ul { list-style: none; padding: 0; }
      li { padding: .9rem 0; border-bottom: 1px solid #f3f4f6; }
      .meta { color: #6b7280; font-size: .85rem; margin: 0 0 .35rem; }
      p { margin: 0; }
      .intro { color: #4b5563; }
      a { color: #059669; }
    </style>
  </head>
  <body>
    <header>
      <p><a href="/">← Back to the interactive map</a></p>
      <h1>The Algeria TechMap — Directory</h1>
      <p class="intro">
        A text directory of Algeria's tech ecosystem: startups, companies, freelancers,
        incubators, coworking spaces, events and hosting providers across the country.
        Explore it visually on the <a href="/">interactive map</a>. This is an open-source
        public beta — most entries are currently illustrative and being replaced with
        verified data.
      </p>
    </header>
    <main>
${sections}
    </main>
    <footer>
      <p><a href="/">← Back to the interactive map</a> · <a href="https://github.com/SalimMabed/The-Algeria-TechMap">Open-source on GitHub</a></p>
    </footer>
  </body>
</html>
`

writeFileSync(join(root, 'public/directory.html'), directoryHtml)

// --- sitemap.xml ------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/directory.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`
writeFileSync(join(root, 'public/sitemap.xml'), sitemap)

// --- robots.txt -------------------------------------------------------------
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
writeFileSync(join(root, 'public/robots.txt'), robots)

console.log(`SEO: generated directory.html (${entities.length} entities), sitemap.xml, robots.txt`)
