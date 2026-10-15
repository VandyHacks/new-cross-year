import Image from "next/image";
import SectionTitle from "@/components/section-title";

type Sponsor = { name: string; file: string | null };

const sponsorRows: Sponsor[][] = [
	[
		{ name: "AllianceBernstein", file: "alliancebernstein.png" },
		{ name: "Asurion", file: "asurion.png" },
		{ name: "AT&T", file: "att.png" },
		{ name: "BNY Mellon", file: "bny-mellon.png" },
		{ name: "Capital One", file: "capital-one.png" },
		{ name: "Centene", file: "centene.png" },
		{ name: "Contrary Capital", file: "contrary-capital.jpg" },
		{ name: "Defang", file: "defang.jpg" },
		{ name: "Digital Reasoning", file: "digital-reasoning.png" },
		{ name: "DigitalOcean", file: "digitalocean.svg" },
		{ name: "DigiKey", file: "digikey.png" },
		{ name: "Dollar General", file: "dollar-general.png" },
		{ name: "Domain.com", file: "domain.png" },
		{ name: "Epic", file: "epic.png" },
		{ name: "Eventbrite", file: "eventbrite.png" },
		{ name: "Fidelity Investments", file: "fidelity.png" },
		{ name: "FulcrumGT", file: "fulcrumgt.png" },
		{ name: "GIPHY", file: "giphy.svg" },
		{ name: "GoDaddy Registry", file: "godaddy.svg" },
		{ name: "Google Cloud", file: "googlecloud.svg" },
		{ name: "Github", file: "github.svg" },
		{ name: "HashiCorp", file: "hashicorp.svg" },
		{ name: "Hillman", file: "hillman.png" },
		{ name: "Hudson River Trading", file: "hudson-river-trading.png" },
		{ name: "IMC Trading", file: "imc-trading.png" },
		{ name: "Initial State", file: "initial-state.png" },
	],
	[
		{ name: "L3Harris", file: "l3harris.jpg" },
		{ name: "Launch Tennessee", file: "launch-tennessee.png" },
		{ name: "LeanKit", file: "leankit.png" },
		{ name: "Lexmark", file: "lexmark.png" },
		{ name: "Lunar Lincoln", file: null },
		{ name: "Macy's Tech", file: "macys.png" },
		{ name: "Mercury", file: "mercury.png" },
		{ name: "Metova", file: "metova.png" },
		{ name: "Microsoft", file: "microsoft.png" },
		{ name: "MicroStrategy", file: "microstrategy.svg" },
		{ name: "MongoDB", file: "mongodb.svg" },
		{ name: "Perplexity AI", file: "perplexity.svg" },
		{ name: "Red Ventures", file: "red-ventures.png" },
		{ name: "Salesforce", file: "salesforce.png" },
		{ name: "Sauce Labs", file: "saucelabs.svg" },
		{ name: "SeatGeek", file: "seatgeek.svg" },
		{ name: "Sticker Mule", file: "sticker-mule.png" },
		{ name: "The Home Depot", file: "home-depot.png" },
		{ name: "Tractor Supply Co.", file: "tractor-supply.png" },
		{ name: "Twilio", file: "twilio.png" },
		{ name: "Ubisoft", file: "ubisoft.svg" },
		{ name: "UiPath", file: "uipath.svg" },
		{ name: "Vanguard", file: "vanguard.jpg" },
		{ name: "Wix", file: "wix.svg" },
		{ name: "Wolfram Alpha", file: "wolfram.svg" },
		{ name: "Yik Yak", file: "yik-yak.png" },
	],
];

export default function Sponsors() {
	return (
		<section
			id="sponsors"
			className="relative z-10 overflow-hidden pt-[clamp(48px,6vw,88px)] pb-[clamp(80px,10vw,160px)]"
			aria-labelledby="sponsors-title"
		>
			<div className="px-[clamp(20px,3vw,64px)]">
				<SectionTitle id="sponsors-title">PAST SPONSORS</SectionTitle>
			</div>
			<div className="space-y-[clamp(12px,1.5vw,20px)]">
				{sponsorRows.map((sponsors, row) => (
					<div
						key={row}
						className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:px-[clamp(20px,3vw,64px)] motion-reduce:[mask-image:none]"
					>
						<div
							className={`flex w-max animate-sponsor-scroll motion-reduce:w-full motion-reduce:animate-none ${row === 1 ? "[animation-duration:95s] [animation-direction:reverse]" : ""}`}
						>
							{[0, 1].map((copy) => (
								<div
									key={copy}
									className={`flex min-w-screen shrink-0 gap-[clamp(12px,1.5vw,20px)] pr-[clamp(12px,1.5vw,20px)] motion-reduce:grid motion-reduce:w-full motion-reduce:min-w-0 motion-reduce:grid-cols-3 motion-reduce:pr-0 motion-reduce:max-[600px]:grid-cols-2 ${copy === 1 ? "motion-reduce:hidden" : ""}`}
									data-sponsor-copy={copy}
									aria-hidden={copy === 1 ? true : undefined}
								>
									{[0, 1].flatMap((repeat) =>
										sponsors.map((sponsor) => (
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
												{sponsor.file ? (
													<Image
														src={`/sponsors/${sponsor.file}`}
														alt={sponsor.name}
														width={180}
														height={180}
														className={`size-[clamp(100px,13vw,180px)] object-contain opacity-80 ${sponsor.file.endsWith(".svg") ? "invert" : ""}`}
													/>
												) : (
													<span className="px-4 text-center font-heading text-[clamp(16px,2vw,28px)] tracking-tight text-[#f1f0f3] opacity-80">
														{sponsor.name}
													</span>
												)}
											</div>
										)),
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
