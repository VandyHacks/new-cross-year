import { motion, type MotionValue } from "motion/react";
import Image from "next/image";
import { useId } from "react";
import { EVENT } from "@/lib/event";

const RING_TEXT = `VANDYHACKS ${EVENT.edition} · NASHVILLE, TN · ${EVENT.dateLabel.toUpperCase()} · SIDE A · `;

// A vinyl record that fills its container. Grooves and the light sheen stay
// still; the printed ring text, label, and texture turn with `spin` (degrees),
// which is what makes the rotation readable on a mostly-symmetric disc.
export default function Disc({
	spin,
	className = "",
}: {
	spin: MotionValue<number> | number;
	className?: string;
}) {
	// Unique ids so two discs on one page don't share <defs>.
	const id = useId().replace(/:/g, "");
	return (
		<div className={`vinyl-disc ${className}`} aria-hidden="true">
			<motion.div className="absolute inset-0" style={{ rotate: spin }}>
				<div className="vinyl-texture" />
				<svg viewBox="0 0 1000 1000" className="absolute inset-0 size-full">
					<defs>
						<path
							id={`${id}-outer`}
							d="M500,500 m-452,0 a452,452 0 1,1 904,0 a452,452 0 1,1 -904,0"
						/>
						<path
							id={`${id}-inner`}
							d="M500,500 m-205,0 a205,205 0 1,1 410,0 a205,205 0 1,1 -410,0"
						/>
					</defs>
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
						fontSize="15"
						letterSpacing="5"
						fontFamily="var(--font-space-mono)"
					>
						<textPath href={`#${id}-outer`}>
							{RING_TEXT.repeat(4)}
						</textPath>
					</text>
					<circle cx="500" cy="500" r="190" fill={`url(#${id}-label)`} />
					<radialGradient id={`${id}-label`}>
						<stop offset="0%" stopColor="#a77ae9" />
						<stop offset="70%" stopColor="#7138c7" />
						<stop offset="100%" stopColor="#3b1d73" />
					</radialGradient>
					<text
						fill="rgb(255 255 255 / 0.75)"
						fontSize="17"
						letterSpacing="4"
						fontFamily="var(--font-michroma)"
					>
						<textPath href={`#${id}-inner`} startOffset="2%">
							{`VANDYHACKS · ${EVENT.edition} · CODE · COLLABORATE · CREATE · 33⅓ RPM`}
						</textPath>
					</text>
					<circle cx="500" cy="500" r="14" fill="#05060f" />
				</svg>
				<Image
					src="/logo.png"
					alt=""
					width={400}
					height={400}
					className="absolute top-1/2 left-1/2 w-[26%] -translate-x-1/2 -translate-y-[58%] opacity-90"
				/>
			</motion.div>
			<div className="vinyl-sheen" />
		</div>
	);
}
