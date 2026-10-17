// Past sponsors. `logo.kind` decides how a card renders it:
//  - wordmark: full logo image, shown as a white silhouette ("mono") or in
//    its native colors ("color"); `plate` puts it on a light tile for logos
//    with dark artwork that disappear on navy
//  - icon: square mark or glyph, shown next to the company name
// Sponsors with no usable artwork fall back to the company name in text.
// TODO: Swap the icon/text entries for full wordmarks once they are sourced.
export type SponsorLogo = {
	src: string;
	kind: "wordmark" | "icon";
	tone: "mono" | "color";
	plate?: boolean;
};

export type Sponsor = { name: string; url: string; logo?: SponsorLogo };

const wordmark = (
	src: string,
	tone: "mono" | "color" = "mono",
	plate = false,
): SponsorLogo => ({ src, kind: "wordmark", tone, plate });
const glyph = (src: string, tone: "mono" | "color" = "mono"): SponsorLogo => ({
	src,
	kind: "icon",
	tone,
});

export const sponsors: Sponsor[] = [
	{
		name: "AllianceBernstein",
		url: "https://www.alliancebernstein.com",
		logo: wordmark("alliancebernstein.png", "color", true),
	},
	{
		name: "Asurion",
		url: "https://www.asurion.com",
		logo: wordmark("asurion.svg"),
	},
	{ name: "AT&T", url: "https://www.att.com", logo: wordmark("att.svg") },
	{
		name: "BNY Mellon",
		url: "https://www.bny.com",
		logo: wordmark("bny-mellon.png"),
	},
	{
		name: "Bright Data",
		url: "https://brightdata.com",
		logo: wordmark("brightdata.png"),
	},
	{
		name: "Capital One",
		url: "https://www.capitalone.com",
		logo: wordmark("capital-one.svg"),
	},
	{
		name: "Centene",
		url: "https://www.centene.com",
		logo: wordmark("centene.png"),
	},
	{
		name: "Contrary Capital",
		url: "https://contrary.com",
		logo: glyph("contrary-capital.jpg", "color"),
	},
	{
		name: "Defang",
		url: "https://defang.io",
		logo: glyph("defang.jpg", "color"),
	},
	{ name: "Digital Reasoning", url: "https://www.smarsh.com" },
	{
		name: "DigitalOcean",
		url: "https://www.digitalocean.com",
		logo: wordmark("digitalocean.svg"),
	},
	{
		name: "DigiKey",
		url: "https://www.digikey.com",
		logo: wordmark("digikey.svg"),
	},
	{
		name: "Dollar General",
		url: "https://www.dollargeneral.com",
		logo: wordmark("dollar-general.png", "color"),
	},
	{
		name: "Domain.com",
		url: "https://www.domain.com",
		logo: glyph("domain.png", "color"),
	},
	{
		name: "echo3D",
		url: "https://www.echo3d.com",
		logo: wordmark("echo3d.png", "color"),
	},
	{
		name: "Epic",
		url: "https://www.epic.com",
		logo: glyph("epic.png", "color"),
	},
	{
		name: "Eventbrite",
		url: "https://www.eventbrite.com",
		logo: wordmark("eventbrite.png"),
	},
	{
		name: "Exponent",
		url: "https://www.tryexponent.com",
		logo: glyph("exponent.png", "color"),
	},
	{
		name: "Fidelity Investments",
		url: "https://www.fidelity.com",
		logo: wordmark("fidelity.svg", "color"),
	},
	{
		name: "FulcrumGT",
		url: "https://www.fulcrumgt.com",
		logo: wordmark("fulcrumgt.png"),
	},
	{ name: "GIPHY", url: "https://giphy.com", logo: glyph("giphy.svg") },
	{ name: "GitHub", url: "https://github.com", logo: wordmark("github.svg") },
	{
		name: "GoDaddy Registry",
		url: "https://www.godaddy.com/domains/registry",
		logo: glyph("godaddy.svg"),
	},
	{
		name: "Google Cloud",
		url: "https://cloud.google.com",
		logo: glyph("googlecloud.svg"),
	},
	{
		name: "HashiCorp",
		url: "https://www.hashicorp.com",
		logo: glyph("hashicorp.svg"),
	},
	{ name: "Hillman", url: "https://www.hillmangroup.com" },
	{
		name: "Hudson River Trading",
		url: "https://www.hudsonrivertrading.com",
		logo: wordmark("hudson-river-trading.png", "color"),
	},
	{
		name: "IMC Trading",
		url: "https://www.imc.com",
		logo: wordmark("imc-trading.png"),
	},
	{
		name: "Initial State",
		url: "https://www.initialstate.com",
		logo: glyph("initial-state.png", "color"),
	},
	{
		name: "L3Harris",
		url: "https://www.l3harris.com",
		logo: wordmark("l3harris.png"),
	},
	{
		name: "Launch Tennessee",
		url: "https://launchtn.org",
		logo: glyph("launch-tennessee.png", "color"),
	},
	{
		name: "LeanKit",
		url: "https://www.planview.com/products/agileplace/",
		logo: glyph("leankit.png", "color"),
	},
	{
		name: "Lexmark",
		url: "https://www.lexmark.com",
		logo: wordmark("lexmark.svg"),
	},
	{ name: "Lunar Lincoln", url: "https://lunarlincoln.com" },
	{
		name: "Macy's Tech",
		url: "https://www.macysinc.com",
		logo: wordmark("macys.svg"),
	},
	{
		name: "Mercury",
		url: "https://mercury.com",
		logo: glyph("mercury.png", "color"),
	},
	{
		name: "Metova",
		url: "https://metova.com",
		logo: glyph("metova.png", "color"),
	},
	{
		name: "Microsoft",
		url: "https://www.microsoft.com",
		logo: wordmark("microsoft.png"),
	},
	{
		name: "MicroStrategy",
		url: "https://www.strategy.com",
		logo: wordmark("microstrategy.png"),
	},
	{
		name: "MongoDB",
		url: "https://www.mongodb.com",
		logo: wordmark("mongodb.svg"),
	},
	{
		name: "Perplexity AI",
		url: "https://www.perplexity.ai",
		logo: wordmark("perplexity.svg"),
	},
	{
		name: "Red Ventures",
		url: "https://www.redventures.com",
		logo: wordmark("red-ventures.png"),
	},
	{
		name: "Salesforce",
		url: "https://www.salesforce.com",
		logo: wordmark("salesforce.svg", "color"),
	},
	{
		name: "Sauce Labs",
		url: "https://saucelabs.com",
		logo: glyph("saucelabs.svg"),
	},
	{
		name: "SeatGeek",
		url: "https://seatgeek.com",
		logo: glyph("seatgeek.svg"),
	},
	{
		name: "Sticker Mule",
		url: "https://www.stickermule.com",
		logo: glyph("sticker-mule.png", "color"),
	},
	{
		name: "The Home Depot",
		url: "https://www.homedepot.com",
		logo: wordmark("home-depot.png", "color"),
	},
	{
		name: "Tractor Supply Co.",
		url: "https://www.tractorsupply.com",
		logo: wordmark("tractor-supply.png"),
	},
	{
		name: "Twilio",
		url: "https://www.twilio.com",
		logo: glyph("twilio.png", "color"),
	},
	{
		name: "Ubisoft",
		url: "https://www.ubisoft.com",
		logo: glyph("ubisoft.svg"),
	},
	{
		name: "UiPath",
		url: "https://www.uipath.com",
		logo: glyph("uipath.svg"),
	},
	{
		name: "Vanderbilt School of Engineering",
		url: "https://engineering.vanderbilt.edu",
		logo: wordmark("vanderbilt-engineering.png"),
	},
	{
		name: "Vanguard",
		url: "https://www.vanguard.com",
		logo: wordmark("vanguard.png"),
	},
	{ name: "Wix", url: "https://www.wix.com", logo: glyph("wix.svg") },
	{
		name: "Wolfram Alpha",
		url: "https://www.wolframalpha.com",
		logo: wordmark("wolfram.svg"),
	},
	{
		name: "Yik Yak",
		url: "https://yikyak.com",
		logo: wordmark("yik-yak.svg"),
	},
];
