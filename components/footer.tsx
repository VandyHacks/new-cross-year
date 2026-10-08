"use client";

import {
	motion,
	useMotionValue,
	useReducedMotion,
	useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

export default function Footer() {
	const revealRef = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();
	const scrollYProgress = useMotionValue(0);

	useEffect(() => {
		const target = revealRef.current;
		if (!target) return;
		let frame = 0;
		const measure = () => {
			frame = 0;
			const { top, height } = target.getBoundingClientRect();
			scrollYProgress.set(
				height > 0
					? Math.max(
							0,
							Math.min(1, (window.innerHeight - top) / height),
						)
					: 0,
			);
		};
		const scheduleMeasure = () => {
			if (!frame) frame = requestAnimationFrame(measure);
		};
		// Use viewport geometry so the intro's scroll lock cannot change the source.
		measure();
		window.addEventListener("scroll", scheduleMeasure, { passive: true });
		window.addEventListener("resize", scheduleMeasure);
		window.addEventListener("pageshow", scheduleMeasure);
		const resize = new ResizeObserver(scheduleMeasure);
		resize.observe(target);
		if (target.parentElement) resize.observe(target.parentElement);

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", scheduleMeasure);
			window.removeEventListener("resize", scheduleMeasure);
			window.removeEventListener("pageshow", scheduleMeasure);
			resize.disconnect();
		};
	}, [scrollYProgress]);
	const clipPath = useTransform(
		scrollYProgress,
		[0, 1],
		["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
	);
	const wordmarkY = useTransform(scrollYProgress, [0, 1], [32, 0]);

	return (
		<div
			ref={revealRef}
			id="footer"
			className="relative h-[var(--footer-height)] [--footer-height:min(100svh,clamp(180px,calc(14.5vw+80px),420px))]"
		>
			<motion.footer
				data-footer-reveal
				className="fixed inset-x-0 bottom-0 z-10 flex h-[var(--footer-height)] items-center overflow-hidden bg-black px-[clamp(20px,3vw,64px)]"
				style={{ clipPath }}
			>
				<motion.div
					className="w-full"
					style={{ y: reducedMotion ? 0 : wordmarkY }}
				>
					<svg
						viewBox="0 0 1000 145"
						className="block w-full overflow-visible text-[#f1f0f3]/10"
						role="img"
						aria-label="VandyHacks"
					>
						<text
							x="0"
							y="120"
							fill="currentColor"
							fontSize="120"
							textLength="1000"
							lengthAdjust="spacingAndGlyphs"
							className="font-heading [text-shadow:none]"
						>
							VANDYHACKS
						</text>
					</svg>
				</motion.div>
			</motion.footer>
		</div>
	);
}
