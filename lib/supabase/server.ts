import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAuthConfigured, supabaseAnonKey, supabaseUrl } from "./config";

// Cookie-aware client for the signed-in admin's session (Server Components,
// Server Actions, Route Handlers).
export async function getSessionClient() {
	if (!isAuthConfigured) return null;
	const cookieStore = await cookies();
	return createServerClient(supabaseUrl!, supabaseAnonKey!, {
		cookies: {
			getAll: () => cookieStore.getAll(),
			setAll(cookiesToSet) {
				try {
					for (const { name, value, options } of cookiesToSet) {
						cookieStore.set(name, value, options);
					}
				} catch {
					// Called from a Server Component, which can't set cookies;
					// the proxy refreshes the session instead.
				}
			},
		},
	});
}
