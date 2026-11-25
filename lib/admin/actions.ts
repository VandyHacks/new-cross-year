"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";
import { isKindId, kinds, statuses } from "@/lib/admin/kinds";
import { requireAdmin } from "@/lib/admin/auth";
import { getSessionClient } from "@/lib/supabase/server";
import { getServiceClient } from "@/lib/supabase/service";
import { cleanMultiline } from "@/lib/forms/schemas";
import { clientIp, hashValue, passesTurnstile } from "@/lib/request-guard";

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

// Admin sign-in limits. The IP limit applies to every request; the email
// limit only to allowlisted emails, and caps how many links one admin can be
// sent (protecting their inbox and the project-wide Supabase Auth email quota,
// which, once used up, blocks every admin from signing in for the hour).
const LOGIN_LIMITS = {
	ip: { max: 10, windowMs: 15 * 60 * 1000 },
	email: { max: 3, windowMs: 60 * 60 * 1000 },
	// Attempt rows older than this are pruned.
	keepMs: 24 * 60 * 60 * 1000,
};

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

type ServiceClient = NonNullable<ReturnType<typeof getServiceClient>>;
type SessionClient = NonNullable<Awaited<ReturnType<typeof getSessionClient>>>;

// Sends a magic link, but only to emails on the `admins` allowlist. Everything
// that depends on whether the email is an admin runs in `after()`, once the
// response has gone out, so the reply (and how long it takes) is the same for
// every email: the form can't be used to discover who the admins are. No
// Supabase auth user is ever created for outsiders.
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

	const ip = await clientIp();
	if (!(await passesTurnstile(formData, ip))) {
		redirect("/admin/login?error=captcha");
	}

	const ipHash = hashValue(ip);
	const { count, error: countError } = await service
		.from("admin_login_attempts")
		.select("id", { count: "exact", head: true })
		.eq("ip_hash", ipHash)
		.gte("created_at", ago(LOGIN_LIMITS.ip.windowMs));
	if (countError) {
		console.error("Admin sign-in rate-limit check failed", countError);
		redirect("/admin/login?error=server");
	}
	if ((count ?? 0) >= LOGIN_LIMITS.ip.max) {
		redirect("/admin/login?error=rate");
	}
	const { data: attempt, error: logError } = await service
		.from("admin_login_attempts")
		.insert({ ip_hash: ipHash })
		.select("id")
		.single();
	if (logError || !attempt) {
		console.error("Admin sign-in attempt log failed", logError);
		redirect("/admin/login?error=server");
	}

	const email = parsed.data;
	const redirectTo = `${await siteOrigin()}/auth/confirm`;
	after(() =>
		deliverMagicLink({
			service,
			session,
			email,
			attemptId: attempt.id as number,
			redirectTo,
		}),
	);
	redirect("/admin/login?sent=1");
}

async function deliverMagicLink({
	service,
	session,
	email,
	attemptId,
	redirectTo,
}: {
	service: ServiceClient;
	session: SessionClient;
	email: string;
	attemptId: number;
	redirectTo: string;
}) {
	const { error: pruneError } = await service
		.from("admin_login_attempts")
		.delete()
		.lt("created_at", ago(LOGIN_LIMITS.keepMs));
	if (pruneError) console.error("Admin sign-in prune failed", pruneError);

	const { data: admin, error } = await service
		.from("admins")
		.select("email")
		.eq("email", email)
		.maybeSingle();
	if (error) {
		console.error("Admin allowlist lookup failed", error);
		return;
	}
	if (!admin) return;

	const emailHash = hashValue(`email:${email}`);
	const { count, error: countError } = await service
		.from("admin_login_attempts")
		.select("id", { count: "exact", head: true })
		.eq("email_hash", emailHash)
		.gte("created_at", ago(LOGIN_LIMITS.email.windowMs));
	if (countError) {
		console.error("Admin sign-in email limit check failed", countError);
		return;
	}
	if ((count ?? 0) >= LOGIN_LIMITS.email.max) {
		console.warn("Admin sign-in link skipped: per-email limit reached");
		return;
	}
	const { error: markError } = await service
		.from("admin_login_attempts")
		.update({ email_hash: emailHash })
		.eq("id", attemptId);
	if (markError) {
		console.error("Admin sign-in attempt update failed", markError);
		return;
	}

	// Public sign-ups are off in Supabase Auth (anyone holding the public
	// key could otherwise create users and send mail through our SMTP), so
	// the server creates the auth user itself, only for allowlisted emails.
	const { error: createError } = await service.auth.admin.createUser({
		email,
		email_confirm: true,
	});
	const alreadyExists =
		createError?.code === "email_exists" ||
		createError?.code === "user_already_exists";
	if (createError && !alreadyExists) {
		console.error("Admin auth user creation failed", createError);
		return;
	}
	const { error: otpError } = await session.auth.signInWithOtp({
		email,
		options: {
			// The email template turns this into /auth/confirm?token_hash=…,
			// which works in any browser (unlike the PKCE /auth/callback flow,
			// which fails when the link opens in a mail app or another browser).
			emailRedirectTo: redirectTo,
			shouldCreateUser: false,
		},
	});
	// Supabase allows one link per email per minute; a repeat inside that
	// window means a link was just sent and still works.
	if (otpError && otpError.code !== "over_email_send_rate_limit") {
		console.error("Magic link failed", otpError);
	}
}

