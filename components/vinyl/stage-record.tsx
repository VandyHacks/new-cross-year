"use client";

import {
	motion,
	type MotionValue,
	useAnimationFrame,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import Disc from "@/components/vinyl/disc";
import {
	FOOTER_INDEX,
	SLIDES,
	useStage,
} from "@/components/vinyl/stage";

// Record geometry, in viewport heights: a disc 1.3vh across whose center sits
// off the left edge, so only its right-hand rim shows (the sketch's "wheel").
const DIAMETER = 1.3;
const CENTER_X = -0.3;
const LABEL_RADIUS = 0.36;
// Degrees between neighbouring labels on the ring.
const STEP = 24;
// Degrees the disc turns per slide scrolled.
const SPIN_PER_SLIDE = 150;
// Idle playback speed once it's on the turntable (deg/s).
const PLAY_SPEED = 90;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeInOut = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** 0 while browsing sections, 1 once the record sits on the turntable. */
export function landing(progress: number) {
	return clamp01(progress - (FOOTER_INDEX - 1));
}

/** 0 → 1 as the deck's own disc replaces the flying one at the very end. */
export function handover(landed: number) {
	return clamp01((landed - 0.9) / 0.1);
}

const labelled = SLIDES.flatMap((slide, index) =>
	"label" in slide ? [{ ...slide, index }] : [],
);

function RingLabel({
	label,
	index,
	slideKey,
	smooth,
	radius,
}: {
	label: string;
	index: number;
	slideKey: string;
	smooth: MotionValue<number>;
	radius: number;
}) {
	const distance = useTransform(smooth, (p) => Math.abs(index - p));
	const rotate = useTransform(smooth, (p) => (index - p) * STEP);
	// Current: solid. Neighbours: faded. Further out: gone.
	const opacity = useTransform(distance, [0, 1, 1.8], [1, 0.28, 0]);
	const scale = useTransform(distance, [0, 1], [1, 0.82]);
	// Neighbouring labels are shortcuts to the previous/next slide.
	const pointerEvents = useTransform(distance, (d) =>
		d > 0.5 && d < 1.5 ? "auto" : "none",
	);

	return (
		<motion.div
			className="absolute top-0 left-0 origin-left"
			style={{ rotate, opacity }}
		>
			<motion.a
				href={`#${slideKey}`}
				tabIndex={-1}
				style={{ x: radius, y: "-50%", scale, pointerEvents }}
				className="block origin-left cursor-pointer font-heading text-[clamp(18px,3.1vh,34px)] tracking-[0.18em] whitespace-nowrap text-white uppercase [text-shadow:0_0_24px_rgb(136_83_220/0.7)]"
			>
				{label}
			</motion.a>
		</motion.div>
	);
}

export default function StageRecord() {
	const { smooth, spin } = useStage();
	const reducedMotion = useReducedMotion();
	const { scrollY } = useScroll();
	const [vh, setVh] = useState(0);
	const platter = useRef<Element | null>(null);

	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const scale = useMotionValue(1);
	const scaleY = useMotionValue(1);
	const opacity = useMotionValue(1);
	const ringOpacity = useMotionValue(1);
	const idle = useRef(0);

	useEffect(() => {
		const measure = () => setVh(window.innerHeight);
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, []);

	const place = () => {
		if (!vh) return;
		const p = smooth.get();
		const d0 = DIAMETER * vh;
		const t = easeInOut(landing(p));
		// The platter it lands on, read live so it tracks the footer's scroll.
		if (!platter.current?.isConnected) {
			platter.current = document.querySelector("[data-platter]");
		}
		// The platter lies on the tilted 3D deck, so its on-screen box is wider
		// than tall; squashing the disc to that box approximates the tilt, and
		// the deck's own disc takes over for the last few percent (crossfade).
		const goal = platter.current?.getBoundingClientRect();
		const cx0 = CENTER_X * vh;
		const cy0 = 0.5 * vh + 32;
		const cx1 = goal ? goal.left + goal.width / 2 : cx0;
		const cy1 = goal ? goal.top + goal.height / 2 : cy0;
		x.set(cx0 + (cx1 - cx0) * t - d0 / 2);
		y.set(cy0 + (cy1 - cy0) * t - d0 / 2);
		scale.set(1 + ((goal?.width || d0) / d0 - 1) * t);
		scaleY.set(1 + ((goal ? goal.height / goal.width : 1) - 1) * t);
		opacity.set(1 - handover(landing(p)));
		ringOpacity.set(1 - clamp01(landing(p) * 2.5));
		spin.set(-p * SPIN_PER_SLIDE + idle.current);
	};

	useMotionValueEvent(smooth, "change", place);
	useMotionValueEvent(scrollY, "change", place);
	useEffect(place);

	// Once it's on the platter, the record keeps playing.
	useAnimationFrame((_, delta) => {
		if (reducedMotion || landing(smooth.get()) < 0.98) return;
		idle.current += (PLAY_SPEED * delta) / 1000;
		spin.set(-smooth.get() * SPIN_PER_SLIDE + idle.current);
	});

	if (!vh) return null;
	const d0 = DIAMETER * vh;

	return (
		<div
			className="pointer-events-none fixed inset-0 z-20 hidden lg:block"
			aria-hidden="true"
		>
			<motion.div
				className="absolute top-0 left-0"
				style={{ x, y, scale, scaleY, opacity, width: d0, height: d0 }}
			>
				<Disc spin={spin} className="size-full" />
			</motion.div>
			<motion.div
				className="absolute top-0 left-0"
				style={{
					x: CENTER_X * vh,
					y: 0.5 * vh + 32,
					opacity: ringOpacity,
				}}
			>
				{/* Stylus-style marker pointing at the current label. */}
				<span
					className="absolute top-0 block h-px -translate-y-1/2 bg-gradient-to-r from-transparent to-vh-purple-300 shadow-[0_0_12px_#c8a2ff]"
					style={{ left: (LABEL_RADIUS - 0.04) * vh, width: 0.028 * vh }}
				/>
				{labelled.map((slide) => (
					<RingLabel
						key={slide.key}
						label={slide.label}
						index={slide.index}
						slideKey={slide.key}
						smooth={smooth}
						radius={LABEL_RADIUS * vh}
					/>
				))}
			</motion.div>
		</div>
	);
}
