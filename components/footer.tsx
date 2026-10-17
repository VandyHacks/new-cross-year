"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { CTA, EVENT } from "@/lib/event";

const linkClassName =
	"type-body-sm inline-block rounded-sm text-vh-text-soft underline-offset-4 transition-colors hover:text-white hover:underline hover:decoration-vh-purple-300 focus-visible:text-white focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

const labelClassName = "type-label mb-4 text-vh-purple-300";

const iconLinkClassName =
	"inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/15 text-vh-text-soft transition-colors hover:border-vh-purple-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

// Same sections as the navbar, same order, same anchors (XIII omitted — it has no link yet).
// Split into two sub-columns of three under the single "Explore" label.
const exploreColumns = [
	[
		{ label: "Home", href: "#home" },
		{ label: "About", href: "#about" },
		{ label: "Impact", href: "#impact" },
	],
	[
		{ label: "Sponsors", href: "#sponsors" },
		{ label: "Team", href: "#team" },
		{ label: "FAQ", href: "#faq" },
	],
];

function InstagramIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-5"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle
				cx="17.5"
				cy="6.5"
				r="1"
				fill="currentColor"
				stroke="none"
			/>
		</svg>
	);
}

function DevpostIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-5"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinejoin="round"
		>
			<path d="M12 2.5 3.5 7v10l8.5 4.5 8.5-4.5V7z" />
			<path
				d="M9.5 8h2.7c2 0 3.3 1.6 3.3 4s-1.3 4-3.3 4H9.5z"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function LinkedInIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-5"
			fill="currentColor"
		>
			<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.3 9h3.4v11.5H3.3zM9.1 9h3.26v1.57h.05c.45-.86 1.56-1.77 3.21-1.77 3.43 0 4.07 2.26 4.07 5.2v6.5h-3.4v-5.76c0-1.37-.03-3.14-1.91-3.14-1.92 0-2.21 1.5-2.21 3.04v5.86H9.1z" />
		</svg>
	);
}

function YouTubeIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-5"
			fill="currentColor"
		>
			<path d="M23 12s0-3.2-.4-4.7a2.52 2.52 0 0 0-1.77-1.78C19.2 5.1 12 5.1 12 5.1s-7.2 0-8.83.42A2.52 2.52 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.52 2.52 0 0 0 1.77 1.78C4.8 18.9 12 18.9 12 18.9s7.2 0 8.83-.42a2.52 2.52 0 0 0 1.77-1.78C23 15.2 23 12 23 12zM9.75 15.02V8.98L15.5 12z" />
		</svg>
	);
}

function GitHubIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden="true"
			className="size-5"
			fill="currentColor"
		>
			<path d="M12 1.5A10.5 10.5 0 0 0 8.68 22c.52.1.71-.23.71-.5v-1.86c-2.9.63-3.52-1.24-3.52-1.24-.47-1.2-1.16-1.52-1.16-1.52-.95-.65.07-.64.07-.64 1.05.08 1.6 1.08 1.6 1.08.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.32-.26-4.76-1.16-4.76-5.16 0-1.14.4-2.07 1.08-2.8-.11-.27-.47-1.33.1-2.75 0 0 .88-.28 2.88 1.07a9.9 9.9 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.42.21 2.48.1 2.75.67.73 1.08 1.66 1.08 2.8 0 4.01-2.45 4.9-4.78 5.15.38.33.72.97.72 1.96v2.9c0 .28.19.61.72.5A10.5 10.5 0 0 0 12 1.5z" />
		</svg>
	);
}

