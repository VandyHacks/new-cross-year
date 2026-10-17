// Single source of truth for event details — every date, place, and contact
// on the site reads from here.
// TODO: Confirm start/end times with the organizers (start is a placeholder).
export const EVENT = {
	name: "VandyHacks XIII",
	edition: "XIII",
	start: new Date("2027-04-02T18:00:00-05:00"),
	end: new Date("2027-04-04T14:00:00-05:00"),
	dateLabel: "April 2–4, 2027",
	venue: "Vanderbilt University",
	city: "Nashville, TN",
	email: "info@vandyhacks.org",
} as const;

// Stopgap CTAs until the on-page Get Involved forms exist (Phase 4) —
// swap these for the form anchors then.
const mailto = (subject: string) =>
	`mailto:${EVENT.email}?subject=${encodeURIComponent(subject)}`;

export const CTA = {
	interest: mailto(`${EVENT.name}: keep me posted`),
	judge: mailto(`${EVENT.name}: judging / mentoring`),
	sponsor: mailto(`${EVENT.name}: sponsorship`),
} as const;
