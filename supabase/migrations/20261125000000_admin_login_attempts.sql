-- Rate limiting for the admin sign-in form (/admin/login).
--
-- Every request records the hashed client IP, so one network can't hammer the
-- form. Requests for allowlisted emails also record the hashed email, so no
-- one can flood an admin's inbox or use up the project-wide Supabase Auth
-- email quota (which would block every admin from signing in). Both values
-- are salted hashes (IP_HASH_SALT); nothing here is readable as-is.
--
-- Same security model as the other tables: RLS on, no policies, no grants to
-- the public roles. Only the server's service-role key touches it.

create table admin_login_attempts (
	id bigint generated always as identity primary key,
	created_at timestamptz not null default now(),
	ip_hash text not null,
	email_hash text
);
create index admin_login_attempts_ip_idx on admin_login_attempts (ip_hash, created_at desc);
create index admin_login_attempts_email_idx on admin_login_attempts (email_hash, created_at desc)
	where email_hash is not null;

alter table admin_login_attempts enable row level security;
revoke all on admin_login_attempts from anon, authenticated;
