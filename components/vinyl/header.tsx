"use client";

import {
	AnimatePresence,
	motion,
	type MotionValue,
	useReducedMotion,
	useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Disc from "@/components/vinyl/disc";
import { FOOTER_INDEX, SLIDES, useStage } from "@/components/vinyl/stage";
import { primaryButtonClassName } from "@/lib/button-styles";
import { CTA } from "@/lib/event";

// `slide` marks the link that's highlighted while that slide is on screen.
// Sign Up, Judge and Sponsor Us deep-link to the matching Sign Up tab.
const links: { label: string; href: string; slide?: string }[] = [
	{ label: "Home", href: "#home", slide: "home" },
	{ label: "About", href: "#about", slide: "about" },
	{ label: "Impact", href: "#impact", slide: "impact" },
	{ label: "Sponsors", href: "#sponsors", slide: "sponsors" },
	{ label: "Sign Up", href: CTA.interest, slide: "get-involved" },
	{ label: "Judge", href: CTA.judge },
	{ label: "Sponsor Us", href: CTA.sponsor },
	{ label: "FAQ", href: "#faq", slide: "faq" },
	{ label: "Team", href: "#team", slide: "team" },
];

const labelled = SLIDES.flatMap((slide, index) =>
	"label" in slide ? [{ label: slide.label, index }] : [],
);

function TickerLabel({ label, index, smooth }: { label: string; index: number; smooth: MotionValue<number> }) {
	const y = useTransform(smooth, (p) => `${(index - p) * 1.25}em`);
	const opacity = useTransform(smooth, (p) => {
		const d = Math.abs(index - p);
		return d < 1 ? 1 - d * 0.7 : Math.max(0, 0.3 * (2 - d) - 0.05);
	});
	const scale = useTransform(smooth, (p) => 1 - Math.min(1, Math.abs(index - p)) * 0.18);
	return (
		<motion.span
			className="absolute top-1/2 left-0 -mt-[0.6em] block origin-left leading-[1.2] whitespace-nowrap"
			style={{ y, opacity, scale }}
		>
			{label}
		</motion.span>
	);
}

// Phone/tablet stand-in for the big record: a small disc that turns with the
// page and a vertical ticker of current / previous / next section names.
function MiniRecord() {
	const { smooth } = useStage();
	const spin = useTransform(smooth, (p) => -p * 150);
	const hidden = useTransform(smooth, [FOOTER_INDEX - 0.6, FOOTER_INDEX], [1, 0]);
	return (
		<motion.div className="flex items-center gap-2.5 lg:hidden" style={{ opacity: hidden }} aria-hidden="true">
			<Disc spin={spin} className="size-8 shrink-0" />
			<span className="relative h-[3.75em] w-28 overflow-hidden font-heading text-[11px] tracking-[0.16em] text-white uppercase [mask-image:linear-gradient(transparent,black_30%,black_70%,transparent)]">
				{labelled.map((slide) => (
					<TickerLabel key={slide.index} label={slide.label} index={slide.index} smooth={smooth} />
				))}
			</span>
		</motion.div>
	);
}

function MlhBadge() {
	return (
		<a
			id="mlh-trust-badge"
			className="absolute top-0 right-[clamp(12px,2vw,32px)] z-10 block w-[clamp(44px,4.6vw,72px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300"
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
				className="h-auto w-full"
			/>
		</a>
	);
}

export default function VinylHeader() {
	const { active } = useStage();
	const reducedMotion = useReducedMotion();
	const [menuOpen, setMenuOpen] = useState(false);
	const activeKey: string = SLIDES[active]?.key ?? "home";

	useEffect(() => {
		if (!menuOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMenuOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	return (
		<motion.header
			initial={reducedMotion ? false : { y: -24, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="fixed inset-x-0 top-0 z-50"
		>
			<div className="relative flex h-16 items-center border-b border-white/10 bg-vh-navy-950/55 pr-[calc(clamp(12px,2vw,32px)+clamp(44px,4.6vw,72px)+32px)] pl-[clamp(12px,2vw,32px)] backdrop-blur-xl">
				<a href="#home" aria-label="VandyHacks — back to top" className="flex shrink-0 items-center rounded-sm pr-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-purple-300">
					<Image src="/logo-trimmed.png" alt="VandyHacks" width={261} height={231} priority className="h-8 w-auto" />
				</a>
				<span className="mr-4 h-8 w-px bg-white/20" aria-hidden="true" />
				<MiniRecord />

				<nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
					{links.map((link) => {
						const isActive = activeKey === link.slide;
						return (
							<a
								key={link.href}
								href={link.href}
								aria-current={isActive ? "true" : undefined}
								className={`type-nav relative rounded-md px-2 py-2 whitespace-nowrap [word-spacing:-0.4em] transition-colors xl:px-3 duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 ${
									isActive ? "text-white" : "text-vh-muted hover:text-vh-purple-300"
								}`}
							>
								{link.label}
								{isActive && (
									<motion.span
										layoutId="vinyl-nav-pill"
										className="absolute inset-0 -z-10 rounded-md bg-white/8 shadow-[inset_0_-2px_0_#c8a2ff]"
										transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
									/>
								)}
							</a>
						);
					})}
				</nav>

				<div className="ml-auto flex items-center gap-2">
					<span className="hidden sm:block">
						<a className={primaryButtonClassName} href={CTA.interest}>
							Get notified
						</a>
					</span>
					<button
						type="button"
						onClick={() => setMenuOpen((v) => !v)}
						aria-expanded={menuOpen}
						aria-controls="vinyl-mobile-menu"
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 lg:hidden"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
							{menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : (
								<>
									<path d="M4 7h16" />
									<path d="M4 12h16" />
									<path d="M4 17h16" />
								</>
							)}
						</svg>
					</button>
				</div>
				<MlhBadge />
			</div>

			<AnimatePresence>
				{menuOpen && (
					<motion.nav
						id="vinyl-mobile-menu"
						aria-label="Mobile navigation"
						initial={reducedMotion ? false : { opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="h-[calc(100svh-4rem)] overflow-y-auto border-b border-white/10 bg-vh-navy-950/95 backdrop-blur-xl lg:hidden"
					>
						<ul className="flex flex-col gap-1 px-5 py-6">
							{links.map((link, i) => (
								<motion.li
									key={link.href}
									initial={reducedMotion ? false : { opacity: 0, x: -16 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.04 * i }}
								>
									<a
										href={link.href}
										onClick={() => setMenuOpen(false)}
										aria-current={activeKey === link.slide ? "true" : undefined}
										className={`block rounded-md px-3 py-3 font-heading text-2xl tracking-[0.12em] uppercase transition-colors ${
											activeKey === link.slide ? "text-vh-purple-300" : "text-white hover:text-vh-purple-300"
										}`}
									>
										{link.label}
									</a>
								</motion.li>
							))}
							<li className="mt-4 px-3">
								<a className={primaryButtonClassName} href={CTA.interest} onClick={() => setMenuOpen(false)}>
									Get notified
								</a>
							</li>
						</ul>
					</motion.nav>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
