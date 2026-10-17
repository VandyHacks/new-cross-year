import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isAuthConfigured, isDatabaseConfigured } from "@/lib/supabase/config";
import { getSessionClient } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";

export type AdminState =
	| { status: "unconfigured" }
	| { status: "anonymous" }
	| { status: "forbidden"; email: string }
	| { status: "admin"; email: string };

// Data access layer for the dashboard. The proxy only does an optimistic
// "is there a session?" check; THIS is the real gate, and every admin page,
// route handler and Server Action calls it. It verifies the session with
// Supabase (getUser validates the token server-side) and then checks the
// email against the `admins` allowlist.
export const getAdminState = cache(async (): Promise<AdminState> => {
	if (!isAuthConfigured || !isDatabaseConfigured) {
		return { status: "unconfigured" };
	}
	const session = await getSessionClient();
	const service = getServiceClient();
	if (!session || !service) return { status: "unconfigured" };

	const {
		data: { user },
	} = await session.auth.getUser();
	const email = user?.email?.toLowerCase();
	if (!user || !email) return { status: "anonymous" };

	const { data, error } = await service
		.from("admins")
		.select("email")
		.eq("email", email)
		.maybeSingle();
	if (error) {
		console.error("Admin allowlist lookup failed", error);
		return { status: "forbidden", email };
	}
	return data ? { status: "admin", email } : { status: "forbidden", email };
});

// For Server Actions and Route Handlers: returns the admin or redirects away.
export async function requireAdmin() {
	const state = await getAdminState();
	if (state.status === "admin") return state;
	if (state.status === "forbidden") redirect("/admin/login?error=forbidden");
	redirect("/admin/login");
}
