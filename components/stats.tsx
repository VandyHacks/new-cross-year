"use client";

import {
	motion,
	type MotionValue,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import Counter from "@/components/counter";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";

const columnsClassName =
	"grid grid-cols-2 items-center gap-[clamp(24px,6vw,96px)] max-[767px]:gap-5";
const headingClassName = "[&_h2]:m-0 [&_h2]:text-left";
const valueClassName =
	"flex items-center justify-center font-heading text-[clamp(40px,6.5vw,96px)] leading-[1.2] tracking-[-0.04em] text-vh-purple-300 max-[767px]:text-[clamp(20px,5vw,38px)]";
const labelClassName =
	"mx-auto mt-4 max-w-[28ch] text-center text-[clamp(12px,1.2vw,18px)] leading-[1.6] text-vh-text max-[767px]:mt-3 max-[767px]:text-[10px]";

// Totals across all 13 past events (I–XII + Summer Edition 2020), from each
// event's Devpost page: 2,273 registrants, 723 projects, $125,829 in listed
// prizes. Sponsor count is the Past Sponsors list. See
// docs/client-feedback-plan.md for the per-edition breakdown.
const metrics = [
	{ value: 12, suffix: "", label: "Hackathons hosted since 2015" },
	{ value: 2000, suffix: "+", label: "Hackers from around the world" },
	{ value: 720, suffix: "+", label: "Projects built" },
	{ value: 125, prefix: "$", suffix: "K+", label: "In prizes awarded" },
	{ value: 50, suffix: "+", label: "Sponsoring companies" },
];

type Metric = (typeof metrics)[number];

function formattedValue(metric: Metric) {
	return `${metric.prefix ?? ""}${metric.value.toLocaleString("en-US")}${metric.suffix}`;
}

// Share of the sticky runway used by the one-at-a-time counters; the rest is
// the summary of all five metrics, held on screen before the page moves on.
const COUNT_SHARE = 0.6;

function SummaryList({ className = "" }: { className?: string }) {
	return (
		<dl
			className={`m-0 flex min-w-0 flex-col gap-[clamp(12px,2.4vw,32px)] ${className}`}
		>
			{metrics.map((metric) => (
				<div key={metric.label} className="min-w-0">
					<dd className="m-0 font-heading text-[clamp(28px,4.2vw,60px)] leading-[1.15] tracking-[-0.04em] text-vh-purple-300">
						{formattedValue(metric)}
					</dd>
					<dt className="text-[clamp(11px,1.2vw,18px)] leading-[1.5] text-vh-text">
						{metric.label}
					</dt>
				</div>
			))}
		</dl>
	);
}

function Stat({
	metric,
	index,
	progress,
}: {
	metric: Metric;
	index: number;
	progress: MotionValue<number>;
}) {
	const phase = useTransform(progress, (latest) => {
		const current =
			Math.min(latest / COUNT_SHARE, 1) * metrics.length - index;
		if (current <= 0.7) return current;

		const endProgress = Math.min((current - 0.7) / 0.3, 1);
		return 0.7 + 0.3 * (1 - (1 - endProgress) ** 1.5);
	});
	// Enter, count in the center, hold the final value, then scroll out.
	const opacity = useTransform(phase, [-0.12, 0, 0.84, 1], [0, 1, 1, 0]);
	const y = useTransform(phase, [-0.12, 0, 0.84, 1], [72, 0, 0, -72]);
	const value = useTransform(phase, [0.06, 0.62], [0, metric.value]);

	return (
		<motion.div
			className="col-start-1 row-start-1 min-w-0 self-center"
			aria-hidden="true"
			style={{
				opacity,
				y,
			}}
		>
			<p className={valueClassName}>
				{metric.prefix}
				<Counter value={value} max={metric.value} />
				{metric.suffix}
			</p>
			<p className={labelClassName}>{metric.label}</p>
		</motion.div>
	);
}

// Progress at which the summary is fully shown; once the user rests past this
// point the long runway is no longer needed.
const HOLD_START = COUNT_SHARE + 0.1;

function StickyStats({
	onCollapse,
}: {
	onCollapse: (bottom: number, past: boolean) => void;
}) {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});
	const summaryOpacity = useTransform(
		scrollYProgress,
		[COUNT_SHARE, COUNT_SHARE + 0.08],
		[0, 1],
	);
	const summaryY = useTransform(
		scrollYProgress,
		[COUNT_SHARE, COUNT_SHARE + 0.08],
		[48, 0],
	);

	// While the user is held on the summary, report once scrolling settles so
	// the runway they already scrolled through can be removed.
	useEffect(() => {
		let timer: number | undefined;
		const check = () => {
			window.clearTimeout(timer);
			const section = sectionRef.current;
			if (!section) return;
			const { top, bottom } = section.getBoundingClientRect();
			if (bottom < 0) {
				onCollapse(bottom, true);
				return;
			}
			const runway = section.offsetHeight - window.innerHeight;
			if (-top / runway >= HOLD_START) {
				timer = window.setTimeout(() => onCollapse(bottom, false), 150);
			}
		};
		window.addEventListener("scroll", check, { passive: true });
		check();
		return () => {
			window.clearTimeout(timer);
			window.removeEventListener("scroll", check);
		};
	}, [onCollapse]);

	return (
		<section
			ref={sectionRef}
			id="impact"
			className="relative z-10 h-[550svh]"
			aria-labelledby="impact-title"
		>
			<div className="sticky top-0 flex h-svh items-center">
				<SectionContainer className={columnsClassName}>
					<div className={headingClassName}>
						<SectionTitle id="impact-title">Impact</SectionTitle>
					</div>
					<div className="grid min-w-0">
						{metrics.map((metric, index) => (
							<Stat
								key={metric.label}
								metric={metric}
								index={index}
								progress={scrollYProgress}
							/>
						))}
						<motion.div
							className="col-start-1 row-start-1 min-w-0 self-center"
							style={{ opacity: summaryOpacity, y: summaryY }}
						>
							<SummaryList />
						</motion.div>
					</div>
				</SectionContainer>
			</div>
		</section>
	);
}

