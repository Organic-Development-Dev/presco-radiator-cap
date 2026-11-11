# CLAUDE.md

Guidance for Claude Code in this repository.

## Project
Website for Presco Radiator Caps: an enquiry-only product catalogue (no cart/checkout yet). Next.js 16 App Router + TypeScript + Tailwind v4, content in Sanity (Studio embedded at `/studio`). Hosted on Vercel. Replacing a WordPress/WooCommerce backend (`bd.presco-radiator-caps.com`) — see `scripts/migrate-from-wordpress.ts`.

`legacy/` holds the old Next.js 14 + WooCommerce frontend for reference only. It is excluded from TypeScript, ESLint and Tailwind; never import from it.

## Commands
Use Node 24 (`.nvmrc`). On this machine: `export PATH=/opt/homebrew/opt/node@24/bin:$PATH` (the default `node` is 23).
- `npm run dev` / `npm run build`
- `npm run lint`, `npm run typecheck`, `npm test`
- `npm run migrate -- --dry-run` (safe) / `npm run migrate` (writes to Sanity)
- `npm run typegen`

## Architecture
- `app/(site)/` public routes; `app/studio/[[...tool]]` Studio; `app/api/revalidate` Sanity webhook; `app/actions/forms.ts` server actions (enquiry/contact -> Sanity + Resend email; newsletter -> Mailchimp).
- Data fetching: server components call `sanityFetch({ query, params, tags })` (`sanity/lib/fetch.ts`). Results are cached with tags = document `_type`; the webhook revalidates by tag. Always pass the right tags.
- GROQ queries live in `sanity/lib/queries.ts` (wrapped in `defineQuery`); result types in `lib/types.ts`.
- Schemas in `sanity/schemaTypes/` (product, productCategory, page, post, siteSettings, enquiry; objects blockContent, seo). If you change `blockContent`, update the compiled copy in the migration script too.
- Images: `components/SanityImage.tsx`; rich text: `components/RichText.tsx`.
- URLs keep the old site's structure: `/product/<slug>/`, `/product-category/<slug>/`, `/blog/<slug>/`, `/news/`, trailing slashes on.

## Conventions
- Server components by default; client components only for interactivity, kept small.
- Tailwind utilities + the component classes in `app/globals.css` (`.container-site`, `.btn-primary`, ...). Brand colour `primary` (#a11a36).
- Named exports for components; PascalCase component files; 2-space indent.
- Never commit `.env*` files (only `.env.example`).
