import { motion, type MotionValue } from "motion/react";
import { type RefObject, useEffect, useId, useRef, useState } from "react";
import { EVENT } from "@/lib/event";

// Groove band in viewBox units (label edge → outer ring text).
const GROOVE_INNER = 204;
const GROOVE_OUTER = 476;
// On-screen gap between grooves (CSS px). Much tighter and the rings alias
// into moiré bands once the disc is scaled/tilted.
const GROOVE_GAP_PX = 2.5;

function grooveRadii(count: number) {
	const step = (GROOVE_OUTER - GROOVE_INNER) / Math.max(count - 1, 1);
	return Array.from({ length: count }, (_, i) => GROOVE_INNER + i * step);
}

// Picks a groove count from the disc's rendered size (after transforms), so
// a big hero disc gets many fine grooves and the small tilted deck disc fewer.
function useGrooveCount(ref: RefObject<HTMLDivElement | null>) {
	const [count, setCount] = useState(28);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const measure = () => {
			const { width, height } = el.getBoundingClientRect();
			const px = Math.min(width, height);
			if (px === 0) return;
			const bandPx = (px * (GROOVE_OUTER - GROOVE_INNER)) / 1000;
			// Snap to steps of 6 so a scroll-driven resize doesn't re-render every frame.
			const raw = Math.floor(bandPx / GROOVE_GAP_PX / 6) * 6;
			const next = Math.min(90, Math.max(12, raw));
			setCount((c) => (c === next ? c : next));
		};
		// The disc is scaled by scroll-driven transforms, which no observer
		// reports, so re-measure on scroll too (once per frame at most).
		let frame = 0;
		let settle = 0;
		const schedule = () => {
			// Trailing check catches eased/spring motion that ends after the scroll.
			clearTimeout(settle);
			settle = window.setTimeout(measure, 400);
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				measure();
			});
		};
		measure();
		const ro = new ResizeObserver(schedule);
		ro.observe(el);
		window.addEventListener("resize", schedule);
		window.addEventListener("scroll", schedule, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(settle);
			ro.disconnect();
			window.removeEventListener("resize", schedule);
			window.removeEventListener("scroll", schedule);
		};
	}, [ref]);
	return count;
}

const RING_TEXT = `VANDYHACKS ${EVENT.edition} · NASHVILLE, TN · ${EVENT.dateLabel.toUpperCase()} · `;
// Edge text wraps the whole rim. Chrome ignores `textLength` on <textPath>,
// so the letter spacing is worked out instead: Space Mono is monospaced
// (advance ≈ 0.61em), so the natural length is predictable.
const RING_RADIUS = 452;
const RING_FONT = 15;
const RING_REPEATS = 5;
const RING_FULL = RING_TEXT.repeat(RING_REPEATS);
const RING_SPACING =
	(2 * Math.PI * RING_RADIUS - RING_FULL.length * RING_FONT * 0.61) / RING_FULL.length;

// Vinyl record that fills its container and turns with `spin` (degrees).
export default function Disc({
	spin,
	className = "",
}: {
	spin: MotionValue<number> | number;
	className?: string;
}) {
	const id = useId().replace(/:/g, "");
	const ref = useRef<HTMLDivElement>(null);
	const grooves = grooveRadii(useGrooveCount(ref));
	return (
		<div ref={ref} className={`vinyl-disc ${className}`} aria-hidden="true">
			<motion.div className="absolute inset-0" style={{ rotate: spin }}>
				<div className="vinyl-texture" />
				<svg viewBox="0 0 1000 1000" className="absolute inset-0 size-full">
					<defs>
						<path
							id={`${id}-outer`}
							d="M500,500 m-452,0 a452,452 0 1,1 904,0 a452,452 0 1,1 -904,0"
						/>
					</defs>
					{/* Fine grooves as SVG rings, counted from the rendered size so they
					    never alias into moiré bands (a CSS repeating gradient did). */}
					{grooves.map((r, i) => (
						<circle
							key={`g${i}`}
							cx="500"
							cy="500"
							r={r}
							fill="none"
							stroke="rgb(200 162 255 / 0.08)"
							strokeWidth="2"
						/>
					))}
					{[488, 430, 372, 318, 262].map((r) => (
						<circle
							key={r}
							cx="500"
							cy="500"
							r={r}
							fill="none"
							stroke="rgb(255 255 255 / 0.07)"
							strokeWidth={r === 488 ? 3 : 1.5}
						/>
					))}
					<text
						fill="rgb(200 162 255 / 0.22)"
						fontSize={RING_FONT}
						letterSpacing={RING_SPACING}
						fontFamily="var(--font-space-mono)"
					>
						<textPath href={`#${id}-outer`}>{RING_FULL}</textPath>
					</text>
					{/* Label: logo and wordmark printed in lavender ink so they read as
					    part of the paper label, not a sticker on top of it. */}
					<radialGradient id={`${id}-label`}>
						<stop offset="0%" stopColor="#a77ae9" />
						<stop offset="70%" stopColor="#7138c7" />
						<stop offset="100%" stopColor="#3b1d73" />
					</radialGradient>
					<filter id={`${id}-ink`} colorInterpolationFilters="sRGB">
						<feFlood floodColor="#f1e7ff" />
						<feComposite in2="SourceAlpha" operator="in" />
					</filter>
					<path
						id={`${id}-label-arc`}
						d="M360,500 A140,140 0 0,0 640,500"
						fill="none"
					/>
					<circle cx="500" cy="500" r="190" fill={`url(#${id}-label)`} />
					{/* Dark lip where the label meets the vinyl, plus a printed rim. */}
					<circle cx="500" cy="500" r="189" fill="none" stroke="rgb(5 6 15 / 0.45)" strokeWidth="3" />
					<circle cx="500" cy="500" r="181" fill="none" stroke="rgb(241 231 255 / 0.22)" strokeWidth="1.5" />
					<image
						href="/logo-trimmed.png"
						x="446"
						y="360"
						width="108"
						height="96"
						preserveAspectRatio="xMidYMid meet"
						filter={`url(#${id}-ink)`}
						opacity="0.88"
					/>
					<text
						fill="rgb(241 231 255 / 0.82)"
						fontSize="40"
						letterSpacing="2"
						fontFamily="var(--font-michroma)"
						textAnchor="middle"
					>
						<textPath href={`#${id}-label-arc`} startOffset="50%">
							VANDYHACKS
						</textPath>
					</text>
					{/* Spindle hole. */}
					<circle cx="500" cy="500" r="14" fill="#05060f" stroke="rgb(241 231 255 / 0.25)" strokeWidth="1.5" />
				</svg>
			</motion.div>
			<div className="vinyl-sheen" />
		</div>
	);
}
