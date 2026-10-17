import Image from "next/image";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";

type Sponsor = { name: string; file: string | null; url: string };

const sponsorRows: Sponsor[][] = [
	[
		{ name: "AllianceBernstein", file: "alliancebernstein.png", url: "https://www.alliancebernstein.com" },
		{ name: "Asurion", file: "asurion.png", url: "https://www.asurion.com" },
		{ name: "AT&T", file: "att.png", url: "https://www.att.com" },
		{ name: "BNY Mellon", file: "bny-mellon.png", url: "https://www.bny.com" },
		{ name: "Capital One", file: "capital-one.png", url: "https://www.capitalone.com" },
		{ name: "Centene", file: "centene.png", url: "https://www.centene.com" },
		{ name: "Contrary Capital", file: "contrary-capital.jpg", url: "https://contrary.com" },
		{ name: "Defang", file: "defang.jpg", url: "https://defang.io" },
		{ name: "Digital Reasoning", file: "digital-reasoning.png", url: "https://www.smarsh.com" },
		{ name: "DigitalOcean", file: "digitalocean.svg", url: "https://www.digitalocean.com" },
		{ name: "DigiKey", file: "digikey.png", url: "https://www.digikey.com" },
		{ name: "Dollar General", file: "dollar-general.png", url: "https://www.dollargeneral.com" },
		{ name: "Domain.com", file: "domain.png", url: "https://www.domain.com" },
		{ name: "Epic", file: "epic.png", url: "https://www.epic.com" },
		{ name: "Eventbrite", file: "eventbrite.png", url: "https://www.eventbrite.com" },
		{ name: "Fidelity Investments", file: "fidelity.png", url: "https://www.fidelity.com" },
		{ name: "FulcrumGT", file: "fulcrumgt.png", url: "https://www.fulcrumgt.com" },
		{ name: "GIPHY", file: "giphy.svg", url: "https://giphy.com" },
		{ name: "GoDaddy Registry", file: "godaddy.svg", url: "https://www.godaddy.com/domains/registry" },
		{ name: "Google Cloud", file: "googlecloud.svg", url: "https://cloud.google.com" },
		{ name: "Github", file: "github.svg", url: "https://github.com" },
		{ name: "HashiCorp", file: "hashicorp.svg", url: "https://www.hashicorp.com" },
		{ name: "Hillman", file: "hillman.png", url: "https://www.hillmangroup.com" },
		{ name: "Hudson River Trading", file: "hudson-river-trading.png", url: "https://www.hudsonrivertrading.com" },
		{ name: "IMC Trading", file: "imc-trading.png", url: "https://www.imc.com" },
		{ name: "Initial State", file: "initial-state.png", url: "https://www.initialstate.com" },
	],
	[
		{ name: "L3Harris", file: "l3harris.jpg", url: "https://www.l3harris.com" },
		{ name: "Launch Tennessee", file: "launch-tennessee.png", url: "https://launchtn.org" },
		{ name: "LeanKit", file: "leankit.png", url: "https://www.planview.com/products/agileplace/" },
		{ name: "Lexmark", file: "lexmark.png", url: "https://www.lexmark.com" },
		{ name: "Lunar Lincoln", file: null, url: "https://lunarlincoln.com" },
		{ name: "Macy's Tech", file: "macys.png", url: "https://www.macysinc.com" },
		{ name: "Mercury", file: "mercury.png", url: "https://mercury.com" },
		{ name: "Metova", file: "metova.png", url: "https://metova.com" },
		{ name: "Microsoft", file: "microsoft.png", url: "https://www.microsoft.com" },
		{ name: "MicroStrategy", file: "microstrategy.svg", url: "https://www.strategy.com" },
		{ name: "MongoDB", file: "mongodb.svg", url: "https://www.mongodb.com" },
		{ name: "Perplexity AI", file: "perplexity.svg", url: "https://www.perplexity.ai" },
		{ name: "Red Ventures", file: "red-ventures.png", url: "https://www.redventures.com" },
		{ name: "Salesforce", file: "salesforce.png", url: "https://www.salesforce.com" },
		{ name: "Sauce Labs", file: "saucelabs.svg", url: "https://saucelabs.com" },
		{ name: "SeatGeek", file: "seatgeek.svg", url: "https://seatgeek.com" },
		{ name: "Sticker Mule", file: "sticker-mule.png", url: "https://www.stickermule.com" },
		{ name: "The Home Depot", file: "home-depot.png", url: "https://www.homedepot.com" },
		{ name: "Tractor Supply Co.", file: "tractor-supply.png", url: "https://www.tractorsupply.com" },
		{ name: "Twilio", file: "twilio.png", url: "https://www.twilio.com" },
		{ name: "Ubisoft", file: "ubisoft.svg", url: "https://www.ubisoft.com" },
		{ name: "UiPath", file: "uipath.svg", url: "https://www.uipath.com" },
		{ name: "Vanguard", file: "vanguard.jpg", url: "https://www.vanguard.com" },
		{ name: "Wix", file: "wix.svg", url: "https://www.wix.com" },
		{ name: "Wolfram Alpha", file: "wolfram.svg", url: "https://www.wolframalpha.com" },
		{ name: "Yik Yak", file: "yik-yak.png", url: "https://yikyak.com" },
	],
];

