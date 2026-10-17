import "server-only";
import { createClient } from "@supabase/supabase-js";
import {
	isDatabaseConfigured,
	supabaseServiceKey,
	supabaseUrl,
} from "./config";

// Service-role client: bypasses RLS. Server-only — never import from a client
// component, and only call it after you've verified who is asking.
export function getServiceClient() {
	if (!isDatabaseConfigured) return null;
	return createClient(supabaseUrl!, supabaseServiceKey!, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
}
