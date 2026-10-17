// Field definitions for the three Get Involved forms. The server-side rules
// live in lib/forms/schemas.ts; keep names in sync with those schemas.
import { sponsorTiers } from "@/lib/forms/schemas";

export type FieldSpec = {
	name: string;
	label: string;
	type: "text" | "email" | "tel" | "url" | "select" | "textarea";
	required?: boolean;
	placeholder?: string;
	autoComplete?: string;
	options?: readonly { value: string; label: string }[];
	// Span both columns on wide screens.
	wide?: boolean;
	maxLength?: number;
};

const gradYears = [
	{ value: "", label: "Select…" },
	...Array.from({ length: 7 }, (_, index) => {
		const year = String(new Date().getFullYear() + index);
		return { value: year, label: year };
	}),
];

export const interestFields: FieldSpec[] = [
	{
		name: "name",
		label: "Name",
		type: "text",
		required: true,
		autoComplete: "name",
		maxLength: 120,
	},
	{
		name: "email",
		label: "Email",
		type: "email",
		required: true,
		autoComplete: "email",
		placeholder: "you@school.edu",
		maxLength: 254,
	},
	{
		name: "school",
		label: "School",
		type: "text",
		autoComplete: "organization",
		placeholder: "Vanderbilt University",
		maxLength: 160,
	},
	{
		name: "grad_year",
		label: "Graduation year",
		type: "select",
		options: gradYears,
	},
	{
		name: "first_hackathon",
		label: "First hackathon?",
		type: "select",
		options: [
			{ value: "", label: "Select…" },
			{ value: "yes", label: "Yes, it'd be my first" },
			{ value: "no", label: "No, I've hacked before" },
		],
	},
];

export const judgeFields: FieldSpec[] = [
	{
		name: "name",
		label: "Name",
		type: "text",
		required: true,
		autoComplete: "name",
		maxLength: 120,
	},
	{
		name: "email",
		label: "Email",
		type: "email",
		required: true,
		autoComplete: "email",
		maxLength: 254,
	},
	{
		name: "organization",
		label: "Organization",
		type: "text",
		autoComplete: "organization",
		maxLength: 160,
	},
	{
		name: "title",
		label: "Job title",
		type: "text",
		autoComplete: "organization-title",
		maxLength: 160,
	},
	{
		name: "role",
		label: "I'd like to",
		type: "select",
		required: true,
		options: [
			{ value: "", label: "Select…" },
			{ value: "judge", label: "Judge projects" },
			{ value: "mentor", label: "Mentor hackers" },
			{ value: "both", label: "Both" },
		],
	},
	{
		name: "linkedin",
		label: "LinkedIn",
		type: "url",
		placeholder: "linkedin.com/in/you",
		maxLength: 300,
	},
	{
		name: "expertise",
		label: "Areas of expertise",
		type: "text",
		placeholder: "ML, mobile, hardware, design…",
		wide: true,
		maxLength: 500,
	},
	{
		name: "availability",
		label: "Availability",
		type: "text",
		placeholder: "e.g. all weekend, Saturday only",
		wide: true,
		maxLength: 500,
	},
];

export const sponsorFields: FieldSpec[] = [
	{
		name: "company",
		label: "Company",
		type: "text",
		required: true,
		autoComplete: "organization",
		maxLength: 160,
	},
	{
		name: "contact_name",
		label: "Your name",
		type: "text",
		required: true,
		autoComplete: "name",
		maxLength: 120,
	},
	{
		name: "email",
		label: "Work email",
		type: "email",
		required: true,
		autoComplete: "email",
		maxLength: 254,
	},
	{
		name: "phone",
		label: "Phone",
		type: "tel",
		autoComplete: "tel",
		maxLength: 40,
	},
	{
		name: "tier_interest",
		label: "Interested in",
		type: "select",
		options: sponsorTiers,
		wide: true,
	},
	{
		name: "message",
		label: "Anything we should know?",
		type: "textarea",
		wide: true,
		maxLength: 2000,
	},
];
