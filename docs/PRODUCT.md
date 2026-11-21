# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students exploring Vanderbilt's student-run hackathon, returning participants,
and prospective sponsors, judges, and mentors. Visitors learn about VandyHacks,
explore past events, and register interest or choose a way to get involved.

## Product Purpose

Introduce VandyHacks XIII, demonstrate the organization's history, and help
visitors register interest or get involved. The public website advertises the
hackathon; its History section should communicate its legacy through past-event
artwork rather than present a detailed statistical report.

## Positioning

VandyHacks is Vanderbilt University's student-run hackathon organization in
Nashville. Its own past editions, student projects, and community provide the
site's evidence. Do not invent rankings, attendance claims, or comparative
advantages to differentiate it from other hackathons.

## Operating Context

The existing Next.js website includes public event information, a historical
archive, sponsor and team information, FAQs, and interest/judge/sponsor forms.
A separate private admin area supports submission management. The README
records that forms and admin functionality require Supabase configuration;
this document does not assert that production services are connected.

The user contributes updates through a fork of `VandyHacks/new-cross-year`.
Historical artwork is maintained as local website assets. Each edition's
artwork links to that edition's Devpost page.

## Capabilities and Constraints

- The public section is named History, replacing Impact in navigation.
- Scrolling down moves the musical history horizontally, following the user's
  supplied sketch and HackUTD history interaction reference. Preserve usable
  navigation and a fallback for reduced motion or limited screen height.
- Each numbered edition has its own artwork and Devpost destination. The two
  editions in 2015 are distinct events.
- Artwork must be replaceable without rebuilding the timeline component.
  Missing, unusable, or intentionally omitted artwork uses the VandyHacks logo.
- Keep existing form field contracts and deep links working during design work.
- Event start/end times are not confirmed. The date label and timestamp values
  in `lib/event.ts` currently disagree; this is an open content decision, not
  authority to invent or silently change dates.

## Brand Commitments

Curious, creative, welcoming. Preserve the VandyHacks identity and the existing
vinyl/music direction. The user confirmed the current navy/purple identity and
supplied a music-staff sketch with clickable artwork noteheads, a treble clef,
and a time signature. These are binding references for History, not a request
to copy another organization's identity or artwork.

## Evidence on Hand

- `lib/hackathons.ts`: edition records and their Devpost links, transcribed from
  the user's VandyHacks Track Record workbook and cross-checked with its PDF.
- `public/history/`: original VI–XI event images retrieved from Devpost, with a
  README recording provenance and replacement instructions. Editions without a
  confirmed theme use the existing VandyHacks logo.
- `public/logo-trimmed.png`: the existing VandyHacks logo used for fallback.
- `public/about/`: existing event photographs. Do not attribute them to specific
  editions without supporting information.
- `lib/team.ts`, `lib/sponsors.ts`, and `lib/faq.ts`: existing website content.
- `lib/event.ts`: existing event details and contact/deep-link constants, subject
  to the unresolved event-timing issue above.

Devpost registrations do not establish verified attendance or unique people
across editions. Listed prize values can include non-cash items. Do not invent
missing artwork, attendance records, testimonials, or cash-award claims.

## Product Principles

- Advertise the experience through real history and approachable content.
- Make historical artwork and projects easy to explore without trapping visitors
  in a scroll sequence.
- Keep content, edition destinations, and replaceable assets separate from layout.
- Preserve evidence and its meaning when selecting promotional highlights.
- Keep the existing identity and navigation consistent across public sections.

## Anti-references

Generic dashboards, unsupported impact claims, and lengthy scroll sequences
that prevent visitors from exploring the history or continuing through the site.

## Accessibility & Inclusion

Support keyboard navigation, visible focus, touch scrolling, readable contrast,
and reduced motion. Keep edition links and event information in semantic HTML.
No additional product-specific accessibility standard has been established.
