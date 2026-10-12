"use client";

import { motion, useReducedMotion } from "motion/react";

const metrics = [
	{
		value: "2,000+",
		label: "Hackers around the world",
	},
	{
		value: "500+",
		label: "Projects Created",
	},
	{
		value: "20+",
		label: "Speakers Hosted",
	},
	{
		value: "25+",
		label: "Different Schools Represented",
	},
	{
		value: "13",
		label: "Editions of VandyHacks",
	},
	{
		value: "$50K",
		label: "Total prize pool",
	},
];

export default function Stats() {
	const reducedMotion = useReducedMotion();

	return (
		<section
			id="stats"
			className="relative z-10 scroll-mt-20 px-[clamp(20px,5vw,72px)] py-[clamp(48px,7vw,88px)]"
			aria-label="Stats"
		>
			<div className="mx-auto w-full max-w-7xl">
				<h2
					id="stats-title"
					className="sr-only"
				>
					Stats
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
								{metric.value}
							</p>
							<h3 className="break-words font-mono text-xs font-normal leading-relaxed text-[#e6e8f2] sm:text-sm">
								{metric.label}
							</h3>
						</motion.article>
					))}
				</motion.div>
			</div>
		</section>
	);
}
