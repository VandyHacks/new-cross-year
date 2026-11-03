"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import EventCountdown from "@/components/event-countdown";
import Skyline from "@/components/vinyl/skyline";
import {
	primaryButtonClassName,
	secondaryButtonClassName,
} from "@/lib/button-styles";
import { CTA, EVENT } from "@/lib/event";

const WORD = "VandyHacks";

export default function VinylHero() {
	const reducedMotion = useReducedMotion();
	const rise = (delay: number) =>
		reducedMotion
			? {}
			: {
					initial: { opacity: 0, y: 24, filter: "blur(8px)" },
					animate: { opacity: 1, y: 0, filter: "blur(0px)" },
					transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
				};

	return (
		<section
			id="home"
			aria-labelledby="event-title"
			className="relative isolate flex min-h-svh flex-col overflow-hidden"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_38%,_#2a2160_0%,_#111836_45%,_#080d20_100%)]"
				aria-hidden="true"
			/>
			<div className="hero-stars pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
			<Skyline className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38svh] w-full" />

			<div className="flex flex-1 flex-col items-center justify-center px-5 pt-24 pb-[24svh] text-center lg:pt-16 lg:pb-[20svh]">
				<motion.div {...rise(0.1)} className="relative mb-4">
					<div
						className="absolute inset-0 -z-10 scale-150 rounded-full bg-vh-purple-700/40 blur-3xl"
						aria-hidden="true"
					/>
					<Image
						src="/logo.png"
						alt=""
						width={400}
						height={400}
						priority
						className="h-[clamp(72px,12svh,128px)] w-auto drop-shadow-[0_0_24px_rgb(200_162_255/0.5)]"
					/>
				</motion.div>
				<h1
					id="event-title"
					className="font-heading text-[clamp(38px,7.2vw,116px)] leading-none tracking-[-0.03em] text-white"
				>
					<span className="sr-only">{EVENT.name}</span>
					<span aria-hidden="true" className="inline-flex">
						{WORD.split("").map((letter, i) => (
							<motion.span
								key={i}
								className="hero-wordmark inline-block pb-[0.18em] -mb-[0.18em]"
								initial={reducedMotion ? false : { opacity: 0, y: "0.4em", rotateX: -70 }}
								animate={{ opacity: 1, y: 0, rotateX: 0 }}
								transition={{ duration: 0.7, delay: 0.25 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
							>
								{letter}
							</motion.span>
						))}
					</span>
				</h1>
				<motion.p
					{...rise(0.8)}
					className="type-label mt-4 text-vh-purple-300"
				>
					{EVENT.edition} · Code. Collaborate. Create.
				</motion.p>
				<motion.div {...rise(0.95)} className="mt-6">
					<EventCountdown />
				</motion.div>
				<motion.p
					{...rise(1.05)}
					className="type-subheading mt-4 flex flex-wrap justify-center gap-x-3 text-[clamp(13px,1.4vw,18px)] text-vh-text-soft"
				>
					<span>until</span>
					<time className="whitespace-nowrap text-white" dateTime={EVENT.start.toISOString()}>
						{EVENT.dateLabel}
					</time>
					<span className="text-vh-purple-300" aria-hidden="true">
						/
					</span>
					<span className="whitespace-nowrap">
						{EVENT.venue}, {EVENT.city}
					</span>
				</motion.p>
				<motion.div {...rise(1.15)} className="mt-7 flex flex-wrap items-center justify-center gap-3">
					<a className={primaryButtonClassName} href={CTA.interest}>
						Get notified
					</a>
					<a className={secondaryButtonClassName} href={CTA.sponsor}>
						Sponsor {EVENT.edition}
					</a>
				</motion.div>
			</div>

			<motion.div
				className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
				initial={reducedMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.8 }}
				aria-hidden="true"
			>
				<span className="type-label text-[10px] text-vh-faint">Scroll</span>
				<span className="scroll-cue block h-8 w-px bg-gradient-to-b from-vh-purple-300 to-transparent" />
			</motion.div>
		</section>
	);
}
