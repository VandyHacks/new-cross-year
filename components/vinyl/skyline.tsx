"use client";

import { motion, useTransform } from "motion/react";
import { useStage } from "@/components/vinyl/stage";

// Stylised silhouettes, viewBox 1600×360. Back row: downtown Nashville
// (the AT&T "Batman" building, Pinnacle, Fifth Third, City Center). Front row:
// Vanderbilt's campus, led by Kirkland Hall's clock tower, plus trees.
type Building = {
	x: number;
	w: number;
	top: number;
	/** Extra roof outline drawn on top of the body (absolute points). */
	roof?: string;
	windows?: number;
};

const NASHVILLE: Building[] = [
	{ x: 0, w: 120, top: 280 },
	{ x: 125, w: 60, top: 250 },
	{ x: 190, w: 90, top: 270 },
	{ x: 285, w: 50, top: 235 },
	{ x: 340, w: 110, top: 262 },
	{ x: 455, w: 70, top: 240 },
	{ x: 530, w: 100, top: 268 },
	{ x: 640, w: 60, top: 250 },
	{ x: 705, w: 45, top: 215 },
	{ x: 755, w: 70, top: 235 },
	{ x: 830, w: 52, top: 150, roof: "830,150 840,138 872,138 882,150" },
	{
		x: 890,
		w: 72,
		top: 118,
		roof: "890,118 902,118 902,104 918,104 926,62 934,104 950,104 950,118 962,118",
	},
	{ x: 968, w: 48, top: 190 },
	// AT&T Building — the "Batman" ears.
	{
		x: 1022,
		w: 96,
		top: 110,
		roof: "1022,110 1032,104 1036,18 1040,104 1052,98 1070,80 1088,98 1100,104 1104,18 1108,104 1118,110",
	},
	{ x: 1126, w: 62, top: 140, roof: "1126,140 1157,102 1188,140" },
	{ x: 1196, w: 56, top: 150, roof: "1196,150 1224,124 1252,150" },
	{ x: 1258, w: 64, top: 200 },
	{ x: 1326, w: 40, top: 170, roof: "1343,170 1346,124 1349,170" },
	{ x: 1372, w: 80, top: 230 },
	{ x: 1456, w: 50, top: 205 },
	{ x: 1510, w: 90, top: 255 },
];

const CAMPUS: Building[] = [
	{ x: 380, w: 150, top: 316, roof: "380,316 455,294 530,316", windows: 0.5 },
	{ x: 600, w: 220, top: 292, roof: "600,292 620,276 800,276 820,292", windows: 0.6 },
	// Kirkland Hall tower: corner pinnacles and a central spire.
	{
		x: 690,
		w: 40,
		top: 204,
		roof: "690,204 690,190 693,178 696,190 696,196 710,130 724,196 724,190 727,178 730,190 730,204",
		windows: 0,
	},
	{ x: 960, w: 150, top: 298, windows: 0.75 },
	{ x: 1115, w: 90, top: 312, windows: 0.6 },
	{ x: 1220, w: 120, top: 318, roof: "1220,318 1280,296 1340,318", windows: 0.5 },
];

const TREES = [
	[330, 344, 26], [360, 350, 20], [548, 346, 24], [574, 352, 18],
	[842, 344, 28], [880, 350, 22], [915, 346, 26], [1360, 346, 26],
	[1392, 352, 20], [1430, 348, 24], [1470, 352, 18], [250, 352, 18],
] as const;

// Deterministic so server and client render the same windows.
function random(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function windowsFor(b: Building, base: number, lit: number, seed: number) {
	const rand = random(seed);
	const out: { x: number; y: number; twinkle: boolean }[] = [];
	for (let y = b.top + 10; y < base - 10; y += 12) {
		for (let x = b.x + 6; x < b.x + b.w - 6; x += 10) {
			if (rand() < lit) out.push({ x, y, twinkle: rand() < 0.08 });
		}
	}
	return out;
}

function Layer({
	buildings,
	base,
	fill,
	lit,
	seed,
}: {
	buildings: Building[];
	base: number;
	fill: string;
	lit: number;
	seed: number;
}) {
	return (
		<g>
			{buildings.map((b, i) => (
				<g key={i} fill={fill}>
					<rect x={b.x} y={b.top} width={b.w} height={base - b.top} />
					{b.roof && <polygon points={b.roof} />}
					{windowsFor(b, base, b.windows ?? lit, seed + i).map((w, j) => (
						<rect
							key={j}
							x={w.x}
							y={w.y}
							width="4"
							height="5"
							className={w.twinkle ? "skyline-twinkle" : undefined}
							fill="rgb(234 220 255 / 0.55)"
							style={{ animationDelay: `${(j % 7) * 0.9}s` }}
						/>
					))}
				</g>
			))}
		</g>
	);
}

export default function Skyline({ className = "" }: { className?: string }) {
	const { smooth } = useStage();
	// Parallax: the far skyline drifts less than the campus as you leave Home.
	const backY = useTransform(smooth, [0, 1], [0, 40]);
	const frontY = useTransform(smooth, [0, 1], [0, 110]);
	const opacity = useTransform(smooth, [0, 0.9], [1, 0]);

	return (
		<motion.svg
			viewBox="0 0 1600 360"
			preserveAspectRatio="xMidYMax slice"
			className={className}
			style={{ opacity }}
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="skyline-back" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#232c63" />
					<stop offset="100%" stopColor="#0d142c" />
				</linearGradient>
				<linearGradient id="skyline-fade" x1="0" y1="0" x2="0" y2="1">
					<stop offset="60%" stopColor="#080d20" stopOpacity="0" />
					<stop offset="100%" stopColor="#080d20" />
				</linearGradient>
			</defs>
			<motion.g style={{ y: backY }} opacity="0.85">
				<Layer
					buildings={NASHVILLE}
					base={360}
					fill="url(#skyline-back)"
					lit={0.16}
					seed={7}
				/>
			</motion.g>
			<motion.g style={{ y: frontY }}>
				<Layer
					buildings={CAMPUS}
					base={360}
					fill="#0a1029"
					lit={0.5}
					seed={41}
				/>
				{/* Kirkland Hall clock face. */}
				<circle cx="710" cy="226" r="9" fill="#c8a2ff" opacity="0.85" />
				<circle cx="710" cy="226" r="18" fill="#c8a2ff" opacity="0.15" />
				{TREES.map(([cx, cy, r]) => (
					<circle key={cx} cx={cx} cy={cy} r={r} fill="#070b1f" />
				))}
			</motion.g>
			<rect width="1600" height="360" fill="url(#skyline-fade)" />
		</motion.svg>
	);
}
