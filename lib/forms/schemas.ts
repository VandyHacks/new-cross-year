import { z } from "zod";

// --- Sanitizing -------------------------------------------------------------
// Every free-text value is normalized before it is length-checked, stored,
// shown in the dashboard, exported to CSV or put in an email:
//   - Unicode NFC, so visually identical strings compare and count the same.
//   - Control characters removed (Postgres rejects NUL outright, and the rest
//     can break CSV rows, email headers and terminal logs).
//   - Bidi overrides/isolates removed: they let "gpj.exe" render as "exe.jpg"
//     or reorder an email address in the admin view.
//   - Zero-width and other invisible characters removed, so "​" can't
//     satisfy a required field or make two identical names look different.

// C0/C1 controls except tab and newline (multiline keeps those).
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
// Bidi embeddings/overrides/isolates, and the LRM/RLM/ALM marks.
const BIDI = /[؜‎‏‪-‮⁦-⁩]/g;
// Zero-width space/joiners, word joiner, invisible math operators, BOM,
// soft hyphen, Hangul fillers, and variation selectors on their own.
const INVISIBLE = /[­ᅟᅠ᠎​-‍⁠-⁤ㅤ﻿ﾠ]/g;

function stripUnsafe(value: string) {
	return value.normalize("NFC").replace(BIDI, "").replace(INVISIBLE, "");
}

// One line: tabs/newlines and runs of any whitespace become a single space.
export function cleanLine(value: string) {
	return stripUnsafe(value).replace(CONTROL, "").replace(/\s+/g, " ").trim();
}

// Multiline: normalize line endings, drop trailing spaces, and cap blank runs.
export function cleanMultiline(value: string) {
	return stripUnsafe(value)
		.replace(/\r\n?/g, "\n")
		.replace(CONTROL, "")
		.replace(/[^\S\n]+$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

// Cheap upper bound on the raw input, checked before any normalizing work so
// a megabyte string is rejected without being processed. Generous enough
// that stripped whitespace/invisibles never cause a false "too long".
const rawLimit = (max: number) => max * 4 + 64;

type TextOptions = { required?: boolean; multiline?: boolean };

const text = (
	label: string,
	max: number,
	{ required = false, multiline = false }: TextOptions = {},
) => {
	const output = z
		.string()
		.max(max, `${label} is too long (max ${max} characters).`);
	return z
		.string(`${label} is invalid.`)
		.max(rawLimit(max), `${label} is too long (max ${max} characters).`)
		.transform(multiline ? cleanMultiline : cleanLine)
		.pipe(required ? output.min(1, `${label} is required.`) : output);
};

// Names end up in "Hi {name}," in emails we send to the address the visitor
// typed, so a "name" carrying a link or markup would turn the form into a
// spam relay. Real names don't need either, and must contain a letter.
const LINKISH =
	/(:\/\/|\bwww\.|[<>]|\b[a-z0-9-]+\.(?:com|net|org|io|ru|xyz|top|info|biz|link|click|app|site|online|shop)\b)/i;

const personName = (label: string, max: number) =>
	text(label, max, { required: true })
		.refine((value) => !LINKISH.test(value), {
			message: `${label} can't contain links or markup.`,
		})
		.refine((value) => /\p{L}/u.test(value), {
			message: `Enter a valid ${label.toLowerCase()}.`,
		});

const email = z
	.string("Email is required.")
	.max(rawLimit(254), "Email is too long.")
	.transform((value) => cleanLine(value).toLowerCase())
	.pipe(
		z
			.string()
			.min(1, "Email is required.")
			.max(254, "Email is too long.")
			.pipe(z.email("Enter a valid email address.")),
	);

// Accepts "linkedin.com/in/x" as well as full URLs; empty is fine. Only
// LinkedIn hosts are allowed (the field is labelled LinkedIn, and an arbitrary
// link would be shown to admins as if it were a profile), and the stored value
// is the normalized https URL.
const LINKEDIN_HOST = /^(?:[a-z0-9-]+\.)*linkedin\.com$/;

const linkedinUrl = text("LinkedIn", 300)
	.transform((value, ctx) => {
		if (!value) return "";
		const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value)
			? value
			: `https://${value.replace(/^\/+/, "")}`;
		let url: URL;
		try {
			url = new URL(withScheme);
		} catch {
			ctx.addIssue({ code: "custom", message: "Enter a valid link." });
			return z.NEVER;
		}
		if (url.protocol !== "https:" && url.protocol !== "http:") {
			ctx.addIssue({ code: "custom", message: "Enter a valid link." });
			return z.NEVER;
		}
		if (
			!LINKEDIN_HOST.test(url.hostname) ||
			url.username ||
			url.password ||
			url.port
		) {
			ctx.addIssue({
				code: "custom",
				message: "Enter a linkedin.com profile link.",
			});
			return z.NEVER;
		}
		url.protocol = "https:";
		url.hash = "";
		return url.href;
	})
	.pipe(z.string().max(300, "LinkedIn link is too long."));

// Loose on formatting (people write numbers many ways) but strict on the
// alphabet, and a real number has 7–15 digits (E.164 allows at most 15).
const phone = text("Phone", 40).refine(
	(value) => {
		if (!value) return true;
		if (!/^\+?[\d\s().\-/]+(?:\s*(?:x|ext\.?)\s*\d{1,6})?$/i.test(value)) {
			return false;
		}
		const digits = value
			.replace(/\s*(?:x|ext\.?)\s*\d+$/i, "")
			.replace(/\D/g, "").length;
		return digits >= 7 && digits <= 15;
	},
	{ message: "Enter a valid phone number." },
);

// Missing optional select = no answer; anything else must be a listed value.
const optionalChoice = <T extends readonly [string, ...string[]]>(
	values: T,
	message: string,
) =>
	z
		.enum(["", ...values] as [string, ...string[]], message)
		.optional()
		.transform((value) => (value ? (value as T[number]) : null));

export const gradYearValues = ["2027", "2028", "2029", "2030", "grad"] as const;

export const interestSchema = z.object({
	name: personName("Name", 120),
	email,
	school: text("School", 160),
	// One of the listed class years or "grad" (Graduate Student).
	grad_year: optionalChoice(gradYearValues, "Choose a graduation year."),
	first_hackathon: optionalChoice(
		["yes", "no"] as const,
		"Choose yes or no.",
	).transform((value) => (value === null ? null : value === "yes")),
});

export const judgeSchema = z.object({
	name: personName("Name", 120),
	email,
	organization: text("Organization", 160),
	title: text("Title", 160),
	role: z.enum(["judge", "mentor", "both"], "Choose how you'd like to help."),
	expertise: text("Expertise", 500),
	availability: text("Availability", 500),
	linkedin: linkedinUrl,
});

export const sponsorTiers = [
	{ value: "financial", label: "Financial Sponsorship" },
	{ value: "in_kind", label: "In-Kind Sponsorship" },
] as const;

export const sponsorSchema = z.object({
	company: text("Company", 160, { required: true }).refine(
		(value) => !/[<>]/.test(value),
		{ message: "Company can't contain markup." },
	),
	contact_name: personName("Your name", 120),
	email,
	phone,
	tier_interest: z.enum(
		sponsorTiers.map((tier) => tier.value) as [string, ...string[]],
		"Choose a sponsorship type.",
	),
	message: text("Message", 2000, { multiline: true }),
});
