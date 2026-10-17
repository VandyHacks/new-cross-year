# VandyHacks XIII site: client feedback plan

Research date: 2026-10-17. Theme constraint: dark navy (`#080d20` / `#0d142c` / `#151e3d`) + dark purple (`#7138c7`, accent `#c8a2ff`).

| # | Client issue | Root cause found | Fix (summary) | Main reference |
|---|---|---|---|---|
| 1 | Team template looks bad, needs animation | `components/team.tsx` is 4 placeholder cards reading "tbd" | Curved, draggable "scroll-wheel" gallery (React Bits **CircularGallery**) | React Bits; Cal Hacks team cards |
| 2 | FAQ needs more questions | 5 generic questions, no categories | ~22 questions in 4 categories, seeded from the VH XII site | Cal Hacks (25 Qs, 3 categories), HackGT, VH XII repo |
| 3 | Sponsor links + logos | Links done. **Every raster logo is a favicon** (16–128 px, e.g. Centene 16×16) stretched to 180 px; every SVG is a 24×24 Simple Icons glyph (icon, no wordmark) | Replace with full wordmarks (25 already in the old `cross-year` repo at 600–2560 px), uniform glass cards | Cal Hacks linked logo cards |
| 4 | Forms: early interest, judge, sponsor | None exist; footer links are `href="#"` / mailto | On-page tabbed forms → Server Actions → Supabase, plus `/admin` dashboard | PennApps "notify me" terminal form, Hack the North email sign-up |
| 5 | Countdown to April 2 | `components/event-countdown.tsx` is empty | Rolling-digit countdown in hero, reusing `components/counter.tsx` | HackMIT hero countdown, VH XII `Countdown.tsx` |
| 6 | Stats wrong + no track record | Stats are hand-typed; "13 editions" is wrong (XIII hasn't happened); real numbers are *higher* than shown | Stats from Devpost data below + a "Since 2015" timeline | Cal Hacks "Our Story" timeline, TreeHacks/HackMIT stat rows |
| 7 | Inconsistent overall | Event date differs in 4 places; body font bug; ~15 hard-coded hex colors; mismatched nav labels | Design tokens + one card primitive + content fixes (section 1) | — |
| 8 | Design looks basic | Every section is "title + flat content"; no photos, dates, or CTAs in hero | Hero with date/location/countdown/CTA, event photography, glow cards, consistent CRT/terminal motif | TreeHacks, HackMIT, MHacks, PennApps |

---

## 1. Consistency and "looks basic" (issues 7 & 8)

### Problems found in the code
- **Body text is a display font.** `app/layout.tsx` creates `spaceMono` with `Michroma(...)`, so all body copy is set in wide Michroma. Load real Space Mono (or JetBrains Mono) for body text; keep Michroma for headings. This alone makes the site look more designed.
- **Event date is in conflict:** metadata says "March 2027", the Mission text says "April 3–4, 2027", VH XII's countdown targeted 2027‑03‑10, and the client asks for a countdown to April 2. Move to one `lib/event.ts` constant (`EVENT_START`, `EVENT_END`, venue) that everything reads from.
- **Colors:** shadcn tokens in `globals.css` are still the neutral grayscale defaults, and components hard-code `#c8a2ff`, `#7138c7`, `#151e3d`, `#c3c8dc`, `#080d20`, etc. Define brand tokens once and map shadcn vars to them:
  `--vh-navy-950 #080d20 · --vh-navy-900 #0d142c · --vh-navy-800 #151e3d · --vh-purple-600 #7138c7 · --vh-purple-500 #8853dc · --vh-purple-300 #c8a2ff · --vh-text #f1f0f3 · --vh-muted #c3c8dc`.
- **Navigation:** "About" links to the stats, "Mission" links to the about text; "Past Sponsors" wraps to two lines at ~800 px; "Apply to XIII", "Become a Judge", "Register" go to `#`. Rename to Mission → **About**, About → **Impact**; point CTAs at the new forms.
- **Scroll length:** Mission is 240svh and Stats is 460svh: about 7 screens of scrolling before sponsors. Cut Stats to ~200svh (or a static grid plus timeline).
- `:root { user-select: none }` blocks copying the contact email. Remove it.
- Team cards, stat cards, sponsor tiles, and FAQ rows each use a different surface style. Add one `GlassCard` primitive (navy‑800/80, `border-white/10`, inner highlight, optional purple glow on hover; React Bits **SpotlightCard** is a good base).

### Making it less basic (staying navy/purple)
- **Hero:** add the date, "Vanderbilt University · Nashville, TN", the countdown, and two CTAs (*Get notified* → interest form, *Sponsor us*). TreeHacks, HackMIT, and MHacks all lead with the date and place.
- **Real photography:** a past-event photo strip (Cal Hacks runs a carousel right after the intro). Ask the client for photos from VH X–XII.
- **Past projects:** 3–4 featured Devpost winners as cards (Hack the North's "Museum of Hack the North").
- **Commit to the CRT/terminal motif:** it's already in the scanlines and ASCII hero. Use it in forms (`> NAME` prompts, like PennApps), section labels (`// 03 SPONSORS`), and the countdown digits.
- Soft purple radial glows between sections (the footer already has one) instead of hard background changes.

## 2. Countdown (issue 5)
- Fill the empty `components/event-countdown.tsx`. Days : Hours : Minutes : Seconds, with each digit as a rolling reel via the existing `Counter` component, so it matches the stats animation.
- Target: `2027-04-02T??:00:00-05:00` (CDT). **The client needs to confirm the time.** Is April 2 check-in? The Mission text says the event is April 3–4.
- Render a static placeholder on the server and start ticking after mount to avoid hydration mismatch. When it reaches zero, swap to "Happening now". With reduced motion, update the numbers without rolling.

## 3. Stats and track record (issue 6)

Pulled from every VandyHacks Devpost page (via Devpost's search API and project galleries):

| Edition | Dates | Devpost registrants | Projects submitted | Listed prizes | Notes |
|---|---|---|---|---|---|
| VandyHacks I | Mar 21–22, 2015 | 120 | 35 | $7,046 | First collegiate hackathon in Nashville |
| II | Oct 3–4, 2015 | 113 | 36 | $16,158 | ~300 students (Vanderbilt News) |
| III | Nov 12–13, 2016 | 231 | 90 | $10,636 | 350+ students (Vanderbilt News) |
| IV | Oct 20–22, 2017 | 194 | 70 | $8,120 | |
| V | Nov 1–4, 2018 | 252 | 96 | $16,560 | ~700 attendees, +41% YoY, NFC check-in |
| VI | Nov 2–3, 2019 | 251 | 88 | $12,477 | Record RSVPs; buses from Chicago, Indianapolis, Atlanta |
| Summer Edition | Jul 10–12, 2020 | 212 | 59 | $445 | ~400 hackers, 7 countries |
| VII (Retro) | Oct 2–4, 2020 | 279 | 74 | $29,220 | Virtual, 826 participants |
| VIII (Space) | Oct 8–10, 2021 | 114 | 30 | $7,001 | |
| IX (Ocean) | Oct 21–23, 2022 | 120 | 35 | $7,356 | |
| X (Neon) | Oct 28–29, 2023 | 130 | 35 | $7,660 | |
| XI | Sep 28–29, 2024 | 166 | 42 | $3,150 | |
| XII | Mar 21–22, 2026 | 91 | 33 | — | Moved to spring |
| **Total** | | **2,273** | **723** | **$125,829** | |

Devpost registrants under-count attendance (VH V: 252 on Devpost vs ~700 attendees). Sources for the notes: the old `cross-year-website` events.json and Vanderbilt News (2015, 2016).

**Proposed stat row** (each one defensible):
- **12** hackathons since 2015 (+ Summer Edition): replaces "13 editions"
- **720+** projects built: replaces "500+"
- **$125K+** in prizes awarded (Devpost-listed; includes non-cash): replaces "$50K"
- **2,000+** hackers: keep (Devpost registrants alone = 2,273)
- **60+** sponsoring companies (sponsor list count)
- Drop "25+ schools" and "20+ speakers" unless the client has MLH or registration data to back them.

**Track record UI:** a horizontal "Since 2015" timeline under the stats (Cal Hacks' "Our Story" pattern). One node per edition with year, theme, projects count, a link to its Devpost gallery, and a photo if available. Older promo sites (vi/vii/viii/ix.vandyhacks.org) can be linked as an archive.

## 4. Team: scroll-wheel gallery (issue 1)
- **Component:** React Bits `CircularGallery` (`npx shadcn@latest add @react-bits/CircularGallery-TS-TW`). It now has **no dependencies** and takes `items: {image, text, description}`, `bend`, `snap`, `autoScroll`, `grayscale`, `showTitles`, `fadeEdges`, `openOnClick`. Map name → `text`, role → `description`.
- **Settings:** `bend≈2`, `snap`, slow `autoScroll` that pauses on interaction, `grayscale` until the card is centred (purple tint via an overlay), `fadeEdges` into navy.
- **Below the wheel:** a centred caption for the active member with name, role, and a LinkedIn icon. It should be real DOM text for screen readers.
- **Fallbacks:** with `prefers-reduced-motion`, use a static grid (React Bits `ChromaGrid` with spotlight off, or the `GlassCard` grid). A `sr-only` list always renders.
- **Risk:** check that wheel and drag don't fight Lenis smooth scrolling. Wheel scroll over the gallery should still scroll the page; dragging rotates the wheel.
- **Needs from client:** current exec headshots (same 4:5 crop and background), names, roles, LinkedIn URLs. The old `cross-year` repo has 67 headshots, but they're from earlier teams.

## 5. Sponsors (issue 3)
**Logo sourcing, in priority order:**
1. `VandyHacks/cross-year/public/sponsors/`: full wordmarks at 600–2560 px for AllianceBernstein, Asurion, BNY, Capital One, Centene, Dollar General, Eventbrite, FulcrumGT, Google, Home Depot, HRT, IMC, L3Harris, Microsoft, MicroStrategy, MLH, Red Ventures, Tractor Supply, Vanguard, Vanderbilt Engineering / Ventures / Ingram Commons (+ Bank of Singapore? `bos.png`, Exponent, echo3D, which aren't in the current list).
2. `VandyHacks/vh11-promo-site/src/assets/sponsors_logos/`: SVG wordmarks for Asurion, Capital One, MLH, Perplexity, Salesforce, Wolfram|Alpha.
3. Official brand/press kits, then Wikimedia Commons SVG wordmarks, then svgl.app for the rest (AT&T, DigiKey, Fidelity, Hillman, Lexmark, Macy's, Epic, etc.). Lunar Lincoln has no logo at all.

**Normalize:** SVG wherever possible, a **single-color white** version of each (or CSS `brightness(0) invert(1)`), trimmed to the artwork, and a per-logo `scale` field in the data so wide wordmarks and square marks look the same size. Show brand color on hover.

**Cards:** replace the two 26-logo marquees, which are hard to scan and click, with a responsive grid of uniform `GlassCard`s (3:2, logo centred, SpotlightCard purple glow, ↗ on hover). Add a final **"Your logo here → Become a sponsor"** card that opens the sponsor form. Once XIII sponsors are signed, add tiered rows above (Title / Gold / Silver / Partner, with larger cards for higher tiers). Optionally keep one slow `LogoLoop` strip at the top as a teaser.

## 6. FAQ (issue 2)
Accordion with category tabs (Cal Hacks pattern), using the existing `<details>` markup plus a category filter. Questions marked (?) need a policy answer from the client.

- **General:** What is VandyHacks? · What is a hackathon? · When and where is XIII? · How much does it cost? (?) · Is it in person? · What's the code of conduct? (MLH)
- **Applying:** Who can apply? (18+, enrolled student) · Can high-school students attend? (?) · I've never been to a hackathon / I can't code · When do applications open? (→ interest form) · Do I need a team? Max size? (4) · How are teams formed?
- **At the event:** What should I bring? · Will food be provided? (?) · Can I sleep at the venue? (?) · Will hardware be available? (?) · Can I submit an older project? · What can I build? · Am I eligible for prizes? · Is there parking? · Travel reimbursement? (VH XII said no; confirm) · Accessibility accommodations?
- **Get involved:** How do I sponsor? · How do I judge or mentor? · Can I volunteer? (each links to the on-page form tab) · I have another question.

Most answers can be adapted from `VandyHacks/vh12/lib/constants.jsx` (17 Q&As) and the VH VII/VIII FAQ JSON.

## 7. Forms, backend, and admin dashboard (issue 4)

### Front end
A **"Get Involved"** section with three tabs: **Stay in the loop** (early interest) · **Judge / Mentor** · **Sponsor**. It's styled as a terminal panel (`> NAME _`), matching the CRT theme and PennApps' notify-me form. The hero/nav CTAs and footer links deep-link to the right tab (`#get-involved?tab=sponsor`).

| Form | Fields |
|---|---|
| Early interest | name, email, school, graduation year, "first hackathon?" |
| Judge / Mentor | name, email, organization, title, role (judge / mentor / both), expertise tags, availability, LinkedIn |
| Sponsor | company, contact name, email, phone (optional), tier interest, message |

Built with Server Actions + `useActionState` + Zod validation, following `node_modules/next/dist/docs/01-app/02-guides/forms.md`. Inline success state ("✓ You're on the list") with no navigation away. Spam protection: honeypot field + Cloudflare Turnstile + per-IP rate limit. Add a short privacy note under each form.

### Backend: recommended **Supabase** (Postgres + Auth)
- Tables `interest_signups`, `judge_applications`, `sponsor_inquiries` (each with `status`, `notes`, `created_at`), plus `admins (email)`.
- Inserts happen only in Server Actions using the server-side service key. RLS denies everything to the anon key, so the browser never touches the DB.
- **Resend** sends a confirmation email to the submitter and a notification to info@vandyhacks.org for judge/sponsor submissions.
- Free tier covers this volume. The Supabase table editor is a zero-code backup dashboard.

### Dashboard: `/admin` in this same Next app
- Sign-in with Supabase Auth (Google or magic link), allowed only for emails in `admins`. Enforce it in `proxy.ts` (Next 16's renamed middleware) **and** in every admin page and Server Action, as Next's docs warn that render-time gating isn't a security boundary.
- Views: one tab per form with counts, search, filters, status pipeline (new → contacted → confirmed / declined), notes, and CSV export.

### Alternatives considered
- **Extend `VandyHacks/witness`** (apply.vandyhacks.org): VH's own judging/application platform with organizer roles already built. It's on Next 12, Mongo, and NextAuth v4, and is a heavier lift. Worth it only if the client wants judges to flow straight into judging.
- **Neon + Drizzle + Auth.js:** same idea with more wiring.
- **Convex:** nice realtime dashboard, but a new paradigm for the team.
- **Tally/Formspree embed:** fastest, but third-party styling breaks the "everything on our page" requirement.

**Hosting note:** Server Actions need a server runtime (Netlify or Vercel). Past VH sites used Netlify, which works fine. A static export would not.

## 8. Phasing
1. **Quick wins:** event constants + date fix, fonts, color tokens, nav fixes, `user-select`, stat corrections, hero date/location/CTA, countdown.
2. **Sponsors:** logo replacement + card grid.
3. **FAQ** categories + content; **Team** CircularGallery (blocked on photos).
4. **Forms + Supabase + Resend + `/admin`.**
5. **Track-record timeline**, past-project cards, photo strip, polish pass.

## Open questions for the client
1. What exactly does the countdown target? Date, time, and is April 2 check-in or opening? (The site currently says both "March 2027" and "April 3–4".)
2. Exec roster: headshots, names, roles, LinkedIn URLs.
3. Can they confirm attendance or school counts (MLH reports or registration exports) for stronger stats?
4. Policy answers for the FAQ items marked (?).
5. Who needs dashboard access, and which hosting account should Supabase/Resend live under (ideally a shared VandyHacks account, not a personal one)?
6. Are XIII sponsor tiers defined yet?
7. Do they have event photos from VH X–XII?
