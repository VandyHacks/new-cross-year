"use client";

import { motion, useTransform } from "motion/react";
import { useStage } from "@/components/vinyl/stage";

// Stylised silhouettes, viewBox 1600×360. Back row: downtown Nashville
// (the AT&T "Batman" building, Pinnacle, Fifth Third, City Center). Front row:
// Vanderbilt's campus, plus trees.
type Building = {
	x: number;
	w: number;
	top: number;
	/** Extra roof outline drawn on top of the body (absolute points). */
	roof?: string;
	windows?: number;
};

const NASHVILLE: Building[] = [
	// Left filler, so the 80-unit shift leaves no empty edge.
	{ x: -20, w: 110, top: 270 },
	{ x: 88, w: 90, top: 255 },
	{ x: 176, w: 80, top: 272 },
	{ x: 254, w: 96, top: 245 },
	// Tennessee State Capitol: small tower, cupola and spire.
	{
		x: 348,
		w: 130,
		top: 238,
		roof: "348,238 348,228 398,228 398,206 404,206 404,190 408,190 408,174 413,158 418,174 418,190 422,190 422,206 428,206 428,228 478,228 478,238",
	},
	{ x: 476, w: 74, top: 235 },
	// Music City Center: low building with a wavy roof.
	{
		x: 548,
		w: 150,
		top: 262,
		roof: "548,262 563,252 593,262 623,252 653,262 683,252 698,262",
	},
	{ x: 696, w: 70, top: 268 },
	{ x: 764, w: 60, top: 250 },
	{ x: 822, w: 50, top: 215 },
	{ x: 870, w: 70, top: 235 },
	{ x: 938, w: 52, top: 190, roof: "938,190 948,178 980,178 990,190" },
	{ x: 988, w: 56, top: 215 },
	{ x: 1042, w: 58, top: 235 },
	// Pinnacle at Symphony Place: stepped crown with a center spire.
	{
		x: 1098,
		w: 72,
		top: 118,
		roof: "1098,118 1110,118 1110,104 1126,104 1134,62 1142,104 1158,104 1158,118 1170,118",
	},
	{ x: 1168, w: 60, top: 190 },
	{ x: 1226, w: 74, top: 140, roof: "1226,140 1263,102 1300,140" },
	{ x: 1406, w: 56, top: 150, roof: "1406,150 1434,124 1462,150" },
	{ x: 1460, w: 64, top: 200 },
	{ x: 1522, w: 40, top: 170, roof: "1542,170 1545,124 1548,170" },
	{ x: 1560, w: 80, top: 230 },
	// AT&T Building ("Batman building"). Last so it draws in front.
	{
		x: 1298,
		w: 110,
		top: 100,
		roof: "1298,100 1308,92 1314,10 1320,92 1334,86 1353,66 1372,86 1386,92 1392,10 1398,92 1408,100",
	},
];

const CAMPUS: Building[] = [
	// Left edge, new
	{ x: 20, w: 110, top: 290, windows: 0.6 },
	{ x: 150, w: 130, top: 276, roof: "150,276 215,258 280,276", windows: 0.55 },

	// Existing buildings, raised 24 units
	{ x: 300, w: 150, top: 292, roof: "300,292 375,270 450,292", windows: 0.5 },
	{ x: 455, w: 60, top: 296, windows: 0.7 },
	{ x: 520, w: 220, top: 268, roof: "520,268 540,252 720,252 740,268", windows: 0.6 },

	// Middle, new
	{ x: 750, w: 110, top: 282, roof: "750,282 805,266 860,282", windows: 0.6 },

	// Existing, raised
	{ x: 880, w: 150, top: 274, windows: 0.75 },
	{ x: 1035, w: 90, top: 288, windows: 0.6 },

	// Right side, new
	{ x: 1135, w: 90, top: 280, windows: 0.65 },
	{ x: 1230, w: 60, top: 296, windows: 0.7 },

	// The Parthenon, raised
	{
		x: 1300,
		w: 130,
		top: 284,
		roof: "1300,284 1365,264 1430,284",
		windows: 0.5,
	},

	// Far right, new
	{ x: 1450, w: 70, top: 290, roof: "1450,290 1485,272 1520,290", windows: 0.55 },
	{ x: 1530, w: 70, top: 300, windows: 0.6 },

	// West End tower and shoulders, last so they draw in front
	{
		x: 375,
		w: 44,
		top: 56,
		roof: "375,56 375,40 378,28 381,40 386,44 386,34 391,34 391,44 403,44 403,34 408,34 408,44 413,40 416,28 419,40 419,56",
		windows: 0.7,
	},
	{
		x: 367,
		w: 60,
		top: 150,
		roof: "367,150 367,138 375,138 375,150 419,150 419,138 427,138 427,150",
		windows: 0.5,
	},
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

// Raises a building by `lift` units (body and roof together).
function lifted(b: Building, lift: number): Building {
	return {
		...b,
		top: b.top - lift,
		roof: b.roof
			?.split(" ")
			.map((p) => {
				const [x, y] = p.split(",");
				return `${x},${Number(y) - lift}`;
			})
			.join(" "),
	};
}

function Layer({
	buildings,
	base,
	fill,
	lit,
	seed,
	lift = 0,
}: {
	buildings: Building[];
	base: number;
	fill: string;
	lit: number;
	seed: number;
	lift?: number;
}) {
	const items = buildings.map((b) => lifted(b, lift));
	return (
		<g>
			{items.map((b, i) => (
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
			viewBox="0 -140 1600 500"
			preserveAspectRatio="xMidYMax slice"
			className={className}
			style={{ opacity }}
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="skyline-back" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#3b2b6e" />
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
					lift={60}
				/>
			</motion.g>
			<motion.g style={{ y: frontY }}>
				<Layer
					buildings={CAMPUS}
					base={360}
					fill="#0a1029"
					lit={0.5}
					seed={41}
					lift={35}
				/>
				{TREES.map(([cx, cy, r]) => (
					<circle key={cx} cx={cx} cy={cy} r={r} fill="#070b1f" />
				))}
			</motion.g>
			<rect y="-140" width="1600" height="500" fill="url(#skyline-fade)" />
		</motion.svg>
	);
}
