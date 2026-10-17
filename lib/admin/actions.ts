"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isKindId, kinds, statuses } from "@/lib/admin/kinds";
import { requireAdmin } from "@/lib/admin/auth";
import { getSessionClient } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";

async function siteOrigin() {
	const configured = process.env.NEXT_PUBLIC_SITE_URL;
	if (configured) return configured.replace(/\/$/, "");
	const h = await headers();
	const host = h.get("x-forwarded-host") ?? h.get("host");
	const proto =
		h.get("x-forwarded-proto") ??
		(host?.startsWith("localhost") ? "http" : "https");
	return `${proto}://${host}`;
}

// Sends a magic link, but only to emails on the `admins` allowlist. The
// response is identical either way so the form can't be used to discover who
// the admins are, and no Supabase auth user is ever created for outsiders.
export async function sendMagicLink(formData: FormData) {
	const parsed = z.email().safeParse(
		String(formData.get("email") ?? "")
			.trim()
			.toLowerCase(),
	);
	if (!parsed.success) redirect("/admin/login?error=email");

	const service = getServiceClient();
	const session = await getSessionClient();
	if (!service || !session) redirect("/admin/login");

	const { data: admin, error } = await service
		.from("admins")
		.select("email")
		.eq("email", parsed.data)
		.maybeSingle();
	if (error) {
		console.error("Admin allowlist lookup failed", error);
		redirect("/admin/login?error=server");
	}

	if (admin) {
		const { error: otpError } = await session.auth.signInWithOtp({
			email: parsed.data,
			options: {
				emailRedirectTo: `${await siteOrigin()}/auth/callback`,
				shouldCreateUser: true,
			},
		});
		if (otpError) {
			console.error("Magic link failed", otpError);
			redirect("/admin/login?error=server");
		}
	}
	redirect("/admin/login?sent=1");
}

export async function signOut() {
	const session = await getSessionClient();
	await session?.auth.signOut();
	redirect("/admin/login");
}

const updateSchema = z.object({
	id: z.uuid(),
	status: z.enum(statuses),
	notes: z.string().max(2000),
});

export async function updateSubmission(kindId: string, formData: FormData) {
	await requireAdmin();
	if (!isKindId(kindId)) throw new Error("Unknown submission type");

	const parsed = updateSchema.safeParse({
		id: formData.get("id"),
		status: formData.get("status"),
		notes: String(formData.get("notes") ?? "").trim(),
	});
	if (!parsed.success) throw new Error("Invalid update");

	const service = getServiceClient();
	if (!service) throw new Error("Database is not configured");
	const { error } = await service
		.from(kinds[kindId].table)
		.update({ status: parsed.data.status, notes: parsed.data.notes })
		.eq("id", parsed.data.id);
	if (error) {
		console.error("Submission update failed", error);
		throw new Error("Could not save changes");
	}
	revalidatePath(`/admin/${kindId}`);
	revalidatePath("/admin");
}
