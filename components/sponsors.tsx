import Image from "next/image";

const sponsors = [
	"AllianceBernstein",
	"Asurion",
	"AT&T",
	"BNY Mellon",
	"Capital One",
	"Centene",
	"Contrary Capital",
	"Defang",
	"Digital Reasoning",
	"DigitalOcean",
	"DigiKey",
	"Dollar General",
	"Domain.com",
	"Epic",
	"Eventbrite",
	"Fidelity Investments",
	"FulcrumGT",
	"GIPHY",
	"GoDaddy Registry",
	"Google Cloud",
	"GitHub",
	"HashiCorp",
	"Hillman",
	"Hudson River Trading",
	"IMC Trading",
	"Initial State",
	"L3Harris",
	"Launch Tennessee",
	"LeanKit",
	"Lexmark",
	"Lunar Lincoln",
	"Macy's Tech",
	"Mercury",
	"Metova",
	"Microsoft",
	"MicroStrategy",
	"MongoDB",
	"Perplexity AI",
	"Red Ventures",
	"Salesforce",
	"Sauce Labs",
	"SeatGeek",
	"Sticker Mule",
	"The Home Depot",
	"Tractor Supply Co.",
	"Twilio",
	"Ubisoft",
	"UiPath",
	"Vanguard",
	"Wix",
	"Wolfram Alpha",
	"Yik Yak",
	"Major League Hacking (MLH)",
	"Vanderbilt School of Engineering",
	"Vanderbilt Ventures Group",
];

const sponsorLogos: Record<string, string> = {
	AllianceBernstein: "alliancebernstein.png",
	Asurion: "asurion.png",
	"AT&T": "att.png",
	"BNY Mellon": "bny-mellon.png",
	"Capital One": "capital-one.png",
	Centene: "centene.png",
	"Contrary Capital": "contrary-capital.jpg",
	Defang: "defang.jpg",
	"Digital Reasoning": "digital-reasoning.png",
	DigitalOcean: "digitalocean.svg",
	DigiKey: "digikey.png",
	"Dollar General": "dollar-general.png",
	"Domain.com": "domain.png",
	Epic: "epic.png",
	Eventbrite: "eventbrite.png",
	"Fidelity Investments": "fidelity.png",
	FulcrumGT: "fulcrumgt.png",
	GIPHY: "giphy.svg",
	"GoDaddy Registry": "godaddy.svg",
	"Google Cloud": "googlecloud.svg",
	GitHub: "github.svg",
	HashiCorp: "hashicorp.svg",
	Hillman: "hillman.png",
	"Hudson River Trading": "hudson-river-trading.png",
	"IMC Trading": "imc-trading.png",
	"Initial State": "initial-state.png",
	L3Harris: "l3harris.jpg",
	"Launch Tennessee": "launch-tennessee.png",
	LeanKit: "leankit.png",
	Lexmark: "lexmark.png",
	"Macy's Tech": "macys.png",
	Mercury: "mercury.png",
	Metova: "metova.png",
	Microsoft: "microsoft.png",
	MicroStrategy: "microstrategy.svg",
	MongoDB: "mongodb.svg",
	"Perplexity AI": "perplexity.svg",
	"Red Ventures": "red-ventures.png",
	Salesforce: "salesforce.png",
	"Sauce Labs": "saucelabs.svg",
	SeatGeek: "seatgeek.svg",
	"Sticker Mule": "sticker-mule.png",
	"The Home Depot": "home-depot.png",
	"Tractor Supply Co.": "tractor-supply.png",
	Twilio: "twilio.png",
	Ubisoft: "ubisoft.svg",
	UiPath: "uipath.svg",
	Vanguard: "vanguard.jpg",
	Wix: "wix.svg",
	"Wolfram Alpha": "wolfram.svg",
	"Yik Yak": "yik-yak.png",
	"Major League Hacking (MLH)": "majorleaguehacking.svg",
	"Vanderbilt School of Engineering": "vanderbilt-engineering.png",
	"Vanderbilt Ventures Group": "vanderbilt-ventures.png",
};

export default function Sponsors() {
	return (
		<section
			id="sponsors"
			className="relative z-10 scroll-mt-20 px-[clamp(20px,5vw,72px)] py-[clamp(48px,7vw,88px)]"
			aria-labelledby="sponsors-title"
		>
			<div className="mx-auto w-full max-w-7xl">
				<h2
					id="sponsors-title"
					className="mb-3 font-heading text-2xl tracking-tight text-white sm:text-3xl"
				>
					Past sponsors &amp; supporters
				</h2>
				<p className="mb-8 max-w-2xl text-sm leading-6 text-[#c3c8dc]">
					Thank you to the organizations that have supported
					VandyHacks over the years.
				</p>
				<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{sponsors.map((sponsor) => (
						<li
							key={sponsor}
							className="group relative isolate h-[220px] overflow-hidden rounded-2xl border border-white/20 bg-[#0d142c] p-1 transition-colors hover:border-[#c8a2ff]/60"
						>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-br from-[#c8a2ff]/70 via-[#77a9ff]/35 to-[#151e3d]"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-1 rounded-xl rounded-tr-[100px] rounded-br-[40px] bg-[#0d142c]"
							/>
							<div
								aria-hidden="true"
								className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full bg-gradient-to-tr from-[#7138c7] to-[#315caa] opacity-80 motion-reduce:animate-none [animation-duration:12s]"
							/>
							<div className="absolute inset-2 flex items-center justify-center rounded-xl backdrop-blur-xl">
								<div className="relative z-10 flex size-24 items-center justify-center">
									{sponsorLogos[sponsor] ? (
										<Image
											src={`/sponsors/${sponsorLogos[sponsor]}`}
											alt=""
											width={96}
											height={96}
											className={`max-h-full max-w-full object-contain ${sponsorLogos[sponsor].endsWith(".svg") ? "brightness-0 invert" : ""}`}
										/>
									) : (
										<span className="font-heading text-xl tracking-tight text-[#f0eff8]">
											{sponsor
												.split(/\s+/)
												.map((word) => word[0])
												.join("")
												.slice(0, 2)}
										</span>
									)}
								</div>
								<span className="absolute left-2 top-2 z-20 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#c8a2ff]">
									Sponsor
								</span>
								<div className="absolute inset-x-1 bottom-1 z-20 rounded-xl border border-white/10 bg-[#0d142c]/75 px-2.5 py-2 text-center text-[#f0eff8] backdrop-blur-lg">
									<p className="break-words font-mono text-[11px] font-medium leading-snug sm:text-xs">
										{sponsor}
									</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
