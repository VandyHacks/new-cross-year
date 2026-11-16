"use client";

import { motion, useReducedMotion } from "motion/react";
import EventCountdown from "@/components/event-countdown";
import Skyline from "@/components/vinyl/skyline";
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
			<div className="hero-twinkle" aria-hidden="true" />
			<Skyline className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60svh] w-full overflow-visible" />

			{/* Music note graphics*/}
			{/* Left side */}
			<svg className="music-note left-[16%] top-[15%] h-8 w-8" style={{ animationDelay: "5s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M9 3v10.55A4 4 0 1 0 11 17V7h8v6.55A4 4 0 1 0 21 17V3H9z" />
			</svg>
			<svg className="music-note left-[28%] top-[75%] h-8 w-8" style={{ animationDelay: "1.5s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M9 3v10.55A4 4 0 1 0 11 17V7h8v6.55A4 4 0 1 0 21 17V3H9z" />
			</svg>
			<svg className="music-note left-[19%] top-[76%] h-6 w-6" style={{ animationDelay: "4s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>
			<svg className="music-note left-[19%] top-[18%] h-6 w-6" style={{ animationDelay: "0s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>

			{/* Right side */}
			<svg className="music-note left-[90%] top-[25%] h-10 w-10" style={{ animationDelay: "0.8s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M9 3v10.55A4 4 0 1 0 11 17V7h8v6.55A4 4 0 1 0 21 17V3H9z" />
			</svg>
			<svg className="music-note left-[82%] top-[55%] h-6 w-6" style={{ animationDelay: "2.3s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M9 3v10.55A4 4 0 1 0 11 17V7h8v6.55A4 4 0 1 0 21 17V3H9z" />
			</svg>
			<svg className="music-note left-[93%] top-[70%] h-12 w-12" style={{ animationDelay: "4s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>
			<svg className="music-note left-[75%] top-[60%] h-6 w-6" style={{ animationDelay: "6s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>
			<svg className="music-note left-[88%] top-[70%] h-6 w-6" style={{ animationDelay: "3s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>
			<svg className="music-note left-[68%] top-[75%] h-6 w-6" style={{ animationDelay: "2s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M9 3v10.55A4 4 0 1 0 11 17V7h8v6.55A4 4 0 1 0 21 17V3H9z" />
			</svg><svg className="music-note left-[67%] top-[42%] h-8 w-8" style={{ animationDelay: "0s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>

			{/* Upper middle, above and beside the title */}
			<svg className="music-note left-[27%] top-[17%] h-6 w-6" style={{ animationDelay: "3s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>
			<svg className="music-note left-[68%] top-[14%] h-8 w-8" style={{ animationDelay: "6s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>
			<svg className="music-note left-[35%] top-[80%] h-6 w-6" style={{ animationDelay: "3s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>
			<svg className="music-note left-[78%] top-[20%] h-6 w-6" style={{ animationDelay: "3s" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
			</svg>


			<div className="flex flex-1 flex-col items-center justify-center px-5 pt-24 pb-[24svh] text-center lg:pt-28 lg:pb-[20svh]">
				<motion.div {...rise(0.1)} className="relative mb-4">
					<div
						className="absolute inset-0 -z-10 scale-150 rounded-full bg-vh-purple-700/40 blur-3xl"
						aria-hidden="true"
					/>
				</motion.div>
				<h1
					id="event-title"
					className="font-zen text-[clamp(42px,7.8vw,130px)] leading-none tracking-[-0.03em] text-white"
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
					
				</motion.p>
				<motion.p
					{...rise(1.05)}
					className="type-subheading mt-4 flex flex-wrap justify-center gap-x-3 text-[clamp(13px,1.4vw,18px)] text-vh-text-soft">
					<span className="text-vh-purple-300" aria-hidden="true">
					</span>
					<span className="whitespace-nowrap">
						{EVENT.venue}, {EVENT.city}
					</span>
				</motion.p>
				<motion.div {...rise(0.95)} className="mt-10">
					<EventCountdown />
				</motion.div>
			</div>

			<motion.div
				className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
				initial={reducedMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.8 }}
				aria-hidden="true"
			>
				<span className="type-label text-[15px] text-vh-faint">Scroll</span>
				<span className="scroll-cue block h-8 w-0.5 bg-gradient-to-b from-vh-purple-300 to-transparent" />
			</motion.div>
		</section>
	);
}
