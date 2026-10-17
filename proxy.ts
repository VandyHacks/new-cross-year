import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Runs only on /admin. It refreshes the Supabase session cookie and does an
// optimistic redirect for visitors with no session. It is NOT the security
// boundary: pages and actions re-verify via lib/admin/auth.ts.
export async function proxy(request: NextRequest) {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) return NextResponse.next();

	let response = NextResponse.next({ request });
	const supabase = createServerClient(url, anonKey, {
		cookies: {
			getAll: () => request.cookies.getAll(),
			setAll(cookiesToSet) {
				for (const { name, value } of cookiesToSet) {
					request.cookies.set(name, value);
				}
				response = NextResponse.next({ request });
				for (const { name, value, options } of cookiesToSet) {
					response.cookies.set(name, value, options);
				}
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user && request.nextUrl.pathname !== "/admin/login") {
		const redirect = NextResponse.redirect(
			new URL("/admin/login", request.url),
		);
		// Carry over any cookies the refresh just set (e.g. clearing a bad token).
		for (const cookie of response.cookies.getAll()) {
			redirect.cookies.set(cookie);
		}
		return redirect;
	}
	return response;
}

export const config = {
	matcher: ["/admin/:path*"],
};
