// Single source of truth for event details — every date, place, and contact
// on the site reads from here.
// TODO: Confirm start/end times with the organizers (start is a placeholder).
export const EVENT = {
	name: "VandyHacks XIII",
	edition: "XIII",
	// Central Daylight Time (UTC-5) in April. Keep in sync with dateLabel.
	start: new Date("2027-04-09T00:00:00-05:00"),
	end: new Date("2027-04-11T14:00:00-05:00"),
	dateLabel: "April 9–11, 2027",
	venue: "Vanderbilt University",
	city: "Nashville, TN",
	email: "info@vandyhacks.org",
} as const;

// In-page deep links into the Get Involved section (components/get-involved.tsx
// switches to the matching tab and scrolls to it).
export const CTA = {
	interest: "#get-involved/interest",
	judge: "#get-involved/judge",
	sponsor: "#get-involved/sponsor",
} as const;
