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
- `npm run seed` — after a migration: moves menus, contact details, homepage sections etc. into Sanity and tidies SEO data. Only fills empty fields, safe to re-run.
- `npm run typegen`

## Architecture
- `app/(site)/` public routes; `app/studio/[[...tool]]` Studio; `app/api/revalidate` Sanity webhook; `app/actions/forms.ts` server actions (enquiry/contact -> Sanity + Resend email; newsletter -> Mailchimp).
- Data fetching: server components call `sanityFetch({ query, params, tags })` (`sanity/lib/fetch.ts`). Results are cached with tags = document `_type`; the webhook revalidates by tag. Always pass the right tags.
- GROQ queries live in `sanity/lib/queries.ts` (wrapped in `defineQuery`); result types in `lib/types.ts`.
- Schemas in `sanity/schemaTypes/` (homePage, product, productCategory, page, post, testimonial, teamMember, siteSettings, enquiry; objects blockContent, seo, navLink/menuItem/footerColumn/heroSlide). If you change `blockContent`, update the compiled copy in the migration script too.
- **All copy lives in Sanity, not in code.** Menus, footer, contact details, newsletter text, copyright → `siteSettings` (`lib/settings.ts`, `getSiteSettings()`). Homepage → `homePage` singleton. `/products/`, `/news/`, `/contact-us/` take title/intro/SEO from the `page` docs with those slugs (`lib/pages.ts`). Only UI microcopy (button labels, empty states, 404) stays in code.
- Links in Sanity are references resolved with `lib/links.ts` (`resolveHref`); keep `documentHref` in sync with the routes.
- Images: `components/SanityImage.tsx`; rich text: `components/RichText.tsx`.
- Renamed post slugs go in `previousSlugs`; the blog route 308-redirects them.
- URLs keep the old site's structure: `/product/<slug>/`, `/product-category/<slug>/`, `/blog/<slug>/`, `/news/`, trailing slashes on.
- SEO: every route exports `generateMetadata` via `buildMetadata()` (`lib/metadata.ts`), which falls back to `siteSettings.defaultSeo` for description/share image and sets canonical, OG and Twitter tags. Filtered catalogue views are noindex with the canonical on the unfiltered listing (`catalogueSeo` in `components/catalogue/params.ts`). JSON-LD: Organization + WebSite on the homepage (`SiteJsonLd`), Product, Article, BreadcrumbList.
- In development `sanityFetch` doesn't cache, so Studio edits show on refresh.
- `@sanity/icons` v5: import each icon from its subpath (`import { CogIcon } from "@sanity/icons/Cog"`); the root export no longer has them (tsc won't catch it, the build will).

## Conventions
- Server components by default; client components only for interactivity, kept small.
- Tailwind utilities + the component classes in `app/globals.css` (`.container-site`, `.btn-primary`, ...). Brand colour `primary` is navy #445a8e (legacy sets red #A11A36 in _document.js but style.scss overrides it — the live site is navy).
- Named exports for components; PascalCase component files; 2-space indent.
- Never commit `.env*` files (only `.env.example`).
