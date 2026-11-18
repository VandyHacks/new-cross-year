"use client";

import { motion, useReducedMotion } from "motion/react";
import EventCountdown from "@/components/event-countdown";
import Skyline from "@/components/vinyl/skyline";
import { CTA, EVENT } from "@/lib/event";
import ScrollNotes from "@/components/vinyl/scroll-notes";

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


			<div className="flex flex-1 flex-col items-center justify-center px-5 pt-24 pb-[24svh] text-center lg:pt-24 lg:pb-[20svh]">
				<motion.div {...rise(0.1)} className="relative mb-4">
					<div
						className="absolute inset-0 -z-10 scale-150 rounded-full bg-vh-purple-700/40 blur-3xl"
						aria-hidden="true"
					/>
				</motion.div>
				{/* Title + tagline share a width-fit column so the tagline's right
				    edge lines up with the wordmark's right edge (under "Hacks"). */}
				<div className="flex w-fit max-w-full flex-col">
					<h1
						id="event-title"
						className="font-zen text-[clamp(42px,8vw,130px)] leading-none tracking-[-0.03em] text-white"
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
						{...rise(0.35)}
						className="mt-2.5 w-full text-right font-mono text-[clamp(11px,1.45vw,17px)] tracking-[0.02em] text-vh-text-soft"
					>
						{"South's Largest Collegiate Hackathon"}
					</motion.p>
				</div>
				<motion.div {...rise(0.95)} className="mt-10">
					<EventCountdown />
				</motion.div>
			</div>

			<motion.a
				href="#about"
				aria-label="Scroll to the About section"
				className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-md px-3 py-1 text-vh-faint transition-colors hover:text-vh-purple-300 focus-visible:text-vh-purple-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-purple-300"
				initial={reducedMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.8 }}
			>
				<span className="type-label text-[13px]">Scroll</span>
				<svg
					className="scroll-arrow h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</motion.a>
		</section>
	);
}
