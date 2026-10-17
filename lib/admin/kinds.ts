// Describes the three submission tables for the admin dashboard.
export const statuses = [
	"new",
	"contacted",
	"confirmed",
	"declined",
	"archived",
] as const;
export type Status = (typeof statuses)[number];

export const kindIds = ["interest", "judge", "sponsor"] as const;
export type KindId = (typeof kindIds)[number];

export type Kind = {
	id: KindId;
	table: "interest_signups" | "judge_applications" | "sponsor_inquiries";
	label: string;
	singular: string;
	// Column that names the row, and the columns shown in its detail list.
	title: string;
	details: { key: string; label: string }[];
	// Columns searched by the dashboard's text filter.
	searchable: string[];
	// Columns exported to CSV, in order (ip_hash is deliberately excluded).
	csv: string[];
};

export const kinds: Record<KindId, Kind> = {
	interest: {
		id: "interest",
		table: "interest_signups",
		label: "Early interest",
		singular: "sign-up",
		title: "name",
		details: [
			{ key: "school", label: "School" },
			{ key: "grad_year", label: "Grad year" },
			{ key: "first_hackathon", label: "First hackathon" },
		],
		searchable: ["name", "email", "school"],
		csv: [
			"created_at",
			"name",
			"email",
			"school",
			"grad_year",
			"first_hackathon",
			"status",
			"notes",
		],
	},
	judge: {
		id: "judge",
		table: "judge_applications",
		label: "Judges & mentors",
		singular: "application",
		title: "name",
		details: [
			{ key: "role", label: "Role" },
			{ key: "organization", label: "Organization" },
			{ key: "title", label: "Title" },
			{ key: "expertise", label: "Expertise" },
			{ key: "availability", label: "Availability" },
			{ key: "linkedin", label: "LinkedIn" },
		],
		searchable: ["name", "email", "organization", "expertise"],
		csv: [
			"created_at",
			"name",
			"email",
			"role",
			"organization",
			"title",
			"expertise",
			"availability",
			"linkedin",
			"status",
			"notes",
		],
	},
	sponsor: {
		id: "sponsor",
		table: "sponsor_inquiries",
		label: "Sponsors",
		singular: "inquiry",
		title: "company",
		details: [
			{ key: "contact_name", label: "Contact" },
			{ key: "phone", label: "Phone" },
			{ key: "tier_interest", label: "Tier" },
			{ key: "message", label: "Message" },
		],
		searchable: ["company", "contact_name", "email"],
		csv: [
			"created_at",
			"company",
			"contact_name",
			"email",
			"phone",
			"tier_interest",
			"message",
			"status",
			"notes",
		],
	},
};

export function isKindId(value: string): value is KindId {
	return (kindIds as readonly string[]).includes(value);
}
