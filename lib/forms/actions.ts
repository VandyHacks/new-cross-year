"use server";

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
import { clientIp, hashValue, passesTurnstile } from "@/lib/request-guard";
import { getServiceClient } from "@/lib/supabase/service";

const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };
const HONEYPOT_FIELD = "website";
// Values echoed back to the form on error are capped so a bloated request
// isn't reflected in full.
const ECHO_MAX = 4000;

type Table = "interest_signups" | "judge_applications" | "sponsor_inquiries";

type Submission<S extends z.ZodObject> = {
	table: Table;
	schema: S;
	formData: FormData;
	successMessage: string;
	afterInsert?: (data: z.output<S>) => Promise<void>;
};

async function submit<S extends z.ZodObject>({
	table,
	schema,
	formData,
	successMessage,
	afterInsert,
}: Submission<S>): Promise<FormState> {
	// Read only the fields this form defines. Unknown keys (and File parts)
	// are ignored, so extra columns like `status` or `ip_hash` can never be
	// smuggled into the insert or echoed back.
	const raw: Record<string, string> = {};
	for (const key of Object.keys(schema.shape)) {
		const value = formData.get(key);
		if (typeof value === "string") raw[key] = value;
	}
	const echo = Object.fromEntries(
		Object.entries(raw).map(([key, value]) => [
			key,
			value.slice(0, ECHO_MAX),
		]),
	);
	const honeypotValue = formData.get(HONEYPOT_FIELD);
	const honeypot = typeof honeypotValue === "string" && honeypotValue.trim();

	// Bots fill the hidden field; pretend it worked so they don't adapt.
	if (honeypot) return { status: "success", message: successMessage };

	const ip = await clientIp();
	if (!(await passesTurnstile(formData, ip))) {
		return {
			status: "error",
			message: "We couldn't verify you're human. Please try again.",
			values: echo,
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
			values: echo,
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
			values: echo,
		};
	}

	const ipHash = hashValue(ip);
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
			values: echo,
		};
	}
	if ((count ?? 0) >= RATE_LIMIT.max) {
		return {
			status: "error",
			message:
				"Too many submissions from your network. Please try again later.",
			values: echo,
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
			values: echo,
		};
	}

	if (!error && afterInsert) {
		after(() => afterInsert(parsed.data as z.output<S>));
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

// Submitters only see the on-page confirmation; we never email the address
// they typed in, so the forms can't be used to send mail to a stranger.
// Judge/mentor and sponsor submissions still notify the team inbox.

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
		afterInsert: (data) =>
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
		afterInsert: (data) => {
			const tier =
				sponsorTiers.find((item) => item.value === data.tier_interest)
					?.label ?? data.tier_interest;
			return sendEmail({
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
			});
		},
	});
}
