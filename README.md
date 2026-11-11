# Presco Radiator Caps — website

Next.js 16 (App Router) + Sanity. Product catalogue with enquiry forms; content is edited in Sanity Studio at `/studio`.

## Setup

```bash
nvm use            # Node 24 (see .nvmrc)
npm install
cp .env.example .env.local   # fill in the Sanity project ID at minimum
npm run dev        # http://localhost:3000, Studio at /studio
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` / `test` | ESLint, TypeScript, Vitest |
| `npm run migrate -- --dry-run` | Convert WordPress/WooCommerce content without writing (output in `scripts/.cache/`) |
| `npm run migrate` | Import WordPress/WooCommerce content into Sanity (idempotent; needs `SANITY_API_WRITE_TOKEN`) |
| `npm run typegen` | Generate TypeScript types from the Sanity schema and queries |

## How content updates reach the site

Pages are cached. A Sanity webhook calls `POST /api/revalidate` on publish, which revalidates the cache tags for that document type. Setup is documented in `app/api/revalidate/route.ts`.

## Layout

- `app/(site)/` — public pages; `app/studio/` — embedded Sanity Studio; `app/actions/` — form server actions
- `components/` — UI; `lib/` — helpers and types
- `sanity/` — schemas, queries, client
- `scripts/migrate-from-wordpress.ts` — one-off migration
- `legacy/` — the previous WooCommerce frontend, kept for reference during the rebuild; delete after launch
