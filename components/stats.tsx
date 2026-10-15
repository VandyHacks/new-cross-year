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
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";

const columnsClassName =
	"grid grid-cols-2 items-center gap-[clamp(24px,6vw,96px)] max-[767px]:gap-5";
const headingClassName = "[&_h2]:m-0 [&_h2]:text-left";
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
	const phase = useTransform(progress, (latest) => {
		const current = latest * metrics.length - index;
		if (current <= 0.7) return current;

		const endProgress = Math.min((current - 0.7) / 0.3, 1);
		return 0.7 + 0.3 * (1 - (1 - endProgress) ** 1.5);
	});
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
			id="about"
			className="relative z-10 h-[460svh]"
			aria-labelledby="about-title"
		>
			<div className="sticky top-0 flex h-svh items-center">
				<SectionContainer className={columnsClassName}>
					<div className={headingClassName}>
						<SectionTitle id="about-title">About</SectionTitle>
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
				</SectionContainer>
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
			id="about"
			className="relative z-10 scroll-mt-20 py-[clamp(48px,7vw,88px)]"
			aria-labelledby="about-title"
		>
			<SectionContainer>
				<h2 id="about-title" className="sr-only">
					About
				</h2>
				<motion.div
					className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
					initial={reducedMotion ? false : "hidden"}
					whileInView="visible"
					viewport={{ once: true, amount: 0.3 }}
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: reducedMotion ? 0 : 0.15,
							},
						},
					}}
				>
					{metrics.map((metric) => (
						<motion.article
							key={metric.label}
							data-stat-card
							className="flex min-h-32 min-w-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#151e3d]/85 p-4 text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_40px_rgb(0_0_0/0.18)] backdrop-blur-xl sm:min-h-36"
							variants={{
								hidden: { opacity: 0 },
								visible: {
									opacity: 1,
									transition: {
										duration: reducedMotion ? 0 : 0.6,
										ease: "easeOut",
									},
								},
							}}
						>
							<p className="mb-2 font-heading text-xl leading-tight tracking-[-0.04em] text-[#c8a2ff] sm:text-2xl">
								{formattedValue(metric)}
							</p>
							<h3 className="type-body-sm break-words text-[#e6e8f2]">
								{metric.label}
							</h3>
						</motion.article>
					))}
				</motion.div>
			</SectionContainer>
		</section>
	);
}
