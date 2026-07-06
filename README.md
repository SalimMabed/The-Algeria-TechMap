# The Algeria TechMap 🗺️

> **Beta, and open source by design** — this is an early, public beta, released as an open-source project on purpose. The dataset is a starting point, not a complete directory, and things may change fast. Feedback, issues and pull requests are very welcome — this map is meant to be built by the ecosystem it represents, not by one person alone.

A minimal, premium, single-screen map of the Algerian tech ecosystem — startups, companies, incubators, coworking spaces, events and hosting providers — across every wilaya of Algeria.

## Why this project exists

Algeria's tech ecosystem is real and growing, but it's scattered — a startup in Oran has no easy way to find an incubator in Constantine, a student looking for an internship doesn't know which companies near them are even hiring, and an investor scouting opportunities has no single place to see what actually exists across the country.

**The Algeria TechMap aims to fix that** by putting the whole ecosystem on one map:

- **Collaboration** — startups, companies, coworking spaces and incubators can find each other by region and sector, instead of relying on word of mouth.
- **Investment opportunities** — investors and VCs get a single, visual entry point into where the ecosystem actually is, instead of piecing it together from scattered sources.
- **Internships and jobs for students** — students can see which companies, startups and incubators are near them, by city and sector, to look for internships and opportunities.

It's deliberately a map, not a directory or a spreadsheet: the goal is that anyone — student, founder, investor — can look at it and immediately understand what exists, and where.

Design direction: Google Maps × Apple Maps × Linear. Full-bleed map, floating glass panels, no scroll, no dashboard clutter.

## Features

- Full-screen interactive map centered on Algeria, with colored markers per category
- Floating search bar with live autocomplete (name, sector, city)
- Category & sector filter chips
- Premium marker popups with a "View details" action
- Floating stats card (counts per category)
- Floating "+" button to submit a new entry (Startup, Company, Event, Incubator, Hosting Provider) — fully in-app, no redirect to a third-party site
- Fully responsive, from mobile to desktop

## Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Leaflet](https://leafletjs.com) / [react-leaflet](https://react-leaflet.js.org), with Esri's terrain basemap and a custom highlight for Algeria's own outline
- A small [Vercel serverless function](api/submit.ts) that files new submissions as GitHub issues on this repo — no external form service involved

## Getting started

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`.

```bash
npm run build   # production build
npm run preview # preview the build
```

The "+ Submit an entry" form calls `/api/submit`, which only exists once deployed on Vercel (or run locally via `vercel dev`). On a plain `vite dev` server it will show a submission error — that's expected.

### Deploying

The project deploys as-is on [Vercel](https://vercel.com): import the repo, no build config needed. To make the submission form work, add an environment variable:

| Variable       | Description                                                                 |
| -------------- | ---------------------------------------------------------------------------- |
| `GITHUB_TOKEN` | A fine-grained GitHub token with **Issues: Read and write** access to this repo, used by `api/submit.ts` to file new submissions as issues |

## Submitting an entry

Clicking the "+" button opens an in-app form. Submissions are filed as [GitHub issues](../../issues) on this repo for review — no data leaves this project, and no third-party form service is used.

## Dataset

Data lives in [`src/data/entities.ts`](src/data/entities.ts). It's an **illustrative starter dataset** — correct and enrich it with real, up-to-date ecosystem data. Pull requests welcome.

Add an entity by appending an object to the `ENTITIES` array, matching the `Entity` type in [`src/types.ts`](src/types.ts):

```ts
{
  id: 'unique-id',
  name: 'Entity name',
  category: 'startup', // startup | company | incubator | coworking | event | hosting
  wilaya: 'Algiers',
  city: 'Algiers',
  lat: 36.75,
  lng: 3.04,
  sector: 'FinTech',
  description: '...',
  founded: 2022,
  website: 'https://...',
}
```

## Project structure

```
api/
  submit.ts     Vercel serverless function — files submissions as GitHub issues
src/
  components/   Logo, SearchBar, FilterChips, MapView, StatsFloatingCard,
                FloatingAddButton, SubmissionForm, EntityDetail
  data/         Ecosystem dataset + Algeria's boundary GeoJSON
  types.ts      Shared types (Entity, categories, colors, labels)
  App.tsx       Page assembly (floating layout over the map)
```

## Contributing

This project is open source on purpose: the Algerian tech ecosystem is bigger than any one person's knowledge of it, so the dataset and the site itself are meant to grow through contributions — bug fixes, design improvements, or adding real entities you know about. This is a beta: expect some rough edges, and feel free to open an issue for anything that feels off.

## License

[MIT](LICENSE)
