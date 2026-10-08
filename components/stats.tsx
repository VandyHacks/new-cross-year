"use client";

import {
	motion,
	type MotionValue,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import { useRef } from "react";
import Counter from "@/components/counter";
import SectionTitle from "@/components/section-title";

const columnsClassName =
	"mx-auto grid w-full max-w-[1400px] grid-cols-2 items-center gap-[clamp(24px,6vw,96px)] max-[767px]:gap-5";
const headingClassName =
	"[&_h2]:m-0 [&_h2]:text-center [&_h2]:text-[clamp(64px,9vw,128px)] max-[767px]:[&_h2]:text-[clamp(36px,8vw,60px)]";
const valueClassName =
	"flex items-center justify-center font-heading text-[clamp(40px,6.5vw,96px)] leading-[1.2] tracking-[-0.04em] text-[#ba87f8] max-[767px]:text-[clamp(20px,5vw,38px)]";
const labelClassName =
	"mx-auto mt-4 max-w-[28ch] text-center text-[clamp(12px,1.2vw,18px)] leading-[1.6] text-[#f1f0f3] max-[767px]:mt-3 max-[767px]:text-[10px]";

const metrics = [
	{ value: 2000, suffix: "+", label: "Hackers around the world" },
	{ value: 500, suffix: "+", label: "Projects Created" },
	{ value: 20, suffix: "+", label: "Speakers Hosted" },
	{ value: 25, suffix: "+", label: "Different Schools Represented" },
	{ value: 13, suffix: "", label: "Editions of VandyHacks" },
	{ value: 50, prefix: "$", suffix: "K", label: "Total prize pool" },
];

type Metric = (typeof metrics)[number];

function formattedValue(metric: Metric) {
	return `${metric.prefix ?? ""}${metric.value.toLocaleString("en-US")}${metric.suffix}`;
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
	const phase = useTransform(
		progress,
		(latest) => latest * metrics.length - index,
	);
	// Enter, count in the center, hold the final value, then scroll out.
	const opacity = useTransform(phase, [-0.12, 0, 0.84, 1], [0, 1, 1, 0]);
	const y = useTransform(phase, [-0.12, 0, 0.84, 1], [72, 0, 0, -72]);
	const value = useTransform(phase, [0.06, 0.62], [0, metric.value]);
	const last = index === metrics.length - 1;
	const finalOpacity = useTransform(phase, [-0.12, 0], [0, 1]);
	const finalY = useTransform(phase, [-0.12, 0], [72, 0]);

	return (
		<motion.div
			className="col-start-1 row-start-1 min-w-0 self-center"
			aria-hidden="true"
			style={{
				opacity: last ? finalOpacity : opacity,
				y: last ? finalY : y,
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

function StickyStats() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	return (
		<section
			ref={sectionRef}
			id="stats"
			className="relative z-10 h-[460svh]"
			aria-labelledby="stats-title"
		>
			<div className="sticky top-0 flex h-svh items-center px-[clamp(20px,3vw,64px)]">
				<div className={columnsClassName}>
					<div className={headingClassName}>
						<SectionTitle id="stats-title">about us</SectionTitle>
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
					</div>
				</div>
			</div>
			<dl className="sr-only">
				{metrics.map((metric) => (
					<div key={metric.label}>
						<dt>{metric.label}</dt>
						<dd>{formattedValue(metric)}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

export default function Stats() {
	const reducedMotion = useReducedMotion();

	if (!reducedMotion) return <StickyStats />;

	return (
		<section
			id="stats"
			className="relative z-10 px-[clamp(20px,3vw,64px)] py-20"
			aria-labelledby="stats-title"
		>
			<div className={columnsClassName}>
				<div className={headingClassName}>
					<SectionTitle id="stats-title">about us</SectionTitle>
				</div>
				<dl className="grid gap-10">
					{metrics.map((metric) => (
						<div key={metric.label}>
							<dt className={labelClassName}>{metric.label}</dt>
							<dd className={valueClassName}>
								{formattedValue(metric)}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
