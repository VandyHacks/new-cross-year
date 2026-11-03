# VandyHacks XIII

Marketing site, interest/judge/sponsor forms, and a private admin dashboard
for VandyHacks XIII. Next.js 16 (App Router) + Tailwind v4 + Supabase.

```bash
npm install
npm run dev   # http://localhost:3000
```

The site runs without any environment variables; forms and `/admin` show a
"not set up yet" state until Supabase is connected. Setup, env vars and the
Supabase CLI workflow are in [docs/forms-setup.md](docs/forms-setup.md).

## Project map

| Path                                                       | What it is                                                                       | Redesign?       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------- |
| `app/(site)/`                                              | Public site: `page.tsx` composes the sections; `layout.tsx` adds the CRT chrome  | Replace         |
| `components/*.tsx`                                         | One file per public section (hero, about, stats, sponsors, team, FAQ, footer, …) | Replace         |
| `app/globals.css`                                          | Brand tokens (`--color-vh-*`), type scale (`.type-*`), CRT effects               | Restyle         |
| `lib/button-styles.ts`                                     | Shared CTA button classes                                                        | Restyle         |
| `lib/event.ts`                                             | Event name, dates, venue, contact email, CTA anchors. Single source of truth     | Keep            |
| `lib/faq.ts`, `sponsors.ts`, `team.ts`                     | Section content as plain data                                                    | Keep            |
| `components/forms/`, `lib/forms/`                          | Get Involved forms: UI, Zod schemas, Server Actions, spam protection             | Restyle UI only |
| `app/admin/`, `lib/admin/`                                 | Hidden dashboard (`/admin/login`, not linked anywhere)                           | Keep            |
| `app/auth/callback/`, `proxy.ts`                           | Magic-link sign-in and session refresh for `/admin`                              | Keep            |
| `lib/supabase/`, `supabase/`                               | Supabase clients, CLI config, migrations, local seed                             | Keep            |
| `app/layout.tsx`                                           | Fonts, global metadata (title template, Open Graph), base background             | Edit            |
| `app/robots.ts`, `sitemap.ts`, `not-found.tsx`, `icon.png` | Site-wide SEO and fallback routes                                                | Update          |

## Migrating to a new design

- **Content is separate from layout.** Rebuild sections against `lib/event.ts`
  and the `lib/*.ts` data files rather than copying text out of components.
- **Keep the forms' contract.** A new form UI can be anything, as long as it
  posts the same field names to `submitInterest` / `submitJudge` /
  `submitSponsor` in `lib/forms/actions.ts` and shows the returned
  `FormState` (`lib/forms/types.ts`). Field definitions are in `lib/forms/fields.ts`.
  `lib/event.ts`'s `CTA` anchors deep-link to each form tab; keep or update them.
- **Tokens first.** Change colours and type in `app/globals.css` (`@theme`
  and the `.dark` shadcn mapping). The admin dashboard uses the same tokens,
  so it follows automatically.
- **Site chrome is scoped.** The CRT vignette/scanlines live in
  `app/(site)/layout.tsx`; deleting them doesn't affect `/admin`.
- **New public pages** go in `app/(site)/<route>/page.tsx` (they inherit the
  site layout) and should be added to `app/sitemap.ts`.
- Still to do for launch: a social preview image (`app/opengraph-image.png`,
  1200×630) and `NEXT_PUBLIC_SITE_URL` set in production so metadata and the
  sitemap use the real domain.

## Scripts

| Script                    | Does                                                           |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev` / `build`   | Next.js dev server / production build                          |
| `npm run lint` / `format` | ESLint / Prettier                                              |
| `npm run db:link`         | Link this repo to the hosted Supabase project                  |
| `npm run db:push`         | Apply new migrations to the linked project                     |
| `npm run db:new <name>`   | Create a new migration file                                    |
| `npm run db:status`       | Compare local and remote migrations                            |
| `npm run db:types`        | Generate `lib/supabase/database.types.ts` from the live schema |

Hosting needs a server runtime (Vercel, or Netlify with Next.js support) for
Server Actions and `/admin`; a static export won't work.
