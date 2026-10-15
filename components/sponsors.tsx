import Image from "next/image";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";

type Sponsor = { name: string; file: string | null; url: string };

// TODO: every `url` is a "#" placeholder — no sponsor websites exist in the
// codebase yet. Replace each with that sponsor's official website.
const sponsorRows: Sponsor[][] = [
	[
		{ name: "AllianceBernstein", file: "alliancebernstein.png", url: "#" },
		{ name: "Asurion", file: "asurion.png", url: "#" },
		{ name: "AT&T", file: "att.png", url: "#" },
		{ name: "BNY Mellon", file: "bny-mellon.png", url: "#" },
		{ name: "Capital One", file: "capital-one.png", url: "#" },
		{ name: "Centene", file: "centene.png", url: "#" },
		{ name: "Contrary Capital", file: "contrary-capital.jpg", url: "#" },
		{ name: "Defang", file: "defang.jpg", url: "#" },
		{ name: "Digital Reasoning", file: "digital-reasoning.png", url: "#" },
		{ name: "DigitalOcean", file: "digitalocean.svg", url: "#" },
		{ name: "DigiKey", file: "digikey.png", url: "#" },
		{ name: "Dollar General", file: "dollar-general.png", url: "#" },
		{ name: "Domain.com", file: "domain.png", url: "#" },
		{ name: "Epic", file: "epic.png", url: "#" },
		{ name: "Eventbrite", file: "eventbrite.png", url: "#" },
		{ name: "Fidelity Investments", file: "fidelity.png", url: "#" },
		{ name: "FulcrumGT", file: "fulcrumgt.png", url: "#" },
		{ name: "GIPHY", file: "giphy.svg", url: "#" },
		{ name: "GoDaddy Registry", file: "godaddy.svg", url: "#" },
		{ name: "Google Cloud", file: "googlecloud.svg", url: "#" },
		{ name: "Github", file: "github.svg", url: "#" },
		{ name: "HashiCorp", file: "hashicorp.svg", url: "#" },
		{ name: "Hillman", file: "hillman.png", url: "#" },
		{ name: "Hudson River Trading", file: "hudson-river-trading.png", url: "#" },
		{ name: "IMC Trading", file: "imc-trading.png", url: "#" },
		{ name: "Initial State", file: "initial-state.png", url: "#" },
	],
	[
		{ name: "L3Harris", file: "l3harris.jpg", url: "#" },
		{ name: "Launch Tennessee", file: "launch-tennessee.png", url: "#" },
		{ name: "LeanKit", file: "leankit.png", url: "#" },
		{ name: "Lexmark", file: "lexmark.png", url: "#" },
		{ name: "Lunar Lincoln", file: null, url: "#" },
		{ name: "Macy's Tech", file: "macys.png", url: "#" },
		{ name: "Mercury", file: "mercury.png", url: "#" },
		{ name: "Metova", file: "metova.png", url: "#" },
		{ name: "Microsoft", file: "microsoft.png", url: "#" },
		{ name: "MicroStrategy", file: "microstrategy.svg", url: "#" },
		{ name: "MongoDB", file: "mongodb.svg", url: "#" },
		{ name: "Perplexity AI", file: "perplexity.svg", url: "#" },
		{ name: "Red Ventures", file: "red-ventures.png", url: "#" },
		{ name: "Salesforce", file: "salesforce.png", url: "#" },
		{ name: "Sauce Labs", file: "saucelabs.svg", url: "#" },
		{ name: "SeatGeek", file: "seatgeek.svg", url: "#" },
		{ name: "Sticker Mule", file: "sticker-mule.png", url: "#" },
		{ name: "The Home Depot", file: "home-depot.png", url: "#" },
		{ name: "Tractor Supply Co.", file: "tractor-supply.png", url: "#" },
		{ name: "Twilio", file: "twilio.png", url: "#" },
		{ name: "Ubisoft", file: "ubisoft.svg", url: "#" },
		{ name: "UiPath", file: "uipath.svg", url: "#" },
		{ name: "Vanguard", file: "vanguard.jpg", url: "#" },
		{ name: "Wix", file: "wix.svg", url: "#" },
		{ name: "Wolfram Alpha", file: "wolfram.svg", url: "#" },
		{ name: "Yik Yak", file: "yik-yak.png", url: "#" },
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
														className="group flex size-full items-center justify-center rounded-md transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a2ff] motion-reduce:transition-none motion-reduce:hover:scale-100"
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
															<span className="px-4 text-center font-heading text-[clamp(16px,2vw,28px)] tracking-tight text-[#f1f0f3] opacity-80 transition-opacity duration-200 group-hover:opacity-100">
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
