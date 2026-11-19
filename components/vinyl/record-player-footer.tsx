"use client";

import {
	motion,
	type MotionValue,
	useAnimationFrame,
	useInView,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import {
	DevpostIcon,
	GitHubIcon,
	InstagramIcon,
	LinkedInIcon,
	YouTubeIcon,
} from "@/components/footer";
import Disc from "@/components/vinyl/disc";
import { useStage } from "@/components/vinyl/stage";
import { handover, landing } from "@/components/vinyl/stage-record";
import { CTA, EVENT } from "@/lib/event";

// Tonearm angles (deg): parked clear of the disc, swung onto the grooves to play.
const ARM_PARKED = 0;
const ARM_PLAYING = 31;

function Tonearm({ angle }: { angle: MotionValue<number> }) {
	// Drawn in a 100×300 box; pivot (transform-origin) at (50, 40), stylus at (50, 290).
	return (
		<motion.svg
			viewBox="0 0 100 300"
			className="absolute top-[0.51cqh] left-[calc(50cqw+49.89cqh)] h-[48.68cqh] w-[16.23cqh] origin-[50%_13.33%] drop-shadow-[0_6px_10px_rgb(0_0_0/0.6)]"
			style={{ rotate: angle }}
			aria-hidden="true"
		>
			<defs>
				{/* userSpaceOnUse: fixed x-coords so the near-vertical tube's gradient doesn't collapse. */}
				<linearGradient id="arm-metal" gradientUnits="userSpaceOnUse" x1="38" y1="0" x2="62" y2="0">
					<stop offset="0%" stopColor="#8b93ad" />
					<stop offset="50%" stopColor="#f1f0f3" />
					<stop offset="100%" stopColor="#8b93ad" />
				</linearGradient>
			</defs>
			{/* Counterweight cap behind the pivot. */}
			<rect x="41" y="4" width="18" height="18" rx="3" fill="#2a3256" stroke="#c3c8dc" strokeOpacity="0.4" />
			{/* Pivot (the transform-origin). */}
			<circle cx="50" cy="40" r="17" fill="#151e3d" stroke="#c8a2ff" strokeOpacity="0.5" strokeWidth="2" />
			<circle cx="50" cy="40" r="7" fill="url(#arm-metal)" />
			{/* Arm tube, bending into the cartridge so they read as one piece. */}
			<path d="M50 40 L50 214 L45 261" fill="none" stroke="url(#arm-metal)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
			{/* Cartridge + stylus, tilted −12° about the needle tip at (50,290). */}
			<g transform="rotate(-12 50 290)">
				<rect x="40" y="256" width="20" height="31" rx="4" fill="#d5d9e8" stroke="#aab0c2" strokeWidth="0.75" />
				<rect x="46.5" y="281" width="7" height="9" rx="1" fill="#c8a2ff" />
			</g>
		</motion.svg>
	);
}

// The deck's top face (platter + record) lives inside a 3D perspective/transform
// context, which is its own stacking context. The pinned record, though, is a
// `fixed` overlay that paints above the whole deck — so a tonearm drawn inside
// that context can never sit on top of the record. The fix: draw the tonearm in
// a SECOND deck that shares a grid cell with the real one (identical geometry →
// pixel-aligned) but lives OUTSIDE the perspective context and is raised above
// the record's stacking level (z-25 > the record's z-20). Everything else about
// the deck and record is unchanged.
function Deck({ year }: { year: number }) {
	const { progress, desktop } = useStage();
	const reducedMotion = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.4 });
	const ownSpin = useMotionValue(0);

	// 0→1 as the pinned record finishes landing; drops the tonearm on desktop.
	const landed = useTransform(progress, (p) => handover(landing(p)));
	const target = useMotionValue(ARM_PARKED);
	const angle = useSpring(target, { stiffness: 60, damping: 14 });
	useEffect(() => {
		const update = () =>
			target.set(inView || landed.get() >= 1 ? ARM_PLAYING : ARM_PARKED);
		update();
		return landed.on("change", update);
	}, [inView, landed, target]);

	useAnimationFrame((_, delta) => {
		if (!desktop && inView && !reducedMotion) ownSpin.set(ownSpin.get() + delta * 0.09);
	});

	return (
		<div className="mx-auto grid">
			{/* Real deck: tilted top face with platter + record, then the front panel
			    and feet. No tonearm here — it would be trapped under the record. */}
			<div className="deck relative col-start-1 row-start-1">
				<div ref={ref} className="deck-top turntable">
					<div aria-hidden="true" className="absolute inset-0 rounded-t-[3cqh] border border-b-0 border-white/12 bg-[linear-gradient(180deg,#0e1430_0%,#18214a_70%,#1d2756_100%)] shadow-[inset_0_2px_0_rgb(255_255_255/0.06)]" />
					{/* Platter: the metal ring with strobe dots that the record sits on. */}
					<div aria-hidden="true" className="platter absolute top-[4cqh] left-1/2 size-[92cqh] -translate-x-1/2 rounded-full" />
					{/* data-platter stays mounted so the pinned record can measure it. The
					    disc inside is mobile-only; on desktop the pinned record lands here. */}
					<div aria-hidden="true" data-platter className="absolute top-[6cqh] left-1/2 size-[88cqh] -translate-x-1/2 rounded-full">
						<div className="size-full lg:hidden">
							<Disc spin={ownSpin} className="size-full" />
						</div>
					</div>
				</div>
				<div className="relative rounded-b-[20px] border border-t-0 border-white/12 bg-[linear-gradient(180deg,#1b2552_0%,#121a3c_18%,#0c1230_100%)] px-[clamp(20px,3vw,44px)] pt-[clamp(36px,4svh,54px)] pb-4 shadow-[inset_0_1px_0_rgb(200_162_255/0.35),0_30px_60px_rgb(0_0_0/0.6)]">
					<Screw className="top-3 left-3" />
					<Screw className="top-3 right-3" />
					<div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:grid-cols-[1.2fr_1.6fr_1.2fr]">
						<div className="col-span-2 flex items-center gap-4 lg:col-span-1">
							<Image src="/logo-trimmed.png" alt="VandyHacks" width={261} height={231} className="h-12 w-auto" />
							<p className="type-body-sm text-vh-subtle">
								VandyHacks,
								<br />
								{EVENT.venue}
							</p>
						</div>
						<nav aria-label="Footer">
							<h2 className={labelClassName}>Explore</h2>
							<ul className="grid grid-cols-3 gap-x-6 gap-y-1.5">
								{explore.map((link) => (
									<li key={link.href}>
										<a className={linkClassName} href={link.href}>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</nav>
						<div className="col-span-2 lg:col-span-1">
							<h2 className={labelClassName}>Contact</h2>
							<a className={linkClassName} href={`mailto:${EVENT.email}`}>
								{EVENT.email}
							</a>
							<ul className="mt-3 flex gap-2">
								{socials.map(({ label, href, Icon }) => (
									<li key={label}>
										<a
											className={iconLinkClassName}
											href={href}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`VandyHacks on ${label} (opens in a new tab)`}
										>
											<Icon />
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-3 text-[12px] text-vh-faint sm:flex-row sm:items-center sm:justify-between">
						<p>© {year} VandyHacks</p>
						<a
							className="rounded-sm underline-offset-4 hover:underline"
							href="https://mlh.io/code-of-conduct"
							target="_blank"
							rel="noopener noreferrer"
						>
							MLH Code of Conduct
							<span className="sr-only"> (opens in a new tab)</span>
						</a>
						<a className="rounded-sm underline-offset-4 hover:underline" href="#home">
							Back to top ↑
						</a>
					</div>
				</div>
				{/* Feet. */}
				<div className="flex justify-between px-[8%]" aria-hidden="true">
					<span className="h-2.5 w-14 rounded-b-md bg-[#05081a]" />
					<span className="h-2.5 w-14 rounded-b-md bg-[#05081a]" />
				</div>
			</div>
			{/* Tonearm overlay: a second, identical deck in the same grid cell so it
			    lines up exactly, but outside the real deck's perspective context and
			    above the pinned record, so the arm + stylus rest on top of the vinyl. */}
			<div aria-hidden="true" className="deck relative col-start-1 row-start-1 pointer-events-none z-[25]">
				<div className="deck-top turntable">
					<Tonearm angle={angle} />
				</div>
			</div>
		</div>
	);
}

const linkClassName =
	"type-body-sm inline-block rounded-sm text-vh-text-soft underline-offset-4 transition-colors hover:text-white hover:underline hover:decoration-vh-purple-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";
const labelClassName = "type-label mb-3 text-[10px] text-vh-purple-300";
// Get Involved CTA pill buttons above the turntable.
const ctaButtonClassName =
	"type-button inline-flex min-w-[8rem] items-center justify-center rounded-lg border border-vh-purple-300/50 bg-vh-purple-700/10 px-4 py-2 text-[clamp(12px,1.2vw,14px)] text-vh-purple-100 transition-[color,background-color,border-color,box-shadow] duration-200 hover:border-vh-purple-300 hover:bg-vh-purple-700/25 hover:text-white hover:shadow-[0_0_18px_rgba(200,162,255,0.35)] focus-visible:border-vh-purple-300 focus-visible:text-white focus-visible:shadow-[0_0_18px_rgba(200,162,255,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";
const iconLinkClassName =
	"inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/15 bg-black/20 text-vh-text-soft shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-colors hover:border-vh-purple-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

const explore = [
	{ label: "Home", href: "#home" },
	{ label: "About", href: "#about" },
	{ label: "Impact", href: "#impact" },
	{ label: "Sponsors", href: "#sponsors" },
	{ label: "Team", href: "#team" },
	{ label: "FAQ", href: "#faq" },
];

const involve = [
	{ label: "Become a Sponsor", href: CTA.sponsor },
	{ label: "Become a Hacker", href: CTA.interest },
	{ label: "Become a Judge", href: CTA.judge },
];

const socials = [
	{ label: "Instagram", href: "https://www.instagram.com/vandyhacks", Icon: InstagramIcon },
	{ label: "Devpost", href: "https://vandyhacks.devpost.com/", Icon: DevpostIcon },
	{ label: "LinkedIn", href: "https://www.linkedin.com/company/vandyhacks/", Icon: LinkedInIcon },
	{ label: "YouTube", href: "https://www.youtube.com/channel/UC-sXkznjkmHLjpA5nlfdswg", Icon: YouTubeIcon },
	{ label: "GitHub", href: "https://github.com/VandyHacks", Icon: GitHubIcon },
];

// Corner screws on the front panel.
function Screw({ className }: { className: string }) {
	return (
		<span
			aria-hidden="true"
			className={`absolute size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#c3c8dc,#3b4466_70%)] after:absolute after:inset-x-0.5 after:top-1/2 after:h-px after:-translate-y-1/2 after:rotate-45 after:bg-black/50 ${className}`}
		/>
	);
}

// The page ends on a record player: the tilted deck is where the record lands.
export default function RecordPlayerFooter() {
	const year = new Date().getFullYear();

	return (
		<footer
			id="footer"
			className="relative flex min-h-svh flex-col justify-end overflow-hidden px-[clamp(16px,4vw,72px)] pt-20 lg:pt-16"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background:radial-gradient(90%_60%_at_50%_100%,rgba(113,56,199,0.32),rgba(49,92,170,0.14)_45%,transparent_75%)]"
			/>
			<div className="relative z-30 mx-auto flex flex-1 flex-col items-center justify-center pb-4 text-center">
				<p className="font-heading text-[clamp(24px,3vw,44px)] leading-tight tracking-[0.06em] text-white">
					See you in Nashville.
				</p>
				<p className="mt-3 font-mono text-[clamp(15px,1.9vw,26px)] font-bold tracking-[0.14em] text-vh-purple-300 uppercase">
					{EVENT.dateLabel.toUpperCase()}
				</p>
				<ul className="mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
					{involve.map(({ label, href }) => (
						<li key={href}>
							<a href={href} className={ctaButtonClassName}>
								{label}
							</a>
						</li>
					))}
				</ul>
			</div>
			<Deck year={year} />
		</footer>
	);
}
