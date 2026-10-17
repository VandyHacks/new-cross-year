"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";
import { faqCategories } from "@/lib/faq";

const tabClassName =
	"type-button rounded-full border px-4 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300";

export default function FAQ() {
	const reducedMotion = useReducedMotion();
	const [activeId, setActiveId] = useState(faqCategories[0].id);
	const baseId = useId();
	const active =
		faqCategories.find((category) => category.id === activeId) ??
		faqCategories[0];

	return (
		<section
			id="faq"
			className="relative z-10 scroll-mt-20 pt-[clamp(48px,7vw,88px)] pb-[clamp(64px,9vw,112px)]"
			aria-labelledby="faq-title"
		>
			<SectionContainer>
				<SectionTitle id="faq-title">FAQ</SectionTitle>
				<div
					role="tablist"
					aria-label="FAQ categories"
					className="mb-8 flex flex-wrap gap-2"
				>
					{faqCategories.map((category) => {
						const selected = category.id === active.id;
						return (
							<button
								key={category.id}
								type="button"
								role="tab"
								id={`${baseId}-tab-${category.id}`}
								aria-selected={selected}
								aria-controls={`${baseId}-panel`}
								tabIndex={selected ? 0 : -1}
								onClick={() => setActiveId(category.id)}
								onKeyDown={(event) => {
									const step =
										event.key === "ArrowRight"
											? 1
											: event.key === "ArrowLeft"
												? -1
												: 0;
									if (!step) return;
									event.preventDefault();
									const index = faqCategories.indexOf(active);
									const next =
										faqCategories[
											(index +
												step +
												faqCategories.length) %
												faqCategories.length
										];
									setActiveId(next.id);
									document
										.getElementById(
											`${baseId}-tab-${next.id}`,
										)
										?.focus();
								}}
								className={`${tabClassName} ${
									selected
										? "border-vh-purple-300 bg-vh-purple-700/30 text-white shadow-[0_0_18px_rgb(113_56_199/0.45)]"
										: "border-white/15 text-vh-muted hover:border-vh-purple-300/60 hover:text-white"
								}`}
							>
								{category.label}
							</button>
						);
					})}
				</div>
				<div
					role="tabpanel"
					id={`${baseId}-panel`}
					aria-labelledby={`${baseId}-tab-${active.id}`}
				>
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={active.id}
							initial={
								reducedMotion ? false : { opacity: 0, y: 8 }
							}
							animate={{ opacity: 1, y: 0 }}
							exit={
								reducedMotion
									? { opacity: 0 }
									: { opacity: 0, y: -8 }
							}
							transition={{ duration: 0.2, ease: "easeOut" }}
							className="divide-y divide-white/10 border-y border-white/10"
						>
							{active.items.map(({ question, answer, link }) => (
								<details key={question} className="group py-5">
									<summary className="type-subheading flex cursor-pointer list-none items-center justify-between gap-4 text-white marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-purple-300">
										{question}
										<span
											className="text-lg text-vh-purple-300 transition-transform group-open:rotate-45"
											aria-hidden="true"
										>
											+
										</span>
									</summary>
									<p className="type-body max-w-3xl pt-4 pr-8 text-vh-muted">
										{answer}
									</p>
									{link && (
										<a
											href={link.href}
											{...(link.href.startsWith("http")
												? {
														target: "_blank",
														rel: "noopener noreferrer",
													}
												: {})}
											className="type-button mt-4 inline-block rounded-sm text-vh-purple-300 underline-offset-4 hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300"
										>
											{link.label} →
										</a>
									)}
								</details>
							))}
						</motion.div>
					</AnimatePresence>
				</div>
			</SectionContainer>
		</section>
	);
}
