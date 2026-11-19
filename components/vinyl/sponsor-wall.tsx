"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import Arc from "@/components/vinyl/arc";
import { SlideBody, SlideHeading } from "@/components/vinyl/slides";
import { CTA } from "@/lib/event";
import { type Sponsor, sponsorTiers } from "@/lib/sponsors";

const [giants, large, partners] = sponsorTiers;

const EASE = [0.22, 1, 0.36, 1] as const;

// Hairline cells and a quiet hover (no lift, no glow), the way Linear and
// Vercel present customer logos: the marks carry the wall, not the tiles.
const tileClassName =
	"group relative flex items-center justify-center overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.025] transition-[border-color,background-color] duration-200 ease-out hover:border-vh-purple-300/50 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

// Logos sit at ~70% opacity and come up to full on hover.
const mono =
	"brightness-0 invert opacity-70 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100";

function Mark({ sponsor, size }: { sponsor: Sponsor; size: "lg" | "md" | "sm" }) {
	const { logo, name } = sponsor;
	const nameClassName = `font-heading leading-tight text-vh-text/70 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white ${
		size === "lg" ? "text-[13px]" : size === "md" ? "text-[10px]" : "text-[11px]"
	}`;
	if (!logo) return <span className={`${nameClassName} px-2 text-center`}>{name}</span>;

	const src = `/sponsors/${logo.src}`;
	const tone = logo.tone === "mono" ? mono : "";

	if (logo.kind === "icon" || size === "sm") {
		const icon = size === "lg" ? "size-7" : size === "md" ? "size-5" : "size-4";
		return (
			<span className="flex items-center gap-2 px-2">
				{logo.kind === "icon" && (
					<span className={`relative shrink-0 ${icon}`}>
						<Image
							src={src}
							alt=""
							fill
							sizes="28px"
							className={`object-contain ${tone} ${logo.tone === "color" ? "rounded-sm" : ""}`}
						/>
					</span>
				)}
				<span className={`${nameClassName} ${size === "sm" ? "whitespace-nowrap" : ""}`}>{name}</span>
			</span>
		);
	}

	return (
		<span
			className={`relative block ${size === "lg" ? "h-[44%] w-[70%]" : "h-[44%] w-[72%]"} ${
				logo.plate ? "rounded bg-vh-text" : ""
			}`}
		>
			<Image src={src} alt="" fill sizes="200px" className={`object-contain ${logo.plate ? "p-1" : ""} ${tone}`} />
		</span>
	);
}

// One observer per tier: the grid fades in and its tiles rise into place in
// a short, capped stagger, instead of every tile flying in on its own.
const gridVariants: Variants = {
	hidden: {},
	shown: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};
const tileVariants: Variants = {
	hidden: { opacity: 0, y: 12 },
	shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

function TileGrid({ items, size, className }: { items: Sponsor[]; size: "lg" | "md"; className: string }) {
	const reducedMotion = useReducedMotion();
	return (
		<motion.ul
			className={`grid gap-2 ${className}`}
			variants={reducedMotion ? undefined : gridVariants}
			initial={reducedMotion ? false : "hidden"}
			whileInView="shown"
			viewport={{ once: true, amount: 0.3 }}
		>
			{items.map((sponsor) => (
				<motion.li key={sponsor.name} variants={reducedMotion ? undefined : tileVariants}>
					<a
						href={sponsor.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${sponsor.name} (opens in a new tab)`}
						className={`${tileClassName} ${
							size === "lg" ? "h-[clamp(50px,7.5svh,80px)]" : "h-[clamp(38px,5.4svh,50px)]"
						}`}
					>
						<Mark sponsor={sponsor} size={size} />
					</a>
				</motion.li>
			))}
		</motion.ul>
	);
}

function TierLabel({ children }: { children: string }) {
	return (
		<p className="type-label mb-2.5 flex items-center gap-3 text-[10px] text-vh-subtle">
			{children}
			<span className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" />
		</p>
	);
}

// Two rows of bare marks drifting opposite ways at a slow, constant speed;
// hovering or focusing a row pauses it. The second copy of each row only
// exists for the seamless loop, so it is hidden from assistive tech (and
// from everyone when reduced motion turns the rows into a static list).
function PartnerMarquee() {
	const half = Math.ceil(partners.length / 2);
	const rows = [partners.slice(0, half), partners.slice(half)];
	return (
		<div className="marquee-mask flex flex-col gap-1">
			{rows.map((row, r) => (
				<div key={r} className="marquee flex overflow-hidden">
					{[0, 1].map((copy) => (
						<ul
							key={copy}
							aria-hidden={copy === 1 || undefined}
							className={`marquee-track flex shrink-0 items-center gap-x-8 pr-8 ${r === 1 ? "marquee-reverse" : ""}`}
						>
							{row.map((sponsor) => (
								<li key={sponsor.name}>
									<a
										href={sponsor.url}
										target="_blank"
										rel="noopener noreferrer"
										tabIndex={copy === 1 ? -1 : undefined}
										aria-label={`${sponsor.name} (opens in a new tab)`}
										className="group flex h-8 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300"
									>
										<Mark sponsor={sponsor} size="sm" />
									</a>
								</li>
							))}
						</ul>
					))}
				</div>
			))}
		</div>
	);
}

const tierGap = "mt-[clamp(12px,2svh,24px)]";

export default function SponsorWall() {
	return (
		<section id="sponsors" aria-labelledby="sponsors-title">
			<SlideBody fit>
				<SlideHeading id="sponsors-title">Past Sponsors</SlideHeading>
				<Arc>
					<TierLabel>Global leaders</TierLabel>
					<TileGrid items={giants} size="lg" className="grid-cols-2 sm:grid-cols-3 md:grid-cols-5" />
				</Arc>
				<Arc className={tierGap}>
					<TierLabel>Industry partners</TierLabel>
					<TileGrid items={large} size="md" className="grid-cols-3 sm:grid-cols-4 md:grid-cols-6 2xl:grid-cols-9" />
				</Arc>
				<Arc className={tierGap}>
					<TierLabel>Startups &amp; community</TierLabel>
					<PartnerMarquee />
				</Arc>
				<Arc className="mt-[clamp(14px,2.4svh,28px)]">
					<p className="type-body-sm flex flex-wrap items-center gap-x-4 gap-y-2 text-vh-muted">
						Want your team in front of 1,000+ student builders?
						<a
							className="type-button inline-flex items-center gap-1.5 rounded-sm text-vh-purple-100 underline decoration-vh-purple-300/40 underline-offset-4 transition-colors hover:text-white hover:decoration-vh-purple-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300"
							href={CTA.sponsor}
						>
							Become a sponsor <span aria-hidden="true">→</span>
						</a>
					</p>
				</Arc>
			</SlideBody>
		</section>
	);
}