// Second half of the magic link: /auth/confirm shows a button that posts
// here. Verifying on a click (not on page load) keeps mail-scanner link
// previews from using up the one-time token before the admin gets to it.
export async function confirmMagicLink(formData: FormData) {
	const tokenHash = String(formData.get("token_hash") ?? "");
	const session = await getSessionClient();
	if (!tokenHash || !session) redirect("/admin/login?error=callback");

	const { error } = await session.auth.verifyOtp({
		type: "email",
		token_hash: tokenHash,
	});
	if (error) {
		console.error("Magic link verification failed", error.code ?? error);
		redirect("/admin/login?error=callback");
	}
	redirect("/admin");
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
		notes: cleanMultiline(
			String(formData.get("notes") ?? "").slice(0, 10000),
		),
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

// Hard delete, for spam. Real submissions should be archived instead.
export async function deleteSubmission(kindId: string, formData: FormData) {
	await requireAdmin();
	if (!isKindId(kindId)) throw new Error("Unknown submission type");
	const id = z.uuid().safeParse(formData.get("id"));
	if (!id.success) throw new Error("Invalid submission");

	const service = getServiceClient();
	if (!service) throw new Error("Database is not configured");
	const { error } = await service
		.from(kinds[kindId].table)
		.delete()
		.eq("id", id.data);
	if (error) {
		console.error("Submission delete failed", error);
		throw new Error("Could not delete submission");
	}
	revalidatePath(`/admin/${kindId}`);
	revalidatePath("/admin");
}

export async function addAdmin(formData: FormData) {
	await requireAdmin();
	const email = z.email().safeParse(
		String(formData.get("email") ?? "")
			.trim()
			.toLowerCase(),
	);
	if (!email.success) redirect("/admin/admins?error=email");

	const service = getServiceClient();
	if (!service) throw new Error("Database is not configured");
	const { error } = await service
		.from("admins")
		.upsert({ email: email.data }, { ignoreDuplicates: true });
	if (error) {
		console.error("Add admin failed", error);
		redirect("/admin/admins?error=server");
	}
	revalidatePath("/admin/admins");
	redirect("/admin/admins");
}

export async function removeAdmin(formData: FormData) {
	const { email: self } = await requireAdmin();
	const parsed = z.email().safeParse(
		String(formData.get("email") ?? "")
			.trim()
			.toLowerCase(),
	);
	if (!parsed.success) redirect("/admin/admins?error=email");
	const email = parsed.data;
	// Removing yourself would lock you out mid-session; ask another admin.
	if (email === self) redirect("/admin/admins?error=self");

	const service = getServiceClient();
	if (!service) throw new Error("Database is not configured");
	const { error } = await service.from("admins").delete().eq("email", email);
	if (error) {
		console.error("Remove admin failed", error);
		redirect("/admin/admins?error=server");
	}
	revalidatePath("/admin/admins");
	redirect("/admin/admins");
}
