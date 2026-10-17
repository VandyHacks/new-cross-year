import { NextResponse } from "next/server";
import { getSessionClient } from "@/lib/supabase/server";

// Magic-link landing: swaps the one-time code for a session cookie, then
// sends the admin to the dashboard (which re-checks the allowlist).
export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");
	const supabase = await getSessionClient();

	if (code && supabase) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) return NextResponse.redirect(`${origin}/admin`);
		console.error("Code exchange failed", error);
	}
	return NextResponse.redirect(`${origin}/admin/login?error=callback`);
}
