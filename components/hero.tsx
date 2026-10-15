"use client";

import AsciiWordmark from "@/components/ascii-wordmark";

const navigationLinks = [
	{ label: "Home", href: "#home" },
	{ label: "About", href: "#about" },
	{ label: "Stats", href: "#stats" },
	{ label: "Sponsors", href: "#sponsors" },
	{ label: "Team", href: "#team" },
	{ label: "FAQ", href: "#faq" },
];

export function SiteNavigation() {
	return (
		<header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d20]/90 px-[clamp(16px,3vw,48px)] text-white shadow-lg shadow-black/20 backdrop-blur-xl">
			<nav
				className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-center gap-1 py-2 text-xs uppercase tracking-[0.08em] sm:gap-2"
				aria-label="Main navigation"
			>
				{navigationLinks.map((link) => (
					<a
						key={link.href}
						className="rounded-md px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#c8a2ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c8a2ff]"
						href={link.href}
					>
						{link.label}
					</a>
				))}
					<span className="rounded-md bg-[#7138c7] px-3 py-2 text-white select-none">
						XIII
					</span>
				</nav>
		</header>
	);
}

export default function Hero() {
	return (
		<section
			id="home"
			className="relative isolate scroll-mt-20 overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_50%_42%,_#242052_0%,_#101731_48%,_#080d20_100%)] px-[clamp(20px,5vw,72px)]"
			aria-labelledby="event-title"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
				aria-hidden="true"
			/>
			<div className="mx-auto flex min-h-[min(760px,calc(100svh-3.5rem))] max-w-7xl flex-col justify-center py-10 sm:py-12">
				<h1
					id="event-title"
					className="relative mx-auto mb-2 h-[clamp(220px,42vw,440px)] w-full max-w-6xl shrink-0"
				>
					<span className="sr-only">VandyHacks</span>
					<div className="absolute inset-0" aria-hidden="true">
						<AsciiWordmark introActive />
					</div>
				</h1>
				<div className="relative z-10 text-center">
					<p className="mb-4 font-mono text-xs tracking-[0.28em] text-[#c8a2ff] uppercase sm:text-sm">
						Code. Collaborate. Create.
					</p>
					<div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
						<p className="rounded-full border border-[#a77ae9]/50 bg-[#7138c7]/20 px-4 py-2 font-mono text-sm text-[#eadcff] sm:text-base">
							XIII
						</p>
						<p className="font-mono text-sm text-[#c3c8dc] sm:text-base">
							March 2027 · Vanderbilt University · Nashville, TN
						</p>
					</div>
					<p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#c3c8dc] sm:text-base">
						A weekend to meet new people, learn something new, and
						make something you can call yours.
					</p>
				</div>
			</div>
		</section>
	);
}