export default function Footer() {
	const reducedMotion = useReducedMotion();
	const year = new Date().getFullYear();

	// Scroll reveal shared by the five columns and the bottom bar.
	// Index drives the left-to-right 80ms stagger. Static when reduced motion.
	const reveal = (index: number) =>
		reducedMotion
			? {}
			: {
					initial: { opacity: 0, y: 24 },
					whileInView: { opacity: 1, y: 0 },
					viewport: { once: true, amount: 0.2 },
					transition: {
						duration: 0.5,
						ease: "easeOut" as const,
						delay: index * 0.08,
					},
				};

	return (
		<footer
			id="footer"
			className="relative isolate overflow-hidden border-t border-white/10 bg-vh-navy-950 px-[clamp(20px,5vw,72px)] pt-[clamp(72px,12vw,150px)] pb-[clamp(32px,5vw,60px)] text-white"
		>
			{/* Background glow: CSS gradient rising from the bottom edge, behind all content. */}
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(120%_75%_at_50%_118%,rgba(113,56,199,0.40),rgba(49,92,170,0.20)_38%,transparent_68%)]"
				animate={
					reducedMotion
						? undefined
						: { y: [0, -14, 0], scale: [1, 1.05, 1] }
				}
				transition={
					reducedMotion
						? undefined
						: {
								duration: 13,
								ease: "easeInOut",
								repeat: Infinity,
							}
				}
			/>

			<div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-[clamp(24px,4vw,64px)] gap-y-12 lg:flex lg:justify-between lg:items-start">
				{/* Brand column (widest) */}
				<motion.div className="col-span-2 lg:col-span-1" {...reveal(0)}>
					<Image
						src="/logo-trimmed.png"
						alt="VandyHacks"
						width={261}
						height={231}
						className="block h-[138px] w-auto"
					/>
					<p className="type-body-sm mt-4 text-vh-subtle">
						Vanderbilt University
						<br />
						Nashville, TN
					</p>
				</motion.div>

				{/* Link groups — display:contents so each is a column of the parent grid. */}
				<nav aria-label="Footer" className="contents">
					{/* Explore — two sub-columns of three under one label. */}
					<motion.div className="lg:col-span-1" {...reveal(1)}>
						<h2 className={labelClassName}>Explore</h2>
						<div className="flex gap-[clamp(20px,4vw,40px)]">
							{exploreColumns.map((column, index) => (
								<ul
									key={index}
									className="flex flex-col gap-3.5"
								>
									{column.map((link) => (
										<li key={link.href}>
											<a
												className={linkClassName}
												href={link.href}
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							))}
						</div>
					</motion.div>

					{/* Get involved */}
					<motion.div className="lg:col-span-1" {...reveal(2)}>
						<h2 className={labelClassName}>Get involved</h2>
						<ul className="flex flex-col gap-3.5">
							<li>
								<a className={linkClassName} href={CTA.sponsor}>
									Become a Sponsor
								</a>
							</li>
							<li>
								<a className={linkClassName} href={CTA.judge}>
									Become a Judge
								</a>
							</li>
							<li>
								<a
									className={linkClassName}
									href={CTA.interest}
								>
									Get notified for {EVENT.edition}
								</a>
							</li>
						</ul>
					</motion.div>

					{/* Contact */}
					<motion.div
						className="col-span-2 lg:col-span-1 lg:min-w-[224px]"
						{...reveal(3)}
					>
						<h2 className={labelClassName}>Contact</h2>
						<a
							className={linkClassName}
							href={`mailto:${EVENT.email}`}
						>
							{EVENT.email}
						</a>
						<ul className="mt-3 flex flex-nowrap gap-2.5">
							<li>
								<a
									className={iconLinkClassName}
									href="https://www.instagram.com/vandyhacks"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="VandyHacks on Instagram (opens in a new tab)"
								>
									<InstagramIcon />
								</a>
							</li>
							<li>
								<a
									className={iconLinkClassName}
									href="https://vandyhacks.devpost.com/"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="VandyHacks on Devpost (opens in a new tab)"
								>
									<DevpostIcon />
								</a>
							</li>
							<li>
								<a
									className={iconLinkClassName}
									href="https://www.linkedin.com/company/vandyhacks/"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="VandyHacks on LinkedIn (opens in a new tab)"
								>
									<LinkedInIcon />
								</a>
							</li>
							<li>
								<a
									className={iconLinkClassName}
									href="https://www.youtube.com/channel/UC-sXkznjkmHLjpA5nlfdswg"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="VandyHacks on YouTube (opens in a new tab)"
								>
									<YouTubeIcon />
								</a>
							</li>
							<li>
								<a
									className={iconLinkClassName}
									href="https://github.com/VandyHacks"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="VandyHacks on GitHub (opens in a new tab)"
								>
									<GitHubIcon />
								</a>
							</li>
						</ul>
					</motion.div>
				</nav>

				<motion.div
					className="col-span-2 lg:col-span-1 lg:justify-self-end"
					{...reveal(4)}
				>
					<a
						className="inline-flex w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-purple-300"
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
				</motion.div>
			</div>

			{/* Bottom bar */}
			<motion.div
				className="mx-auto mt-[clamp(48px,6vw,80px)] flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-[13px] text-vh-faint sm:flex-row sm:items-center sm:justify-between"
				{...reveal(5)}
			>
				<p>© {year} VandyHacks</p>
				<a
					className="rounded-sm underline-offset-4 transition-colors hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300"
					href="https://mlh.io/code-of-conduct"
					target="_blank"
					rel="noopener noreferrer"
				>
					MLH Code of Conduct
					<span className="sr-only"> (opens in a new tab)</span>
				</a>
			</motion.div>
		</footer>
	);
}
