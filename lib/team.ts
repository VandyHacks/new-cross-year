// Exec team shown in the Team gallery.
// TODO: Replace the placeholders with real names, roles, headshots (4:5
// crop, same background) and LinkedIn URLs from the organizers. Drop the
// images in public/team/ and point `image` at them.
export type TeamMember = {
	name: string;
	role: string;
	image: string;
	linkedin?: string;
};

export const team: TeamMember[] = [
	{
		name: "Exec Member",
		role: "Co-President",
		image: "/team/placeholder-1.svg",
	},
	{
		name: "Exec Member",
		role: "Co-President",
		image: "/team/placeholder-2.svg",
	},
	{
		name: "Exec Member",
		role: "Director of Sponsorship",
		image: "/team/placeholder-3.svg",
	},
	{
		name: "Exec Member",
		role: "Director of Development",
		image: "/team/placeholder-4.svg",
	},
	{
		name: "Exec Member",
		role: "Director of Design",
		image: "/team/placeholder-5.svg",
	},
	{
		name: "Exec Member",
		role: "Director of Logistics",
		image: "/team/placeholder-6.svg",
	},
	{
		name: "Exec Member",
		role: "Director of Marketing",
		image: "/team/placeholder-7.svg",
	},
	{
		name: "Exec Member",
		role: "Director of Hacker Experience",
		image: "/team/placeholder-8.svg",
	},
];

// Redesign roster, grouped by role in display order. Every entry is a
// template until the organizers send names, headshots and LinkedIn URLs.
// TODO: Fill in real members; add or remove entries per group as needed.
export type TeamGroup = { id: string; label: string; members: TeamMember[] };

const placeholder = (role: string, count: number, offset: number) =>
	Array.from({ length: count }, (_, i) => ({
		name: "TBD",
		role,
		image: `/team/placeholder-${((offset + i) % 8) + 1}.svg`,
	}));

export const teamGroups: TeamGroup[] = [
	{ id: "technology", label: "Technology", members: placeholder("Technology", 3, 0) },
	{ id: "experience", label: "Experience", members: placeholder("Experience", 4, 3) },
	{ id: "marketing", label: "Marketing", members: placeholder("Marketing", 3, 7) },
	{ id: "partnerships", label: "Partnerships", members: placeholder("Partnerships", 3, 2) },
	{ id: "leadership", label: "Leadership", members: placeholder("Leadership", 2, 5) },
];
