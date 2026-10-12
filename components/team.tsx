const teamProfiles = Array.from({ length: 4 }, (_, index) => index);

export default function Team() {
	return (
		<section
			id="team"
			className="relative z-10 scroll-mt-20 px-[clamp(20px,5vw,72px)] py-[clamp(48px,7vw,88px)]"
			aria-labelledby="team-title"
		>
			<div className="mx-auto w-full max-w-7xl">
				<h2
					id="team-title"
					className="mb-3 font-heading text-2xl tracking-tight text-white sm:text-3xl"
				>
					Meet the exec team
				</h2>
				<p className="mb-8 max-w-2xl text-sm leading-6 text-[#c3c8dc]">
					The people bringing VandyHacks XIII to life. Team profiles
					will be announced soon.
				</p>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
					{teamProfiles.map((profile) => (
						<article
							key={profile}
							className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#151e3d]/80 p-5 text-center"
						>
							<div
								className="mb-4 flex size-16 items-center justify-center rounded-full border border-[#a77ae9]/50 bg-[#7138c7]/25 font-heading text-xl text-[#eadcff]"
								aria-hidden="true"
							>
								VH
							</div>
							<h3 className="font-mono text-sm text-white">
								Exec team member
							</h3>
							<p className="mt-1 font-mono text-xs text-[#c3c8dc]">
								Role
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
