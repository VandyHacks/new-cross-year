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

// Tonearm angles (deg): parked beside the platter, and with the stylus down
// on the record's outer grooves.
const ARM_PARKED = 0;
const ARM_PLAYING = 24;

function Tonearm({ angle }: { angle: MotionValue<number> }) {
	// Drawn in a 100×300 box whose pivot is (70, 30); positioned so the pivot
	// sits just off the platter's top-right (see the cqh math in DeckTop).
	return (
		<motion.svg
			viewBox="0 0 100 300"
			className="absolute top-[2.2cqh] left-[85.8cqh] h-[78cqh] w-[26cqh] origin-[70%_10%] drop-shadow-[0_6px_10px_rgb(0_0_0/0.6)]"
			style={{ rotate: angle }}
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="arm-metal" x1="0" x2="1">
					<stop offset="0%" stopColor="#8b93ad" />
					<stop offset="50%" stopColor="#f1f0f3" />
					<stop offset="100%" stopColor="#8b93ad" />
				</linearGradient>
			</defs>
			<rect x="61" y="0" width="18" height="16" rx="3" fill="#2a3256" stroke="#c3c8dc" strokeOpacity="0.4" />
			<circle cx="70" cy="30" r="17" fill="#151e3d" stroke="#c8a2ff" strokeOpacity="0.5" strokeWidth="2" />
			<circle cx="70" cy="30" r="7" fill="url(#arm-metal)" />
			<path d="M70 30 L62 238 L48 262" fill="none" stroke="url(#arm-metal)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
			<rect x="30" y="256" width="24" height="34" rx="4" transform="rotate(32 42 273)" fill="#d5d9e8" />
			<rect x="34" y="282" width="8" height="8" rx="1" transform="rotate(32 42 273)" fill="#c8a2ff" />
		</motion.svg>
	);
}

