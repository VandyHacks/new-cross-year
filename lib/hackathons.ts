/** Source: VandyHacks Track Record.xlsx (Summary!A2:M13), cross-checked vs PDF.
 *  Covers the 12 numbered editions; only timeline facts are kept. */
export type Hackathon = {
	edition: string;
	year: number;
	/** Projects submitted — verified for every edition. */
	projects: number;
	/** Optional verified stats; omit entirely (never zero/guess) when unknown. */
	participants?: number;
	sponsors?: number;
	teams?: number;
	prizes?: number;
	devpost: string;
	/** Public artwork path; null uses the VandyHacks logo. */
	artwork: string | null;
	/** A light notehead preserves dark original artwork without altering its pixels. */
	artworkLightBackground?: boolean;
};

export const hackathons: readonly Hackathon[] = [
	{
		edition: "I",
		artwork: "/history/i.png",
		year: 2015,
		projects: 35,
		devpost: "https://vandyhacks.devpost.com/",
	},
	{
		edition: "II",
		artwork: "/history/ii.png",
		year: 2015,
		projects: 36,
		devpost: "https://vandyhacks2.devpost.com/",
	},
	{
		edition: "III",
		artwork: null,
		year: 2016,
		projects: 90,
		devpost: "https://vandyhacks3.devpost.com/",
	},
	{
		edition: "IV",
		artwork: null,
		year: 2017,
		projects: 70,
		devpost: "https://vandyhacksiv.devpost.com/",
	},
	{
		edition: "V",
		artwork: "/history/v.png",
		year: 2018,
		projects: 96,
		devpost: "https://vandyhacksv.devpost.com/",
	},
	{
		edition: "VI",
		artwork: "/history/vi.png",
		artworkLightBackground: true,
		year: 2019,
		projects: 88,
		devpost: "https://vandyhacksvi.devpost.com/",
	},
	{
		edition: "VII",
		artwork: "/history/vii-devpost.png",
		year: 2020,
		projects: 74,
		devpost: "https://vandyhacks-retro-edn.devpost.com/",
	},
	{
		edition: "VIII",
		artwork: "/history/viii-devpost.png",
		artworkLightBackground: true,
		year: 2021,
		projects: 30,
		devpost: "https://vandyhacksviii.devpost.com/",
	},
	{
		edition: "IX",
		artwork: "/history/ix-devpost.png",
		year: 2022,
		projects: 35,
		devpost: "https://vandyhacks-ix.devpost.com/",
	},
	{
		edition: "X",
		artwork: "/history/x-devpost.png",
		year: 2023,
		projects: 35,
		devpost: "https://vandyhacks-x.devpost.com/",
	},
	{
		edition: "XI",
		artwork: "/history/xi-devpost.png",
		year: 2024,
		projects: 42,
		devpost: "https://vandyhacks-xi.devpost.com/",
	},
	{
		edition: "XII",
		artwork: "/history/xii.png",
		year: 2026,
		projects: 34,
		devpost: "https://vandyhacks-xii.devpost.com/",
	},
];

export const hackathonTotals = {
	editions: hackathons.length,
	projects: hackathons.reduce((total, event) => total + event.projects, 0),
};
