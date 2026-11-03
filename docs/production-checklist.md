# Production checklist

What's left before the site goes live. Supabase itself is already set up:
the `vandyhacks` project (`nofyhemmnykcnwhvoaxv`, us-east-1) has the schema,
RLS, the first admin, and public sign-ups turned off. Work through the
sections in order: hosting needs the domain, and SMTP needs DNS.

## 1. Hosting

The site needs a Node runtime (Server Actions, `/admin`, the proxy), so a
static export or static host won't work. **Vercel** is the simplest fit for
Next.js 16; Netlify (with its Next.js runtime) also works.

- [ ] Create the project from `VandyHacks/new-cross-year` under a shared
      VandyHacks team account, not a personal one.
- [ ] Node 22+ (`supabase-js` warns that Node 20 is deprecated).
- [ ] Production environment variables (copy from `.env.local`, then change
      the ones marked):

| Variable                                                 | Value                                                     |
| -------------------------------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                   | `https://<your domain>` (**new**, no trailing slash)      |
| `NEXT_PUBLIC_SUPABASE_URL`                               | `https://nofyhemmnykcnwhvoaxv.supabase.co`                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                          | publishable key (`sb_publishable_…`)                      |
| `SUPABASE_SERVICE_ROLE_KEY`                              | secret key (`sb_secret_…`); mark **sensitive**            |
| `IP_HASH_SALT`                                           | a **new** long random string for production               |
| `CLIENT_IP_HEADER`                                       | leave empty unless the Cloudflare proxy is on (section 2) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | from Cloudflare Turnstile (section 2)                     |
| `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL_TO`        | only if form emails stay on Resend (section 3)            |

- [ ] Get keys with `npx supabase projects api-keys --remote --reveal`.
- [ ] Rebuild after changing any `NEXT_PUBLIC_*` value (they're inlined at
      build time).

## 2. Domain on Cloudflare

- [ ] Add the domain to the host (Vercel → Project → Domains) and create the
      records it asks for in Cloudflare DNS (apex `A`/`ALIAS` and `www`
      `CNAME`).
- [ ] Decide on the proxy (orange cloud):
    - **DNS only (grey cloud), recommended with Vercel/Netlify.** The host
      issues TLS and sets trusted client-IP headers itself. Leave
      `CLIENT_IP_HEADER` empty.
    - **Proxied (orange cloud).** Set SSL/TLS mode to **Full (strict)** and
      `CLIENT_IP_HEADER=cf-connecting-ip`. Only do this if the origin can't
      be reached directly (e.g. the `*.vercel.app` URL is disabled or
      protected); otherwise a client can forge that header to dodge rate
      limits.
- [ ] Redirect `www` ↔ apex one way (at the host).
- [ ] **Turnstile:** Cloudflare → Turnstile → add a widget for the domain
      (plus `localhost` for testing), then set both keys. The forms show the
      widget automatically once both are set.
- [ ] Optional: a Cloudflare email-routing or Zoho alias for
      `info@vandyhacks.org` if it doesn't exist yet.

## 3. Email with Zoho SMTP

Two different senders use email:

1. **Supabase Auth** (admin magic links). It uses Supabase's built-in mailer,
   which is limited to a few emails an hour and is for testing only.
2. **Form confirmations/notifications** (`lib/email.ts`), which currently
   call **Resend's API** and are skipped when `RESEND_API_KEY` is unset.

Steps:

- [ ] In Zoho Mail, create a sender mailbox (e.g. `noreply@<domain>` or
      `hello@vandyhacks.org`) and an **app-specific password** for it.
- [ ] Add Zoho's DNS records in Cloudflare: MX, SPF
      (`v=spf1 include:zoho.com ~all`), DKIM (from Zoho's admin console),
      and a DMARC record (start with `v=DMARC1; p=none; rua=mailto:<you>`).
      Keep these records DNS only.
- [ ] Supabase dashboard → Authentication → **SMTP Settings**: host
      `smtp.zoho.com` (`smtppro.zoho.com` for paid/org accounts), port
      `465` (SSL), the mailbox and app password, sender name "VandyHacks".
      Then raise **Rate Limits → emails sent per hour**.
- [ ] Optionally restyle the **Magic Link** email template (Authentication →
      Email Templates). Keep `{{ .ConfirmationURL }}`.
- [ ] Form emails, either:
    - keep Resend (verify the domain in Resend and set its 3 env vars), or
    - **code change:** switch `lib/email.ts` to Zoho SMTP (e.g. with
      `nodemailer`, using `SMTP_HOST/PORT/USER/PASS` env vars). The
      `sendEmail()` signature can stay the same, so callers don't change.
      Watch Zoho's daily sending limits.

## 4. Supabase production settings

- [ ] In `supabase/config.toml` under `[auth]`, set `site_url` to the
      production URL and add `https://<domain>/auth/callback` to
      `additional_redirect_urls` (keep the localhost entries for dev). Then
      `npx supabase config push`, review the diff, and confirm. Use the CLI,
      not the dashboard, so the repo stays the source of truth.
- [ ] Add the other organizers to `/admin/admins`.
- [ ] Delete leftover test rows from `/admin` (e.g. "Setup Test (delete me)").
- [ ] Free-tier projects **pause after a week of inactivity**. Upgrade to Pro
      before applications open, or make sure there's regular traffic.
- [ ] Backups: the free tier has none you can restore yourself. Export CSVs
      from `/admin` periodically, or use Pro for daily backups.

## 5. Launch pass

- [ ] Social preview image: `app/(site)/opengraph-image.png` (1200×630).
- [ ] Confirm the event start time in `lib/event.ts` (still a placeholder).
- [ ] On the live domain: submit each form, sign in to `/admin`, change a
      status, export a CSV, and confirm the emails arrive (and not in spam).
- [ ] Check response headers (`curl -I https://<domain>`) show
      `strict-transport-security`, `x-frame-options` and
      `content-security-policy: frame-ancestors 'none'`.
- [ ] `/admin` and `/auth` are excluded in `robots.txt`; don't link
      `/admin/login` anywhere public.
