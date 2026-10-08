"use client";

import { motion, useReducedMotion } from "motion/react";
import SectionTitle from "@/components/section-title";

const metrics = [
	{
		value: "2,000+",
		label: "Hackers around the world",
		floatClass: "-translate-y-8",
	},
	{
		value: "500+",
		label: "Projects Created",
		floatClass: "translate-y-6",
	},
	{
		value: "20+",
		label: "Speakers Hosted",
		floatClass: "translate-y-2",
	},
	{
		value: "25+",
		label: "Different Schools Represented",
		floatClass: "-translate-y-5",
	},
	{
		value: "13",
		label: "Editions of VandyHacks",
		floatClass: "-translate-y-1",
	},
	{
		value: "$50K",
		label: "Total prize pool",
		floatClass: "-translate-y-10",
	},
];

export default function Stats() {
	const reducedMotion = useReducedMotion();

	return (
		<section
			id="stats"
			className="relative z-10 isolate overflow-hidden px-[clamp(8px,3vw,64px)] pt-[clamp(48px,6vw,88px)] pb-[clamp(120px,18vw,220px)] max-[900px]:px-5 max-[767px]:pb-20"
			aria-labelledby="stats-title"
		>
			<div className="relative z-10 mx-auto w-full max-w-[1400px]">
				<SectionTitle id="stats-title">about us</SectionTitle>
				<motion.div
					className="grid grid-cols-6 items-start gap-[clamp(4px,1vw,20px)] pt-7 pb-10 max-[900px]:grid-cols-3 max-[900px]:gap-4 max-[900px]:pt-0 max-[767px]:grid-cols-2 max-[767px]:gap-3 max-[767px]:pb-0"
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
							className={`flex min-h-[clamp(100px,14vw,190px)] min-w-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#09070d]/65 p-[clamp(5px,1.4vw,24px)] text-center shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_12px_40px_rgb(0_0_0/0.2)] backdrop-blur-xl backdrop-saturate-150 max-[900px]:min-h-[150px] max-[900px]:translate-y-0 max-[900px]:p-4 ${metric.floatClass}`}
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
							<p className="mb-2 font-heading text-[clamp(12px,1.7vw,28px)] leading-tight tracking-[-0.04em] text-[#ba87f8] max-[900px]:text-[clamp(20px,4.2vw,28px)]">
								{metric.value}
							</p>
							<h3 className="mb-1 break-words font-mono text-[clamp(7px,0.9vw,14px)] font-normal leading-tight text-[#f1f0f3] max-[900px]:text-[10px] max-[900px]:leading-[1.5]">
								{metric.label}
							</h3>
						</motion.article>
					))}
				</motion.div>
			</div>
		</section>
	);
}
