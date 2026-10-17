import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";

const teamProfiles = Array.from({ length: 4 }, (_, index) => index);

export default function Team() {
	return (
		<section
			id="team"
			className="relative z-10 scroll-mt-20 py-[clamp(48px,7vw,88px)]"
			aria-labelledby="team-title"
		>
			<SectionContainer>
				<SectionTitle id="team-title">Team</SectionTitle>
				<p className="type-body mb-8 max-w-2xl text-vh-muted">tbd</p>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
					{teamProfiles.map((profile) => (
						<article
							key={profile}
							className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-white/10 bg-vh-navy-800/80 p-5 text-center"
						>
							<div
								className="mb-4 flex size-16 items-center justify-center rounded-full border border-vh-purple-400/50 bg-vh-purple-700/25 font-heading text-xl text-vh-purple-100"
								aria-hidden="true"
							>
								VH
							</div>
							<h3 className="type-subheading text-white">
								Exec team member
							</h3>
							<p className="type-body-sm mt-1 text-vh-muted">
								Role
							</p>
						</article>
					))}
				</div>
			</SectionContainer>
		</section>
	);
}
