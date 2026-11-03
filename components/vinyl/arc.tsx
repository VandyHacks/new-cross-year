"use client";

import {
	motion,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
} from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

// Radius of the curve content follows, in viewport heights. Slightly larger
// than the record so content travels concentric with its rim.
const ARC_RADIUS = 0.95;

// How far the slide this element belongs to is from its resting position, in
// px: 0 while the slide owns the screen (a tall slide rests for as long as it
// fills the viewport), positive while it's still below, negative once it's
// leaving above.
function slideOffset(el: HTMLElement, vh: number) {
	const slide = el.closest<HTMLElement>("[data-slide]");
	if (!slide) return 0;
	const { top, bottom } = slide.getBoundingClientRect();
	if (top > 0) return top;
	if (bottom < vh) return bottom - vh;
	return 0;
}

// Scroll-linked travel along an arc concentric with the record. A slide's
// content sweeps in along the curve and fades as it arrives or leaves. At rest,
// `bow` keeps a curve based on the element's own height on screen — the
// sketch's ")" bracket — so every section's headings, rows and blocks hug the
// record's rim (0 lines the element up flush instead).
export default function Arc({
	children,
	className = "",
	bow = 1,
}: {
	children: ReactNode;
	className?: string;
	/** 1 = full resting curve (default), 0 = flush at rest. Desktop only. */
	bow?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();
	const { scrollY } = useScroll();
	const x = useMotionValue(0);
	const opacity = useMotionValue(1);

	const update = () => {
		const el = ref.current;
		if (!el || reducedMotion) return;
		const vh = window.innerHeight;
		const travel = slideOffset(el, vh);
		const rect = el.getBoundingClientRect();
		const own = rect.top + rect.height / 2 - travel - vh / 2;
		const d = travel + own * bow;
		const r = ARC_RADIUS * vh;
		const bend = r - Math.sqrt(Math.max(0, r * r - Math.min(d * d, r * r)));
		// Phones have no record beside the content and no room to bow into.
		x.set(window.innerWidth >= 1024 ? -bend : 0);
		const away = Math.abs(travel) / vh;
		opacity.set(away < 0.3 ? 1 : Math.max(0, 1 - (away - 0.3) / 0.55));
	};

	useMotionValueEvent(scrollY, "change", update);
	useEffect(update);

	return (
		<motion.div ref={ref} className={className} style={{ x, opacity }}>
			{children}
		</motion.div>
	);
}
