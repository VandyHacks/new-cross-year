"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Arc from "@/components/vinyl/arc";
import { SlideBody, SlideHeading } from "@/components/vinyl/slides";
import { secondaryButtonClassName } from "@/lib/button-styles";
import { CTA } from "@/lib/event";
import { type Sponsor, sponsorTiers } from "@/lib/sponsors";

const [giants, large, partners] = sponsorTiers;

const tileClassName =
	"group relative flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-vh-navy-800/50 backdrop-blur-sm transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:border-vh-purple-300/60 hover:bg-vh-navy-800/80 hover:shadow-[0_8px_28px_rgb(113_56_199/0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

function Mark({ sponsor, size }: { sponsor: Sponsor; size: "lg" | "md" | "sm" }) {
	const { logo, name } = sponsor;
	const nameClassName = `font-heading leading-tight text-vh-text/85 transition-colors group-hover:text-white ${
		size === "lg" ? "text-[13px]" : "text-[10px]"
	}`;
	if (!logo) return <span className={`${nameClassName} px-2 text-center`}>{name}</span>;

	const src = `/sponsors/${logo.src}`;
	const tone =
		logo.tone === "mono"
			? "brightness-0 invert opacity-80 transition-opacity group-hover:opacity-100"
			: "";

	if (logo.kind === "icon" || size === "sm") {
		const icon = size === "lg" ? "size-7" : size === "md" ? "size-5" : "size-4";
		return (
			<span className="flex items-center gap-2 px-2">
				{logo.kind === "icon" && (
					<span className={`relative shrink-0 ${icon}`}>
						<Image src={src} alt="" fill sizes="28px" className={`object-contain ${tone} ${logo.tone === "color" ? "rounded-sm" : ""}`} />
					</span>
				)}
				<span className={nameClassName}>{name}</span>
			</span>
		);
	}

	return (
		<span
			className={`relative block ${size === "lg" ? "h-[48%] w-[72%]" : "h-[46%] w-[74%]"} ${
				logo.plate ? "rounded bg-vh-text" : ""
			}`}
		>
			<Image
				src={src}
				alt=""
				fill
				sizes="200px"
				className={`object-contain ${logo.plate ? "p-1" : ""} ${tone}`}
			/>
		</span>
	);
}

function Tile({ sponsor, size, index }: { sponsor: Sponsor; size: "lg" | "md"; index: number }) {
	const reducedMotion = useReducedMotion();
	return (
		<motion.li
			initial={reducedMotion ? false : { opacity: 0, x: -50, rotate: -6 }}
			whileInView={{ opacity: 1, x: 0, rotate: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 0.6, delay: 0.1 + index * 0.035, ease: [0.22, 1, 0.36, 1] }}
		>
			<a
				href={sponsor.url}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${sponsor.name} (opens in a new tab)`}
				className={`${tileClassName} ${size === "lg" ? "h-[clamp(52px,8.5svh,84px)]" : "h-[clamp(38px,5.6svh,54px)]"}`}
			>
				<Mark sponsor={sponsor} size={size} />
			</a>
		</motion.li>
	);
}

function TierLabel({ children, count }: { children: string; count: number }) {
	return (
		<p className="type-label mb-2.5 flex items-center gap-3 text-[10px] text-vh-subtle">
			{children}
			<span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
			<span className="text-vh-faint">{count}</span>
		</p>
	);
}

// Two rows drifting opposite ways; the second copy of each row is for the
// seamless loop and is hidden from assistive tech.
function PartnerMarquee() {
	const half = Math.ceil(partners.length / 2);
	const rows = [partners.slice(0, half), partners.slice(half)];
	return (
		<div className="flex flex-col gap-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
			{rows.map((row, r) => (
				<div key={r} className="marquee group/marquee flex overflow-hidden">
					{[0, 1].map((copy) => (
						<ul
							key={copy}
							aria-hidden={copy === 1 || undefined}
							className={`marquee-track flex shrink-0 gap-2 pr-2 ${r === 1 ? "marquee-reverse" : ""}`}
						>
							{row.map((sponsor) => (
								<li key={sponsor.name}>
									<a
										href={sponsor.url}
										target="_blank"
										rel="noopener noreferrer"
										tabIndex={copy === 1 ? -1 : undefined}
										aria-label={`${sponsor.name} (opens in a new tab)`}
										className={`${tileClassName} h-9 rounded-full px-2`}
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

export default function SponsorWall() {
	return (
		<section id="sponsors" aria-labelledby="sponsors-title">
			<SlideBody>
				<SlideHeading id="sponsors-title">
					Sponsors
				</SlideHeading>
				<Arc>
					<TierLabel count={giants.length}>Global leaders</TierLabel>
					<ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
						{giants.map((sponsor, i) => (
							<Tile key={sponsor.name} sponsor={sponsor} size="lg" index={i} />
						))}
					</ul>
				</Arc>
				<Arc className="mt-[clamp(14px,2.6svh,28px)]">
					<TierLabel count={large.length}>Industry partners</TierLabel>
					<ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
						{large.map((sponsor, i) => (
							<Tile key={sponsor.name} sponsor={sponsor} size="md" index={i} />
						))}
					</ul>
				</Arc>
				<Arc className="mt-[clamp(14px,2.6svh,28px)]">
					<TierLabel count={partners.length}>Startups &amp; community</TierLabel>
					<PartnerMarquee />
				</Arc>
				<Arc className="mt-[clamp(16px,3svh,32px)]">
					<a className={secondaryButtonClassName} href={CTA.sponsor}>
						Become a sponsor →
					</a>
				</Arc>
			</SlideBody>
		</section>
	);
}
