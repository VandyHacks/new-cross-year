"use client";

import {
	animate,
	motion,
	useInView,
	useMotionValue,
	useReducedMotion,
} from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { missionText } from "@/components/about";
import Counter from "@/components/counter";
import { metrics } from "@/components/stats";
import Arc from "@/components/vinyl/arc";

// Shared frame for a content slide: clears the header, leaves the record's
// gutter on desktop, and anchors the heading at the same height on every
// slide so the eye doesn't hunt for it as slides change.
export function SlideBody({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={`slide-gutter slide-frame flex min-h-svh flex-col px-5 pt-24 pb-16 sm:px-8 ${className}`}>
			<div className="mx-auto w-full max-w-5xl">{children}</div>
		</div>
	);
}

export function SlideHeading({ id, children }: { id: string; children: ReactNode }) {
	const reducedMotion = useReducedMotion();
	return (
		<Arc className="mb-[clamp(24px,4.5svh,48px)]">
			<motion.h2
				id={id}
				className="font-heading text-[clamp(30px,4.4vw,64px)] leading-[1.05] tracking-[0.12em] text-white uppercase"
				initial={reducedMotion ? false : { opacity: 0, x: -48, filter: "blur(10px)" }}
				whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
				viewport={{ once: true, amount: 0.6 }}
				transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
			>
				{children}
			</motion.h2>
		</Arc>
	);
}

// --- About ----------------------------------------------------------------

const [statement, ...rest] = missionText.split(/(?<=\.)\s+/);
const closing = rest.pop() ?? "";

// Word-by-word reveal for the lead statement.
function RevealStatement({ text }: { text: string }) {
	const reducedMotion = useReducedMotion();
	const words = text.split(" ");
	return (
		<motion.p
			className="max-w-[24ch] font-heading text-[clamp(24px,2.7vw,42px)] leading-[1.25] tracking-[-0.01em] text-balance text-white"
			initial="hidden"
			whileInView="shown"
			viewport={{ once: true, amount: 0.5 }}
			transition={{ staggerChildren: 0.04, delayChildren: 0.15 }}
		>
			{words.map((word, i) => (
				<motion.span
					key={i}
					className="inline-block whitespace-pre"
					variants={reducedMotion ? undefined : { hidden: { opacity: 0.1, y: 8 }, shown: { opacity: 1, y: 0 } }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					{word}
					{i < words.length - 1 ? " " : ""}
				</motion.span>
			))}
		</motion.p>
	);
}

function FadeUp({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
	const reducedMotion = useReducedMotion();
	return (
		<motion.div
			className={className}
			initial={reducedMotion ? false : { opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.div>
	);
}

// One large statement, two columns of supporting copy, then the invitation —
// instead of four equal paragraphs of display type.
export function AboutSlide() {
	return (
		<section id="about" aria-labelledby="about-title">
			<SlideBody>
				<SlideHeading id="about-title">About</SlideHeading>
				<Arc>
					<RevealStatement text={statement} />
				</Arc>
				<Arc className="mt-[clamp(24px,5svh,56px)]">
					<div className="grid gap-x-[clamp(24px,4vw,64px)] gap-y-5 md:grid-cols-2">
						{rest.map((sentence, i) => (
							<FadeUp key={i} delay={0.5 + i * 0.12}>
								<p className="type-body text-[clamp(14px,1.1vw,17px)] leading-[1.75] text-pretty text-vh-text-soft">
									{sentence}
								</p>
							</FadeUp>
						))}
					</div>
				</Arc>
				<Arc className="mt-[clamp(24px,5svh,56px)]">
					<FadeUp delay={0.8}>
						<p className="max-w-3xl border-l-2 border-vh-purple-300 pl-5 type-body text-[clamp(14px,1.15vw,18px)] leading-[1.7] text-pretty text-white">
							{closing}
						</p>
					</FadeUp>
				</Arc>
			</SlideBody>
		</section>
	);
}

// --- Impact ---------------------------------------------------------------

function Metric({ metric, index }: { metric: (typeof metrics)[number]; index: number }) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, amount: 0.6 });
	const reducedMotion = useReducedMotion();
	const value = useMotionValue(reducedMotion ? metric.value : 0);

	useEffect(() => {
		if (!inView || reducedMotion) return;
		const controls = animate(value, metric.value, {
			duration: 1.6,
			delay: 0.15 + index * 0.12,
			ease: [0.16, 1, 0.3, 1],
		});
		return () => controls.stop();
	}, [inView, reducedMotion, value, metric.value, index]);

	return (
		<Arc>
			<motion.div
				ref={ref}
				className="group flex items-baseline gap-[clamp(14px,2vw,32px)] border-b border-white/8 py-[clamp(8px,1.6svh,18px)]"
				initial={reducedMotion ? false : { opacity: 0, x: -60 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true, amount: 0.6 }}
				transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
			>
				<p className="m-0 w-[5.6em] shrink-0 font-heading text-[clamp(30px,5.4svh,64px)] leading-none tracking-[-0.04em] text-vh-purple-300 tabular-nums transition-colors group-hover:text-white">
					<span className="sr-only">
						{metric.prefix}
						{metric.value.toLocaleString("en-US")}
						{metric.suffix}
					</span>
					<span aria-hidden="true" className="inline-flex">
						{metric.prefix}
						<Counter value={value} max={metric.value} />
						{metric.suffix}
					</span>
				</p>
				<p className="type-body-sm text-[clamp(12px,1.2vw,17px)] text-vh-text-soft">
					{metric.label}
				</p>
			</motion.div>
		</Arc>
	);
}

export function ImpactSlide() {
	return (
		<section id="impact" aria-labelledby="impact-title">
			<SlideBody>
				<SlideHeading id="impact-title">
					Impact
				</SlideHeading>
				<div className="flex flex-col">
					{metrics.map((metric, i) => (
						<Metric key={metric.label} metric={metric} index={i} />
					))}
				</div>
			</SlideBody>
		</section>
	);
}
