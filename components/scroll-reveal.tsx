"use client";

import {
	easeInOut,
	motion,
	type MotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";
import { useRef } from "react";

type ScrollRevealProps = {
	children: string;
	className?: string;
	baseOpacity?: number;
};

// Longer, overlapping fades keep the word sequence gradual.
const WORD_DURATION = 1.2;
const WORD_STAGGER = 0.05;

function RevealWord({
	children,
	progress,
	index,
	wordCount,
	baseOpacity,
	reducedMotion,
}: {
	children: string;
	progress: MotionValue<number>;
	index: number;
	wordCount: number;
	baseOpacity: number;
	reducedMotion: boolean;
}) {
	const totalDuration = WORD_DURATION + WORD_STAGGER * (wordCount - 1);
	const start = (index * WORD_STAGGER) / totalDuration;
	const end = (index * WORD_STAGGER + WORD_DURATION) / totalDuration;
	const opacity = useTransform(progress, [start, end], [baseOpacity, 1], {
		ease: easeInOut,
	});

	return (
		<motion.span
			data-scroll-reveal-word
			className="inline-block"
			style={{ opacity: reducedMotion ? 1 : opacity }}
		>
			{children}
		</motion.span>
	);
}

export default function ScrollReveal({
	children,
	className,
	baseOpacity = 0.1,
}: ScrollRevealProps) {
	const textRef = useRef<HTMLParagraphElement>(null);
	const reducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: textRef,
		offset: ["start 0.9", "end 0.7"],
	});
	const progress = useSpring(scrollYProgress, {
		stiffness: 55,
		damping: 24,
		mass: 1,
		restDelta: 0.001,
		restSpeed: 0.001,
	});
	const tokens = children.split(/(\s+)/);
	const wordCount = tokens.filter((token) => token.trim()).length;
	let wordIndex = 0;

	return (
		<p ref={textRef} className={className}>
			<span className="sr-only">{children}</span>
			<span aria-hidden="true">
				{tokens.map((token, index) =>
					token.trim() ? (
						<RevealWord
							key={index}
							progress={progress}
							index={wordIndex++}
							wordCount={wordCount}
							baseOpacity={baseOpacity}
							reducedMotion={!!reducedMotion}
						>
							{token}
						</RevealWord>
					) : (
						token
					),
				)}
			</span>
		</p>
	);
}
