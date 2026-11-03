// Supabase env access. Everything degrades gracefully when it is not set up
// yet (local dev, previews), so the marketing site still builds and runs.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isDatabaseConfigured = Boolean(supabaseUrl && supabaseServiceKey);

// Session cookies are only ever read on the server (there is no browser
// Supabase client), so keep them out of reach of page scripts.
export const sessionCookieOptions = {
	httpOnly: true,
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
} as const;
