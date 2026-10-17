-- VandyHacks XIII: form submissions + admin allowlist.
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- Security model: Row Level Security is enabled with NO policies, so the
-- public anon/authenticated keys can read and write nothing. The Next.js
-- server uses the service-role key (which bypasses RLS) inside Server Actions
-- and admin pages, after verifying the visitor/admin itself.

create extension if not exists pgcrypto;

create type submission_status as enum ('new', 'contacted', 'confirmed', 'declined', 'archived');

create table interest_signups (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	name text not null check (char_length(name) between 1 and 120),
	email text not null check (char_length(email) between 3 and 254),
	school text not null default '' check (char_length(school) <= 160),
	grad_year smallint check (grad_year between 2024 and 2040),
	first_hackathon boolean,
	status submission_status not null default 'new',
	notes text not null default '',
	ip_hash text
);
create unique index interest_signups_email_key on interest_signups (lower(email));
create index interest_signups_created_idx on interest_signups (created_at desc);
create index interest_signups_ip_idx on interest_signups (ip_hash, created_at desc);

create table judge_applications (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	name text not null check (char_length(name) between 1 and 120),
	email text not null check (char_length(email) between 3 and 254),
	organization text not null default '' check (char_length(organization) <= 160),
	title text not null default '' check (char_length(title) <= 160),
	role text not null check (role in ('judge', 'mentor', 'both')),
	expertise text not null default '' check (char_length(expertise) <= 500),
	availability text not null default '' check (char_length(availability) <= 500),
	linkedin text not null default '' check (char_length(linkedin) <= 300),
	status submission_status not null default 'new',
	notes text not null default '',
	ip_hash text
);
create unique index judge_applications_email_key on judge_applications (lower(email));
create index judge_applications_created_idx on judge_applications (created_at desc);
create index judge_applications_ip_idx on judge_applications (ip_hash, created_at desc);

create table sponsor_inquiries (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	company text not null check (char_length(company) between 1 and 160),
	contact_name text not null check (char_length(contact_name) between 1 and 120),
	email text not null check (char_length(email) between 3 and 254),
	phone text not null default '' check (char_length(phone) <= 40),
	tier_interest text not null default 'not_sure' check (tier_interest in ('title', 'gold', 'silver', 'partner', 'in_kind', 'not_sure')),
	message text not null default '' check (char_length(message) <= 2000),
	status submission_status not null default 'new',
	notes text not null default '',
	ip_hash text
);
create index sponsor_inquiries_created_idx on sponsor_inquiries (created_at desc);
create index sponsor_inquiries_ip_idx on sponsor_inquiries (ip_hash, created_at desc);

-- Emails allowed into /admin (compared case-insensitively; store lowercase).
create table admins (
	email text primary key check (email = lower(email)),
	created_at timestamptz not null default now()
);

alter table interest_signups enable row level security;
alter table judge_applications enable row level security;
alter table sponsor_inquiries enable row level security;
alter table admins enable row level security;

revoke all on interest_signups, judge_applications, sponsor_inquiries, admins from anon, authenticated;

-- Add yourself as the first admin, then sign in at /admin/login:
--   insert into admins (email) values ('you@vanderbilt.edu');
