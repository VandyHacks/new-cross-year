import Image from "next/image";
import SectionTitle from "@/components/section-title";

const sponsorRows = [
	[
		{ name: "Google", slug: "google" },
		{ name: "Apple", slug: "apple" },
		{ name: "GitHub", slug: "github" },
		{ name: "NVIDIA", slug: "nvidia" },
		{ name: "Samsung", slug: "samsung" },
		{ name: "Sony", slug: "sony" },
	],
	[
		{ name: "Intel", slug: "intel" },
		{ name: "Spotify", slug: "spotify" },
		{ name: "Netflix", slug: "netflix" },
		{ name: "Stripe", slug: "stripe" },
		{ name: "Cloudflare", slug: "cloudflare" },
		{ name: "Vercel", slug: "vercel" },
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
												key={`${repeat}-${sponsor.slug}`}
												className={`flex h-[clamp(140px,15vw,216px)] w-[clamp(180px,22vw,320px)] shrink-0 items-center justify-center motion-reduce:w-auto ${repeat === 1 ? "motion-reduce:hidden" : ""}`}
												data-sponsor-repeat={repeat}
												aria-hidden={
													repeat === 1
														? true
														: undefined
												}
											>
												<Image
													src={`/sponsors/${sponsor.slug}.svg`}
													alt={sponsor.name}
													width={180}
													height={180}
													className="size-[clamp(100px,13vw,180px)] object-contain opacity-80 invert"
												/>
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
