import Image from "next/image";

const linkClassName =
	"text-sm text-[#d5d9e8] underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-[#c8a2ff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8a2ff]";

export default function Footer() {
	return (
		<footer
			id="footer"
			className="border-t border-white/10 bg-[#080d20] px-[clamp(20px,5vw,72px)] py-10 text-white sm:py-12"
		>
			<div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-start">
				<div>
					<p className="font-heading text-lg">VandyHacks</p>
					<p className="mt-2 max-w-sm text-sm leading-6 text-[#aeb5cd]">
						Vanderbilt University
						<br />
						Nashville, Tennessee
					</p>
				</div>
				<div>
					<h2 className="mb-3 font-mono text-xs tracking-[0.12em] text-[#c8a2ff] uppercase">
						Get in touch
					</h2>
					<ul className="flex flex-col items-start gap-3">
						<li>
							<a
								className={linkClassName}
								href="mailto:info@vandyhacks.org"
							>
								info@vandyhacks.org
							</a>
						</li>
						<li>
							<a
								className={linkClassName}
								href="mailto:info@vandyhacks.org?subject=Sponsoring%20VandyHacks%20XIII"
							>
								Sponsor VandyHacks
							</a>
						</li>
						<li>
							<a
								className={linkClassName}
								href="https://www.instagram.com/vandyhacks"
								target="_blank"
								rel="noreferrer"
							>
								Instagram
								<span className="sr-only"> (opens in a new tab)</span>
							</a>
						</li>
						<li>
							<a
								className={linkClassName}
								href="https://vandyhacks.devpost.com/"
								target="_blank"
								rel="noreferrer"
							>
								VandyHacks on Devpost
								<span className="sr-only"> (opens in a new tab)</span>
							</a>
						</li>
					</ul>
				</div>
				<a
					className="inline-flex w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8a2ff]"
					href="https://mlh.io/seasons/2027/events/"
					target="_blank"
					rel="noreferrer"
					aria-label="Major League Hacking 2027 season events (opens in a new tab)"
				>
					<Image
						unoptimized
						src="https://s3.amazonaws.com/logged-assets/trust-badge/2027/mlh-trust-badge-2027-white.svg"
						alt="Major League Hacking 2027 hackathon season"
						width={79}
						height={138}
						className="h-[138px] w-[79px] object-contain"
					/>
				</a>
			</div>
			<div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-[#8992ad]">
				<p>VandyHacks XIII · March 2027</p>
			</div>
		</footer>
	);
}