// The deck's top face: the platter and tonearm, centred and laid out in cqh
// units (percent of the face's height) so it scales as one piece.
function DeckTop() {
	const { smooth, desktop, spin: stageSpin } = useStage();
	const reducedMotion = useReducedMotion();
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { amount: 0.4 });
	const ownSpin = useMotionValue(0);

	// Desktop: the pinned record flies in, this disc fades in under it, and
	// the arm drops once it's down. Phones: plays whenever it's on screen.
	const landed = useTransform(smooth, (p) => handover(landing(p)));
	const target = useMotionValue(ARM_PARKED);
	const angle = useSpring(target, { stiffness: 60, damping: 14 });
	useEffect(() => {
		if (!desktop) {
			target.set(inView ? ARM_PLAYING : ARM_PARKED);
			return;
		}
		const sync = (v: number) => target.set(v >= 1 ? ARM_PLAYING : ARM_PARKED);
		sync(landed.get());
		return landed.on("change", sync);
	}, [desktop, landed, inView, target]);

	useAnimationFrame((_, delta) => {
		if (!desktop && inView && !reducedMotion) ownSpin.set(ownSpin.get() + delta * 0.09);
	});

	return (
		<div ref={ref} className="deck-top turntable">
			<div aria-hidden="true" className="absolute inset-0 rounded-t-[3cqh] border border-b-0 border-white/12 bg-[linear-gradient(180deg,#0e1430_0%,#18214a_70%,#1d2756_100%)] shadow-[inset_0_2px_0_rgb(255_255_255/0.06)]" />
			{/* Platter: the metal ring with strobe dots that the record sits on. */}
			<div aria-hidden="true" className="platter absolute top-[4cqh] left-[4cqh] size-[92cqh] rounded-full" />
			<div aria-hidden="true" data-platter className="absolute top-[6cqh] left-[6cqh] size-[88cqh] rounded-full">
				<motion.div className="size-full" style={{ opacity: desktop ? landed : 1 }}>
					<Disc spin={desktop ? stageSpin : ownSpin} className="size-full" minimal />
				</motion.div>
			</div>
			<Tonearm angle={angle} />
			{/* Get Involved CTAs on the deck's right side (desktop/tablet). On
			    phones the deck is too narrow; these stay reachable via the nav and
			    the Get Involved section. */}
			{/* A nav panel integrated into the deck's right half: a date eyebrow,
			    then the CTAs as a divider-separated list, centred in the space. */}
			<div className="absolute top-[7cqh] right-[7cqh] bottom-[7cqh] left-[calc(50cqw+8cqh)] hidden flex-col justify-center sm:flex">
				<div className="mx-auto w-fit">
					<p className="mb-[4cqh] font-mono text-[7cqh] font-bold tracking-[0.12em] text-vh-purple-300 uppercase">
						{EVENT.dateLabel.toUpperCase()}
					</p>
					<ul className="flex flex-col border-y border-white/12 divide-y divide-white/12">
						{involve.map(({ label, href }) => (
							<li key={href}>
								<a href={href} className={deckLinkClassName}>
									<span className="transition-transform duration-300 group-hover:translate-x-[1.6cqh] group-focus-visible:translate-x-[1.6cqh]">
										{label}
									</span>
									<span
										aria-hidden="true"
										className="-translate-x-[2cqh] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
									>
										→
									</span>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

const linkClassName =
	"type-body-sm inline-block rounded-sm text-vh-text-soft underline-offset-4 transition-colors hover:text-white hover:underline hover:decoration-vh-purple-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";
const labelClassName = "type-label mb-3 text-[10px] text-vh-purple-300";
// A clean text CTA on the turntable's right side — no box. On hover the label
// warms to purple, nudges right, and reveals an arrow. Sized in cqh so it scales
// with the deck.
const deckLinkClassName =
	"group flex items-center gap-[2cqh] py-[6cqh] font-heading text-[6cqh] leading-none tracking-[0.04em] whitespace-nowrap text-white transition-colors duration-300 hover:text-vh-purple-300 focus-visible:text-vh-purple-300 focus-visible:outline-2 focus-visible:outline-offset-[0.8cqh] focus-visible:outline-vh-purple-300";
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
	{ label: "Become a Judge", href: CTA.judge },
	{ label: "Get Notified", href: CTA.interest },
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

// The page ends on a record player seen from slightly above: the tilted deck
// is where the record lands, and the footer is the player's front panel.
export default function RecordPlayerFooter() {
	const year = new Date().getFullYear();

	return (
		<footer
			id="footer"
			className="relative flex min-h-svh flex-col justify-end overflow-hidden px-[clamp(16px,4vw,72px)] pt-24"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background:radial-gradient(90%_60%_at_50%_100%,rgba(113,56,199,0.32),rgba(49,92,170,0.14)_45%,transparent_75%)]"
			/>
			<div className="relative z-30 mx-auto flex flex-1 flex-col items-center justify-center pb-6 text-center">
				<p className="font-heading text-[clamp(26px,3.6vw,52px)] leading-tight tracking-[0.06em] text-white">
					See you in Nashville.
				</p>
			</div>
			<div className="deck relative mx-auto">
				<DeckTop />
				<div className="relative rounded-b-[20px] border border-t-0 border-white/12 bg-[linear-gradient(180deg,#1b2552_0%,#121a3c_18%,#0c1230_100%)] px-[clamp(20px,3vw,44px)] pt-[clamp(20px,3svh,36px)] pb-5 shadow-[inset_0_1px_0_rgb(200_162_255/0.35),0_30px_60px_rgb(0_0_0/0.6)]">
					<Screw className="top-3 left-3" />
					<Screw className="top-3 right-3" />
					<div className="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-[1.2fr_1.6fr_1.2fr]">
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
					<div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-[12px] text-vh-faint sm:flex-row sm:items-center sm:justify-between">
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
		</footer>
	);
}
