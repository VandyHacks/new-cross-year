import { BecomeSponsorCard, SponsorCard } from "@/components/sponsor-card";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";
import { CTA } from "@/lib/event";
import { sponsors } from "@/lib/sponsors";

export default function Sponsors() {
	return (
		<section
			id="sponsors"
			className="relative z-10 scroll-mt-20 pt-[clamp(48px,6vw,88px)] pb-[clamp(64px,9vw,128px)]"
			aria-labelledby="sponsors-title"
		>
			<SectionContainer>
				<SectionTitle id="sponsors-title">Past Sponsors</SectionTitle>
				<p className="type-body mb-8 max-w-2xl text-vh-muted">
					Thank you to the companies that have powered VandyHacks.
				</p>
				<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
					{sponsors.map((sponsor) => (
						<li key={sponsor.name}>
							<SponsorCard sponsor={sponsor} />
						</li>
					))}
					<li>
						<BecomeSponsorCard href={CTA.sponsor} />
					</li>
				</ul>
			</SectionContainer>
		</section>
	);
}