export default function Stats() {
	const reducedMotion = useReducedMotion();
	const [collapse, setCollapse] = useState<{
		bottom: number;
		past: boolean;
	} | null>(null);
	const onCollapse = useCallback(
		(bottom: number, past: boolean) =>
			setCollapse((prev) => prev ?? { bottom, past }),
		[],
	);

	// Replace the long runway with a one-viewport summary without moving what
	// is on screen. Held on the summary: put the section top at the viewport top
	// (where the pinned content already is). Already past: keep its bottom edge
	// where it was. Native scroll anchoring is off so it doesn't double-correct.
	useLayoutEffect(() => {
		if (collapse === null) return;
		const section = document.getElementById("impact");
		if (!section) return;
		const root = document.documentElement;
		root.style.overflowAnchor = "none";
		const rect = section.getBoundingClientRect();
		// "instant" so a global scroll-behavior: smooth can't animate the fix-up.
		window.scrollTo({
			top: window.scrollY + (collapse.past ? rect.bottom - collapse.bottom : rect.top),
			behavior: "instant",
		});
		const frame = requestAnimationFrame(() => {
			root.style.overflowAnchor = "";
		});
		return () => cancelAnimationFrame(frame);
	}, [collapse]);

	if (!reducedMotion && collapse === null) {
		return <StickyStats onCollapse={onCollapse} />;
	}

	return (
		<section
			id="impact"
			className="relative z-10 flex min-h-svh scroll-mt-20 items-center"
			aria-labelledby="impact-title"
		>
			<SectionContainer className={`${columnsClassName} w-full`}>
				<div className={headingClassName}>
					<SectionTitle id="impact-title">Impact</SectionTitle>
				</div>
				<div className="grid min-w-0">
					<SummaryList />
				</div>
			</SectionContainer>
		</section>
	);
}
