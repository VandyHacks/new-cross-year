import { z } from "zod";

const text = (label: string, max: number) =>
	z.string().trim().max(max, `${label} is too long (max ${max} characters).`);

const required = (label: string, max: number) =>
	text(label, max).min(1, `${label} is required.`);

const email = z
	.string()
	.trim()
	.toLowerCase()
	.min(1, "Email is required.")
	.max(254, "Email is too long.")
	.pipe(z.email("Enter a valid email address."));

// Accepts "linkedin.com/in/x" as well as full URLs; empty is fine.
const optionalUrl = text("Link", 300)
	.transform((value) =>
		value && !/^https?:\/\//i.test(value) ? `https://${value}` : value,
	)
	.refine(
		(value) => {
			if (!value) return true;
			try {
				const url = new URL(value);
				return url.protocol === "https:" || url.protocol === "http:";
			} catch {
				return false;
			}
		},
		{ message: "Enter a valid link." },
	);

export const interestSchema = z.object({
	name: required("Name", 120),
	email,
	school: text("School", 160),
	grad_year: z
		.string()
		.trim()
		// "grad" (Graduate Student) and "" both store as null — the column only
		// holds a class year (smallint 2024–2040).
		.transform((value) =>
			value === "" || value === "grad" ? null : Number(value),
		)
		.refine(
			(value) =>
				value === null ||
				(Number.isInteger(value) && value >= 2024 && value <= 2040),
			{ message: "Enter a graduation year between 2024 and 2040." },
		),
	first_hackathon: z
		.enum(["yes", "no", ""])
		.transform((value) => (value === "" ? null : value === "yes")),
});

export const judgeSchema = z.object({
	name: required("Name", 120),
	email,
	organization: text("Organization", 160),
	title: text("Title", 160),
	role: z.enum(["judge", "mentor", "both"], "Choose how you'd like to help."),
	expertise: text("Expertise", 500),
	availability: text("Availability", 500),
	linkedin: optionalUrl,
});

export const sponsorTiers = [
	{ value: "financial", label: "Financial Sponsorship" },
	{ value: "in_kind", label: "In-Kind Sponsorship" },
] as const;

export const sponsorSchema = z.object({
	company: required("Company", 160),
	contact_name: required("Your name", 120),
	email,
	phone: text("Phone", 40),
	tier_interest: z.enum(
		sponsorTiers.map((tier) => tier.value) as [string, ...string[]],
		"Choose a tier.",
	),
	message: text("Message", 2000),
});
