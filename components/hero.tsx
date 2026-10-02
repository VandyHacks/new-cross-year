"use client";

import AsciiWordmark from "@/components/ascii-wordmark";
import { screenFlicker, sequenceStage } from "@/lib/intro-motion";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

type IntroStage = "loading" | "copy" | "lines" | "links";

const navLinkClassName =
	"flex justify-between px-2.5 py-[7px] transition-colors duration-200 hover:bg-[#ba87f8] hover:text-black focus-visible:outline-2 focus-visible:outline-[#ba87f8] focus-visible:outline-offset-5 motion-reduce:transition-none max-[600px]:px-2 [-webkit-tap-highlight-color:transparent] [&_span]:opacity-55";

export default function Hero() {
	const [stage, setStage] = useState<IntroStage>("loading");
	// Unlock after the navigation flicker; the slower background lines can settle.
	const [introComplete, setIntroComplete] = useState(false);
	const [heroCovered, setHeroCovered] = useState(false);
	const heroRef = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"],
	});
	const progress = useSpring(scrollYProgress, {
		stiffness: 160,
		damping: 30,
		mass: 0.5,
	});
	const scale = useTransform(progress, [0, 1], [1, 0.8]);
	const opacity = useTransform(progress, [0, 1], [1, 0]);
	const y = useTransform(progress, [0, 1], [0, 10]);

	useMotionValueEvent(scrollYProgress, "change", (value) => {
		setHeroCovered(value >= 1);
	});

	useEffect(() => {
		if (!introComplete || reducedMotion !== false) return;

		const lenis = new Lenis({
			autoRaf: true,
			anchors: true,
			lerp: 0.085,
		});
		return () => lenis.destroy();
	}, [introComplete, reducedMotion]);

	const startIntro = useCallback(() => {
		setStage((current) => (current === "loading" ? "copy" : current));
	}, []);
	const finishWordmark = useCallback(() => setStage("links"), []);
	return (
		<div
			ref={heroRef}
			id="home"
			className="h-svh"
			data-intro-pending={!introComplete}
		>
			<motion.section
				className="fixed inset-0 isolate z-0 flex h-svh origin-center flex-col overflow-hidden bg-[radial-gradient(125%_125%_at_50%_0%,_#000000_50%,_#7e51a4ff)] px-[clamp(20px,3vw,64px)]"
				style={{
					scale: reducedMotion ? 1 : scale,
					opacity: reducedMotion ? 1 : opacity,
					y: reducedMotion ? 0 : y
				}}
				inert={heroCovered}
				aria-hidden={heroCovered}
				aria-labelledby="event-title"
			>
				<motion.div
					className="pointer-events-none absolute inset-y-0 inset-x-[clamp(20px,3vw,64px)] -z-10 flex justify-between"
					aria-hidden="true"
					initial="hidden"
					animate={
						stage === "lines" || stage === "links"
							? "visible"
							: "hidden"
					}
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
						variants={sequenceStage}
						onAnimationComplete={(definition) => {
							if (definition === "visible")
								setIntroComplete(true);
						}}
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
					introActive={stage === "lines" || stage === "links"}
					onReady={startIntro}
					onIntroComplete={finishWordmark}
				/>
				<motion.div
					className="pointer-events-none relative z-1 mt-auto grid grid-cols-[3fr_1fr] items-end gap-[30px] px-2.5 pb-10 min-[1800px]:pb-[60px] max-[900px]:grid-cols-2 max-[900px]:gap-6 max-[600px]:grid-cols-1 max-[600px]:px-2 max-[600px]:pb-7"
					initial="hidden"
					animate={stage === "loading" ? "hidden" : "visible"}
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
			</motion.section>
		</div>
	);
}
