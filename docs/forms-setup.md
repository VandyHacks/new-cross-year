# Forms, backend, and admin dashboard: setup

The Get Involved forms (early interest, judge/mentor, sponsor) save to
[Supabase](https://supabase.com) Postgres from Next.js Server Actions. The
private dashboard lives at `/admin`. Until Supabase is connected the forms show
a friendly "not open yet, email us" message and `/admin` shows a setup notice,
so the marketing site always works.

## 1. Create the Supabase project

1. Create a project at supabase.com (use a shared VandyHacks account, not a
   personal one, so access survives officer turnover).
2. Open **SQL Editor** and run
   [`supabase/migrations/20261017000000_init.sql`](../supabase/migrations/20261017000000_init.sql).
   It creates the three submission tables and the `admins` allowlist with Row
   Level Security on and **no policies**, so the public keys can't read or
   write anything. Only the server (service-role key) touches the data.
3. Add the first admin (use the email you'll sign in with, lowercase):

    ```sql
    insert into admins (email) values ('you@vanderbilt.edu');
    ```

## 2. Environment variables

Copy `.env.example` to `.env.local` (local) and set the same values in your
host's environment settings (production).

| Variable                                                 | Where to find it       | Notes                                                            |
| -------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                               | Project Settings → API |                                                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                          | Project Settings → API | Public by design. Grants nothing because of RLS.                 |
| `SUPABASE_SERVICE_ROLE_KEY`                              | Project Settings → API | **Secret.** Server only. Never prefix with `NEXT_PUBLIC_`.       |
| `IP_HASH_SALT`                                           | any long random string | Used to hash IPs for rate limiting (no raw IPs are stored).      |
| `NEXT_PUBLIC_SITE_URL`                                   | your production URL    | Optional; used in sign-in links. Falls back to the request host. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL_TO`        | resend.com             | Optional email notifications (below).                            |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile   | Optional CAPTCHA (below).                                        |

Restart `npm run dev` after changing env vars. Never commit `.env.local`
(it is git-ignored).

## 3. Admin sign-in (Supabase Auth)

Sign-in is a magic link emailed to addresses in the `admins` table. In
**Authentication → URL Configuration** add:

- Site URL: your production URL
- Redirect URLs: `https://YOUR-DOMAIN/auth/callback` and
  `http://localhost:3000/auth/callback`

Having a Supabase auth user is not enough to get in: every admin page, action
and export re-checks the `admins` table on the server. To revoke access,
delete the row. Supabase's built-in mailer is heavily rate-limited, so for real
use configure **Authentication → SMTP** (Resend works) before launch.

## 4. Notification emails (optional)

With `RESEND_API_KEY` set, submitters get a confirmation, and judge/sponsor
submissions also notify `NOTIFY_EMAIL_TO` (reply-to is the submitter).
`EMAIL_FROM` must use a domain verified in Resend. Email failures are logged
and never block a submission.

## 5. Spam protection

Always on: a hidden honeypot field, server-side validation, and a limit of 5
submissions per network per hour per form. Optionally add Cloudflare Turnstile
by setting both Turnstile keys; the widget then appears in every form.

## Using the dashboard

`/admin` shows counts for each form. Each list supports search, a status
filter, inline status (new / contacted / confirmed / declined / archived) and
notes, and **Export CSV** (respecting the current filters). Duplicate emails
on the interest and judge forms are silently ignored.

## Hosting

Server Actions and `/admin` need a server runtime (Netlify with its Next.js
support, or Vercel). A static export will not work.

## What was and wasn't tested

Verified against a local fake of the Supabase auth and REST endpoints:
validation, honeypot, duplicates, rate limiting, the admin gate (anonymous,
signed-in non-admin, admin), status/notes edits, CSV export, and the magic-link
allowlist. **Not yet verified against a real Supabase project, real magic-link
email delivery, Resend, or Turnstile.** Do a full pass once credentials exist:
submit each form, check the row in Supabase, sign in to `/admin`, edit a row,
and export a CSV.
