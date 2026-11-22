// Exec team for the Team gallery. TODO: swap remaining placeholders for real
// headshots (4:5 crop, same bg) + LinkedIn; images go in public/team/.
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

// Roster grouped by team, in display order. Members with a headshot also carry
// their LinkedIn URL; those still awaiting a photo use a placeholder.
export type TeamGroup = { id: string; label: string; members: TeamMember[] };

export const teamGroups: TeamGroup[] = [
	{
		id: "technology",
		label: "Technology",
		members: [
			{
				name: "Kevin",
				role: "Technology",
				image: "/team/kevin.jpg",
				linkedin: "https://www.linkedin.com/in/kevin-luo-ece",
			},
			{
				name: "Yan",
				role: "Technology",
				image: "/team/yan.jpg",
				linkedin: "https://www.linkedin.com/in/c-qing-yan/",
			},
			{
				name: "Shaheer",
				role: "Technology",
				image: "/team/shaheer.jpg",
				linkedin: "https://www.linkedin.com/in/shheer-khn",
			},
		],
	},
	{
		id: "experience",
		label: "Experience",
		members: [
			{
				name: "Ji",
				role: "Experience",
				image: "/team/jiyoo.png",
				linkedin: "https://www.linkedin.com/in/jiyoopark1",
			},
			{
				name: "Hanan",
				role: "Experience",
				image: "/team/hanan.jpg",
				linkedin: "https://www.linkedin.com/in/hanan-abdelbagi-36341828a",
			},
			{
				name: "Dipayan",
				role: "Experience",
				image: "/team/dipayan.jpg",
				linkedin: "https://www.linkedin.com/in/dipayan-pokharel-35a278398",
			},
			{
				name: "Eiliyah",
				role: "Experience",
				image: "/team/eiliyah.jpg",
				linkedin: "https://www.linkedin.com/in/eiliyah",
			},
		],
	},
	{
		id: "marketing",
		label: "Marketing",
		members: [
			{
				name: "Jacob",
				role: "Marketing",
				image: "/team/jacob.jpg",
				linkedin: "https://www.linkedin.com/in/jacob--kaiser",
			},
			{
				name: "Olive",
				role: "Marketing",
				image: "/team/olive.jpg",
				linkedin: "https://www.linkedin.com/in/olive-m-whitley",
			},
			{
				name: "Geo",
				role: "Marketing",
				image: "/team/geo.jpg",
				linkedin: "https://www.linkedin.com/in/geovanny-marcos",
			},
		],
	},
	{
		id: "partnerships",
		label: "Partnerships",
		members: [
			{
				name: "David",
				role: "Partnerships",
				image: "/team/david.jpg",
				linkedin: "https://www.linkedin.com/in/david-boakye-agyemang/",
			},
			{
				name: "Maya",
				role: "Partnerships",
				image: "/team/maya.jpg",
				linkedin: "https://www.linkedin.com/in/maya-poghosyan",
			},
			{
				name: "Jessica",
				role: "Partnerships",
				image: "/team/jessica.png",
				linkedin: "https://www.linkedin.com/in/jessicawang-vanderbilt",
			},
		],
	},
	{
		id: "leadership",
		label: "Leadership",
		members: [
			{
				name: "Shravya",
				role: "Leadership",
				image: "/team/shravya.jpg",
				linkedin: "https://www.linkedin.com/in/shravyaeyunni/",
			},
			{
				name: "Filiz",
				role: "Leadership",
				image: "/team/filiz.jpg",
				linkedin: "https://www.linkedin.com/in/filizkarabulut",
			},
		],
	},
];
