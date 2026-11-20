/**
 * Source: user-supplied VandyHacks Track Record.xlsx, Summary!A2:M13,
 * cross-checked against the matching PDF. Counts cover the 12 numbered
 * editions; the separate 2020 Summer Edition is outside this dataset.
 * Only the facts used by the promotional timeline are retained here.
 */
export type Hackathon = {
	edition: string;
	year: number;
	projects: number;
	devpost: string;
};

export const hackathons: readonly Hackathon[] = [
	{
		edition: "I",
		year: 2015,
		projects: 35,
		devpost: "https://vandyhacks.devpost.com/",
	},
	{
		edition: "II",
		year: 2015,
		projects: 36,
		devpost: "https://vandyhacks2.devpost.com/",
	},
	{
		edition: "III",
		year: 2016,
		projects: 90,
		devpost: "https://vandyhacks3.devpost.com/",
	},
	{
		edition: "IV",
		year: 2017,
		projects: 70,
		devpost: "https://vandyhacksiv.devpost.com/",
	},
	{
		edition: "V",
		year: 2018,
		projects: 96,
		devpost: "https://vandyhacksv.devpost.com/",
	},
	{
		edition: "VI",
		year: 2019,
		projects: 88,
		devpost: "https://vandyhacksvi.devpost.com/",
	},
	{
		edition: "VII",
		year: 2020,
		projects: 74,
		devpost: "https://vandyhacks-retro-edn.devpost.com/",
	},
	{
		edition: "VIII",
		year: 2021,
		projects: 30,
		devpost: "https://vandyhacksviii.devpost.com/",
	},
	{
		edition: "IX",
		year: 2022,
		projects: 35,
		devpost: "https://vandyhacks-ix.devpost.com/",
	},
	{
		edition: "X",
		year: 2023,
		projects: 35,
		devpost: "https://vandyhacks-x.devpost.com/",
	},
	{
		edition: "XI",
		year: 2024,
		projects: 42,
		devpost: "https://vandyhacks-xi.devpost.com/",
	},
	{
		edition: "XII",
		year: 2026,
		projects: 34,
		devpost: "https://vandyhacks-xii.devpost.com/",
	},
];

export const hackathonTotals = {
	editions: hackathons.length,
	projects: hackathons.reduce((total, event) => total + event.projects, 0),
};
