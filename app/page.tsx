import AsciiWordmark from "@/components/ascii-wordmark";

const navLinkClassName =
	"flex justify-between px-2.5 py-[7px] transition-colors duration-200 hover:bg-[#ba87f8] hover:text-black focus-visible:outline-2 focus-visible:outline-[#ba87f8] focus-visible:outline-offset-5 motion-reduce:transition-none max-[600px]:px-2 [-webkit-tap-highlight-color:transparent] [&_span]:opacity-55";

export default function Home() {
	return (
		<main id="home">
			<section
				className="relative isolate flex h-svh min-h-[820px] flex-col px-[clamp(20px,3vw,64px)] min-[1800px]:min-h-[950px] max-[900px]:min-h-[740px] max-[600px]:min-h-[780px] "
				aria-labelledby="event-title"
			>
				<div
					className="pointer-events-none absolute inset-y-0 inset-x-[clamp(20px,3vw,64px)] -z-10 flex justify-between"
					aria-hidden="true"
				>
					{Array.from({ length: 5 }, (_, i) => (
						<span
							key={i}
							className="w-px bg-[linear-gradient(#ffffff24,#ffffff0c_65%,#ffffff24)] max-[600px]:even:hidden"
						/>
					))}
				</div>
				<header className="relative z-2 pt-7">
					<h1 id="event-title" className="sr-only">
						VandyHacks XIII — Vanderbilt’s collegiate hackathon
					</h1>
					<nav
						className="grid grid-cols-4 gap-px text-xs leading-[normal] uppercase max-[600px]:grid-cols-2 max-[600px]:gap-y-2.5 max-[600px]:text-[10px]"
						aria-label="Main navigation"
					>
						<a
							className={`${navLinkClassName} bg-[#f1f0f3] text-black`}
							href="#home"
						>
							Home <span>↗</span>
						</a>
						<a
							className={navLinkClassName}
							href="mailto:info@vandyhacks.org?subject=Sponsoring%20VandyHacks%20XIII"
						>
							Sponsor <span>↗</span>
						</a>
						<a
							className={navLinkClassName}
							href="https://www.instagram.com/vandyhacks"
							target="_blank"
							rel="noreferrer"
						>
							Instagram <span>↗</span>
						</a>
						<a
							className={navLinkClassName}
							href="mailto:info@vandyhacks.org"
						>
							Contact <span>↗</span>
						</a>
					</nav>
				</header>
				<AsciiWordmark />
				<div className="pointer-events-none relative z-1 mt-auto grid grid-cols-[3fr_1fr] items-end gap-[30px] px-2.5 pb-10 min-[1800px]:pb-[60px] max-[900px]:grid-cols-2 max-[900px]:gap-6 max-[600px]:grid-cols-1 max-[600px]:px-2 max-[600px]:pb-7">
					<div>
						<span className="mb-[18px] block font-['Courier_New',monospace] text-[11px] font-normal tracking-[0.04em] uppercase max-[600px]:mb-3 max-[600px]:text-[10px]">
							Code. Collaborate. Create.
						</span>
						<h2 className="text-[clamp(36px,3.7vw,72px)] leading-[0.98] font-normal tracking-[-0.055em] max-[600px]:text-[40px]">
							The south&apos;s
							<br />
							premier hackathon.
						</h2>
					</div>
					<p className="max-w-[260px] justify-self-end pb-1 text-sm leading-normal text-[#99959e] min-[1800px]:max-w-[320px] min-[1800px]:text-[17px]">
						A weekend to meet new people, learn something new, and
						make something you can call yours.
					</p>
				</div>
			</section>
		</main>
	);
}