export default function Sponsors() {
	return (
		<section
			id="sponsors"
			className="relative z-10 overflow-hidden pt-[clamp(48px,6vw,88px)] pb-[clamp(80px,10vw,160px)]"
			aria-labelledby="sponsors-title"
		>
			<SectionContainer>
				<SectionTitle id="sponsors-title">Past Sponsors</SectionTitle>
			</SectionContainer>
			<div className="space-y-[clamp(12px,1.5vw,20px)]">
				{sponsorRows.map((sponsors, row) => (
					<div
						key={row}
						className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:px-[clamp(20px,3vw,64px)] motion-reduce:[mask-image:none]"
					>
						{/* Marquee runs at ~half the previous speed; it pauses on
						    hover/focus so the logos are easy to click. */}
						<div
							className={`flex w-max animate-sponsor-scroll hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none ${row === 1 ? "[animation-duration:190s] [animation-direction:reverse]" : "[animation-duration:160s]"}`}
						>
							{[0, 1].map((copy) => (
								<div
									key={copy}
									className={`flex min-w-screen shrink-0 gap-[clamp(12px,1.5vw,20px)] pr-[clamp(12px,1.5vw,20px)] motion-reduce:grid motion-reduce:w-full motion-reduce:min-w-0 motion-reduce:grid-cols-3 motion-reduce:pr-0 motion-reduce:max-[600px]:grid-cols-2 ${copy === 1 ? "motion-reduce:hidden" : ""}`}
									data-sponsor-copy={copy}
									aria-hidden={copy === 1 ? true : undefined}
								>
									{[0, 1].flatMap((repeat) =>
										sponsors.map((sponsor) => {
											// Only one of the four duplicated copies is
											// exposed to keyboard / screen readers.
											const primary =
												copy === 0 && repeat === 0;
											return (
												<div
													key={`${repeat}-${sponsor.name}`}
													className={`flex h-[clamp(140px,15vw,216px)] w-[clamp(180px,22vw,320px)] shrink-0 items-center justify-center motion-reduce:w-auto ${repeat === 1 ? "motion-reduce:hidden" : ""}`}
													data-sponsor-repeat={repeat}
													aria-hidden={
														repeat === 1
															? true
															: undefined
													}
												>
													<a
														href={sponsor.url}
														target="_blank"
														rel="noopener noreferrer"
														aria-label={`Visit ${sponsor.name} website`}
														tabIndex={
															primary
																? undefined
																: -1
														}
														aria-hidden={
															primary
																? undefined
																: true
														}
														className="group flex size-full items-center justify-center rounded-md transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 motion-reduce:transition-none motion-reduce:hover:scale-100"
													>
														{sponsor.file ? (
															<Image
																src={`/sponsors/${sponsor.file}`}
																alt={sponsor.name}
																width={180}
																height={180}
																className={`size-[clamp(100px,13vw,180px)] object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100 ${sponsor.file.endsWith(".svg") ? "invert" : ""}`}
															/>
														) : (
															<span className="px-4 text-center font-heading text-[clamp(16px,2vw,28px)] tracking-tight text-vh-text opacity-80 transition-opacity duration-200 group-hover:opacity-100">
																{sponsor.name}
															</span>
														)}
													</a>
												</div>
											);
										}),
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
