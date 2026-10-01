"use client";

import AsciiWordmark from "@/components/ascii-wordmark";
import { screenFlicker, sequenceStage } from "@/lib/intro-motion";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";

type IntroStage = "copy" | "lines" | "links";

const navLinkClassName =
	"flex justify-between px-2.5 py-[7px] transition-colors duration-200 hover:bg-[#ba87f8] hover:text-black focus-visible:outline-2 focus-visible:outline-[#ba87f8] focus-visible:outline-offset-5 motion-reduce:transition-none max-[600px]:px-2 [-webkit-tap-highlight-color:transparent] [&_span]:opacity-55";

export default function Home() {
	const [stage, setStage] = useState<IntroStage>("copy");
	const reducedMotion = useReducedMotion();
	const finishWordmark = useCallback(() => setStage("links"), []);

	return (
		<main id="home">
			<section
				className="relative isolate flex h-svh min-h-[820px] flex-col px-[clamp(20px,3vw,64px)] min-[1800px]:min-h-[950px] max-[900px]:min-h-[740px] max-[600px]:min-h-[780px] "
				aria-labelledby="event-title"
			>
				<motion.div
					className="pointer-events-none absolute inset-y-0 inset-x-[clamp(20px,3vw,64px)] -z-10 flex justify-between"
					aria-hidden="true"
					initial="hidden"
					animate={stage === "copy" ? "hidden" : "visible"}
					variants={sequenceStage}
				>
					{Array.from({ length: 5 }, (_, i) => (
						<motion.span
							key={i}
							data-intro
							className="block w-px bg-[linear-gradient(#ffffff24,#ffffff0c_65%,#ffffff24)] max-[600px]:even:hidden"
							variants={{
								hidden: { clipPath: "inset(0 0 100% 0)" },
								visible: {
									clipPath: "inset(0 0 0% 0)",
									transition: reducedMotion
										? { duration: 0 }
										: {
												type: "spring",
												delay: i * 0.4,
												damping: 30,
												stiffness: 80,
											},
								},
							}}
						/>
					))}
				</motion.div>
				<header className="relative z-2 pt-7">
					<h1 id="event-title" className="sr-only">
						VandyHacks XIII — Vanderbilt’s collegiate hackathon
					</h1>
					<motion.nav
						className="grid grid-cols-4 gap-px text-xs leading-[normal] uppercase max-[600px]:grid-cols-2 max-[600px]:gap-y-2.5 max-[600px]:text-[10px]"
						aria-label="Main navigation"
						initial="hidden"
						animate={stage === "links" ? "visible" : "hidden"}
					>
						<motion.a
							data-intro
							variants={screenFlicker}
							custom={{ delay: 0.28, reducedMotion }}
							className={`${navLinkClassName} bg-[#f1f0f3] text-black`}
							href="#home"
						>
							Home <span>↗</span>
						</motion.a>
						<motion.a
							data-intro
							variants={screenFlicker}
							custom={{ delay: 0, reducedMotion }}
							className={navLinkClassName}
							href="mailto:info@vandyhacks.org?subject=Sponsoring%20VandyHacks%20XIII"
						>
							Sponsor <span>↗</span>
						</motion.a>
						<motion.a
							data-intro
							variants={screenFlicker}
							custom={{ delay: 0.44, reducedMotion }}
							className={navLinkClassName}
							href="https://www.instagram.com/vandyhacks"
							target="_blank"
							rel="noreferrer"
						>
							Instagram <span>↗</span>
						</motion.a>
						<motion.a
							data-intro
							variants={screenFlicker}
							custom={{ delay: 0.12, reducedMotion }}
							className={navLinkClassName}
							href="mailto:info@vandyhacks.org"
						>
							Contact <span>↗</span>
						</motion.a>
					</motion.nav>
				</header>
				<AsciiWordmark
					introActive={stage !== "copy"}
					onIntroComplete={finishWordmark}
				/>
				<motion.div
					className="pointer-events-none relative z-1 mt-auto grid grid-cols-[3fr_1fr] items-end gap-[30px] px-2.5 pb-10 min-[1800px]:pb-[60px] max-[900px]:grid-cols-2 max-[900px]:gap-6 max-[600px]:grid-cols-1 max-[600px]:px-2 max-[600px]:pb-7"
					initial="hidden"
					animate="visible"
					variants={sequenceStage}
					onAnimationComplete={(definition) => {
						if (definition === "visible" && stage === "copy") {
							setStage("lines");
						}
					}}
				>
					<motion.div>
						<motion.div className="overflow-hidden">
							<motion.span
								data-intro
								variants={{
									hidden: { opacity: 0 },
									visible: {
										opacity: 1,
										transition: reducedMotion
											? { duration: 0 }
											: { delay: 1, ease: "easeInOut" },
									},
								}}
								className="mb-[18px] block font-mono text-[11px] font-normal tracking-[0.04em] uppercase max-[600px]:mb-3 max-[600px]:text-[10px]"
							>
								Code. Collaborate. Create.
							</motion.span>
						</motion.div>
						<motion.div className="overflow-hidden">
							<motion.div className="overflow-hidden font-heading text-[clamp(36px,3.7vw,72px)] leading-[0.98] font-normal tracking-[-0.055em] max-[600px]:text-[40px]">
								<motion.div
									data-intro
									variants={{
										hidden: { y: "100%" },
										visible: {
											y: "0%",
											transition: reducedMotion
												? { duration: 0 }
												: {
														delay: 0.2,
														type: "spring",
														damping: 20,
													},
										},
									}}
								>
									The south&apos;s
								</motion.div>
							</motion.div>
							<motion.div className="overflow-hidden font-heading text-[clamp(36px,3.7vw,72px)] leading-[0.98] font-normal tracking-[-0.055em] max-[600px]:text-[40px]">
								<motion.div
									data-intro
									variants={{
										hidden: { y: "100%" },
										visible: {
											y: "0%",
											transition: reducedMotion
												? { duration: 0 }
												: {
														delay: 0.55,
														type: "spring",
														damping: 20,
													},
										},
									}}
								>
									premier hackathon.
								</motion.div>
							</motion.div>
						</motion.div>
					</motion.div>
					<div className="max-w-[260px] justify-self-end overflow-hidden pb-1 text-sm leading-normal text-[#99959e] min-[1800px]:max-w-[320px] min-[1800px]:text-[17px]">
						<motion.p
							data-intro
							variants={{
								hidden: { opacity: 0 },
								visible: {
									opacity: 1,
									transition: reducedMotion
										? { duration: 0 }
										: {
												delay: 0.85,
												type: "spring",
												damping: 20,
											},
								},
							}}
						>
							A weekend to meet new people, learn something new,
							and make something you can call yours.
						</motion.p>
					</div>
				</motion.div>
			</section>
		</main>
	);
}
