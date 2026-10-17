"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";
import { escapeHtml, notifyTo, sendEmail } from "@/lib/email";
import { EVENT } from "@/lib/event";
import {
	interestSchema,
	judgeSchema,
	sponsorSchema,
	sponsorTiers,
} from "@/lib/forms/schemas";
import type { FormState } from "@/lib/forms/types";
import { getServiceClient } from "@/lib/supabase/service";

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
const HONEYPOT_FIELD = "website";
const TURNSTILE_FIELD = "cf-turnstile-response";

type Table = "interest_signups" | "judge_applications" | "sponsor_inquiries";

async function clientIp() {
	const h = await headers();
	return (
		h.get("x-nf-client-connection-ip") ??
		h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		h.get("x-real-ip") ??
		"unknown"
	);
}

function hashIp(ip: string) {
	return createHash("sha256")
		.update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`)
		.digest("hex")
		.slice(0, 32);
}

async function passesTurnstile(token: string, ip: string) {
	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) return true; // Turnstile not configured
	if (!token) return false;
	try {
		const response = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				body: new URLSearchParams({
					secret,
					response: token,
					...(ip !== "unknown" ? { remoteip: ip } : {}),
				}),
			},
		);
		const result = (await response.json()) as { success?: boolean };
		return result.success === true;
	} catch (error) {
		console.error("Turnstile verification failed", error);
		return false;
	}
}

type Submission<S extends z.ZodType> = {
	table: Table;
	schema: S;
	formData: FormData;
	successMessage: string;
	afterInsert?: (data: z.output<S>) => Promise<void>;
};

async function submit<S extends z.ZodType>({
	table,
	schema,
	formData,
	successMessage,
	afterInsert,
}: Submission<S>): Promise<FormState> {
	const raw: Record<string, string> = {};
	for (const [key, value] of formData.entries()) {
		if (typeof value === "string" && !key.startsWith("$ACTION_")) {
			raw[key] = value;
		}
	}
	const honeypot = raw[HONEYPOT_FIELD];
	const turnstileToken = raw[TURNSTILE_FIELD] ?? "";
	delete raw[HONEYPOT_FIELD];
	delete raw[TURNSTILE_FIELD];

	// Bots fill the hidden field; pretend it worked so they don't adapt.
	if (honeypot) return { status: "success", message: successMessage };

	const ip = await clientIp();
	if (!(await passesTurnstile(turnstileToken, ip))) {
		return {
			status: "error",
			message: "We couldn't verify you're human. Please try again.",
			values: raw,
		};
	}

	const parsed = schema.safeParse(raw);
	if (!parsed.success) {
		return {
			status: "error",
			message: "Please fix the highlighted fields.",
			errors: z.flattenError(parsed.error).fieldErrors as Record<
				string,
				string[] | undefined
			>,
			values: raw,
		};
	}

	const db = getServiceClient();
	if (!db) {
		console.error(
			"Form submitted but Supabase is not configured (see .env.example).",
		);
		return {
			status: "error",
			message: `Sign-ups aren't open just yet. Email ${EVENT.email} and we'll get you set up.`,
			values: raw,
		};
	}

	const ipHash = hashIp(ip);
	const since = new Date(Date.now() - RATE_LIMIT.windowMs).toISOString();
	const { count, error: countError } = await db
		.from(table)
		.select("id", { count: "exact", head: true })
		.eq("ip_hash", ipHash)
		.gte("created_at", since);
	if (countError) {
		console.error(`Rate-limit check failed for ${table}`, countError);
		return {
			status: "error",
			message: "Something went wrong. Please try again in a moment.",
			values: raw,
		};
	}
	if ((count ?? 0) >= RATE_LIMIT.max) {
		return {
			status: "error",
			message:
				"Too many submissions from your network. Please try again later.",
			values: raw,
		};
	}

	const { error } = await db
		.from(table)
		.insert({ ...(parsed.data as object), ip_hash: ipHash });

	// Unique violation: this email already signed up. Treat as success so the
	// form can't be used to discover who is on the list.
	if (error && error.code !== "23505") {
		console.error(`Insert into ${table} failed`, error);
		return {
			status: "error",
			message: "Something went wrong. Please try again in a moment.",
			values: raw,
		};
	}

	if (!error && afterInsert) {
		after(() => afterInsert(parsed.data));
	}
	return { status: "success", message: successMessage };
}

const emailShell = (body: string) =>
	`<div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111">${body}<p style="color:#666;font-size:13px;margin-top:24px">VandyHacks · ${escapeHtml(EVENT.venue)}, ${escapeHtml(EVENT.city)}</p></div>`;

const detailRows = (rows: [string, string][]) =>
	`<table style="border-collapse:collapse">${rows
		.filter(([, value]) => value)
		.map(
			([label, value]) =>
				`<tr><td style="padding:2px 12px 2px 0;color:#666">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`,
		)
		.join("")}</table>`;

export async function submitInterest(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	return submit({
		table: "interest_signups",
		schema: interestSchema,
		formData,
		successMessage:
			"You're on the list! We'll email you when applications open.",
		afterInsert: (data) =>
			sendEmail({
				to: data.email,
				subject: `You're on the ${EVENT.name} list`,
				html: emailShell(
					`<p>Hi ${escapeHtml(data.name)},</p><p>Thanks for your interest in ${escapeHtml(EVENT.name)} (${escapeHtml(EVENT.dateLabel)}). We'll email you as soon as applications open.</p>`,
				),
			}),
	});
}

export async function submitJudge(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	return submit({
		table: "judge_applications",
		schema: judgeSchema,
		formData,
		successMessage:
			"Thank you! We've received your interest and will follow up with next steps.",
		afterInsert: async (data) => {
			await Promise.all([
				sendEmail({
					to: data.email,
					subject: `Thanks for offering to help at ${EVENT.name}`,
					html: emailShell(
						`<p>Hi ${escapeHtml(data.name)},</p><p>Thanks for offering to ${data.role === "both" ? "judge and mentor" : data.role} at ${escapeHtml(EVENT.name)}. We'll follow up with next steps soon.</p>`,
					),
				}),
				sendEmail({
					to: notifyTo,
					replyTo: data.email,
					subject: `New judge/mentor interest: ${data.name}`,
					html: emailShell(
						detailRows([
							["Name", data.name],
							["Email", data.email],
							["Organization", data.organization],
							["Title", data.title],
							["Role", data.role],
							["Expertise", data.expertise],
							["Availability", data.availability],
							["LinkedIn", data.linkedin],
						]),
					),
				}),
			]);
		},
	});
}

export async function submitSponsor(
	_prev: FormState,
	formData: FormData,
): Promise<FormState> {
	return submit({
		table: "sponsor_inquiries",
		schema: sponsorSchema,
		formData,
		successMessage:
			"Thanks for reaching out! Our sponsorship team will be in touch soon.",
		afterInsert: async (data) => {
			const tier =
				sponsorTiers.find((item) => item.value === data.tier_interest)
					?.label ?? data.tier_interest;
			await Promise.all([
				sendEmail({
					to: data.email,
					subject: `Thanks for your interest in sponsoring ${EVENT.name}`,
					html: emailShell(
						`<p>Hi ${escapeHtml(data.contact_name)},</p><p>Thanks for your interest in sponsoring ${escapeHtml(EVENT.name)}. Our team will be in touch soon.</p>`,
					),
				}),
				sendEmail({
					to: notifyTo,
					replyTo: data.email,
					subject: `New sponsor inquiry: ${data.company}`,
					html: emailShell(
						detailRows([
							["Company", data.company],
							["Contact", data.contact_name],
							["Email", data.email],
							["Phone", data.phone],
							["Tier", tier],
							["Message", data.message],
						]),
					),
				}),
			]);
		},
	});
}
