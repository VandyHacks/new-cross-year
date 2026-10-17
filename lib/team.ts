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
