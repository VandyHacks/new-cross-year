"use client";

import AsciiWordmark from "@/components/ascii-wordmark";
import { screenFlicker, sequenceStage } from "@/lib/intro-motion";
import {
	motion,
	type Variants,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "motion/react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import Lenis from "lenis";
import { ArrowUpRight } from "lucide-react";

type IntroStage = "loading" | "copy" | "lines" | "links";

const navLinkClassName =
	"flex items-center justify-between px-2.5 py-[7px] transition-colors duration-200 hover:bg-[#ba87f8] hover:text-black focus-visible:outline-2 focus-visible:outline-[#ba87f8] focus-visible:outline-offset-5 motion-reduce:transition-none max-[767px]:px-2 [-webkit-tap-highlight-color:transparent] [&_svg]:size-[1em] [&_svg]:shrink-0 [&_svg]:opacity-55";
//  bg-[radial-gradient(125%_125%_at_50%_0%,_#000000_50%,_#7e51a477)]
export default function Hero() {
	const [stage, setStage] = useState<IntroStage>("loading");
	// Unlock after the navigation flicker; the slower background lines can settle.
	const [introComplete, setIntroComplete] = useState(false);
	const [heroCovered, setHeroCovered] = useState(false);
	const heroRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const previousRestoration = window.history.scrollRestoration;
		window.history.scrollRestoration = "manual";
		const resetScroll = () => {
			window.scrollTo({ top: 0, left: 0, behavior: "instant" });
		};
		resetScroll();
		window.addEventListener("pageshow", resetScroll);
		return () => {
			window.removeEventListener("pageshow", resetScroll);
			window.history.scrollRestoration = previousRestoration;
		};
	}, []);

	const reducedMotion = useReducedMotion();
	const copyFade: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: reducedMotion
				? { duration: 0 }
				: { delay: 0.85, type: "spring", damping: 20 },
		},
	};
	const scrollYProgress = useMotionValue(0);
	const progress = useSpring(scrollYProgress, {
		stiffness: 160,
		damping: 30,
		mass: 0.5,
	});
	const scale = useTransform(progress, [0, 1], [1, 0.8]);
	const opacity = useTransform(progress, [0, 1], [1, 0]);
	const y = useTransform(progress, [0, 1], [0, 10]);

	useLayoutEffect(() => {
		const target = heroRef.current;
		if (!target) return;
		let frame = 0;
		const measure = () => {
			frame = 0;
			const { top, height } = target.getBoundingClientRect();
			const next =
				height > 0 ? Math.max(0, Math.min(1, -top / height)) : 0;
			scrollYProgress.set(next);
			if (next === 0) progress.jump(0);
			setHeroCovered(next >= 1);
		};
		const scheduleMeasure = () => {
			if (!frame) frame = requestAnimationFrame(measure);
		};
		measure();
		window.addEventListener("scroll", scheduleMeasure, { passive: true });
		window.addEventListener("resize", scheduleMeasure);
		window.addEventListener("pageshow", scheduleMeasure);
		const resize = new ResizeObserver(scheduleMeasure);
		resize.observe(target);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", scheduleMeasure);
			window.removeEventListener("resize", scheduleMeasure);
			window.removeEventListener("pageshow", scheduleMeasure);
			resize.disconnect();
		};
	}, [scrollYProgress, progress]);

	useEffect(() => {
		if (!introComplete || reducedMotion !== false) return;

		const lenis = new Lenis({
			autoRaf: true,
			anchors: true,
			lerp: 0.055,
			wheelMultiplier: 0.65,
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
				className="fixed inset-0 isolate z-0 flex h-svh origin-center flex-col overflow-hidden px-[clamp(20px,3vw,64px)]"
				style={{
					scale: reducedMotion ? 1 : scale,
					opacity: reducedMotion ? 1 : opacity,
					y: reducedMotion ? 0 : y,
					visibility: heroCovered ? "hidden" : "visible",
				}}
				inert={heroCovered}
				aria-hidden={heroCovered}
				aria-labelledby="event-title"
			>
				<motion.div
					className="pointer-events-none absolute inset-y-0 inset-x-[clamp(20px,3vw,64px)] -z-10 grid grid-cols-4 max-[767px]:grid-cols-2"
					aria-hidden="true"
					initial="hidden"
					animate={
						stage === "lines" || stage === "links"
							? "visible"
							: "hidden"
					}
					variants={sequenceStage}
				>
					{Array.from({ length: 4 }, (_, i) => (
						<motion.span
							key={i}
							data-intro
							className="block w-px bg-[linear-gradient(#ffffff24,#ffffff0c_65%,#ffffff24)] max-[767px]:even:hidden"
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
				<header className="relative z-2 pt-7 max-[767px]:pt-5">
					<h1 id="event-title" className="sr-only">
						VandyHacks XIII — Vanderbilt’s collegiate hackathon
					</h1>
					<motion.nav
						className="grid grid-cols-4 text-xs leading-[normal] uppercase max-[767px]:grid-cols-2 max-[767px]:gap-y-2.5 max-[767px]:text-[10px]"
						aria-label="Main navigation"
						initial="hidden"
						animate={stage === "links" ? "visible" : "hidden"}
						variants={sequenceStage}
						onAnimationComplete={(definition) => {
							if (definition === "visible" && !introComplete) {
								window.scrollTo({
									top: 0,
									left: 0,
									behavior: "instant",
								});
								setIntroComplete(true);
							}
						}}
					>
						<motion.a
							data-intro
							variants={screenFlicker}
							custom={{ delay: 0.28, reducedMotion }}
							className={`${navLinkClassName} bg-[#f1f0f3] text-black`}
							href="#home"
						>
							Home <ArrowUpRight aria-hidden="true" />
						</motion.a>
						<motion.a
							data-intro
							variants={screenFlicker}
							custom={{ delay: 0, reducedMotion }}
							className={navLinkClassName}
							href="mailto:info@vandyhacks.org?subject=Sponsoring%20VandyHacks%20XIII"
						>
							Sponsor <ArrowUpRight aria-hidden="true" />
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
							Instagram <ArrowUpRight aria-hidden="true" />
						</motion.a>
						<motion.a
							data-intro
							variants={screenFlicker}
							custom={{ delay: 0.12, reducedMotion }}
							className={navLinkClassName}
							href="mailto:info@vandyhacks.org"
						>
							Contact <ArrowUpRight aria-hidden="true" />
						</motion.a>
					</motion.nav>
				</header>
				<AsciiWordmark
					introActive={stage === "lines" || stage === "links"}
					onReady={startIntro}
					onIntroComplete={finishWordmark}
				/>
				<motion.div
					className="pointer-events-none relative z-1 mt-auto grid grid-cols-[3fr_1fr] items-end gap-[30px] px-2.5 pb-10 min-[1800px]:pb-[60px] max-[900px]:grid-cols-2 max-[900px]:gap-6 max-[767px]:grid-cols-1 max-[767px]:gap-4 max-[767px]:px-2 max-[767px]:pb-[max(20px,env(safe-area-inset-bottom))]"
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
								variants={copyFade}
								className="mb-[18px] block font-mono text-[11px] font-normal tracking-[0.04em] uppercase max-[767px]:mb-3 max-[767px]:text-[9px]"
							>
								Code. Collaborate. Create.
							</motion.span>
						</motion.div>
						<motion.div className="overflow-hidden">
							<motion.div className="overflow-hidden font-heading text-[clamp(36px,3.7vw,72px)] leading-[0.98] font-normal tracking-[-0.055em] max-[767px]:text-[clamp(26px,6.5vw,40px)] max-[767px]:leading-[1.1]">
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
							<motion.div className="overflow-hidden font-heading text-[clamp(36px,3.7vw,72px)] leading-[0.98] font-normal tracking-[-0.055em] max-[767px]:text-[clamp(26px,6.5vw,40px)] max-[767px]:leading-[1.1]">
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
					<div className="max-w-[260px] justify-self-end overflow-hidden pb-1 text-sm leading-normal text-[#99959e] min-[1800px]:max-w-[320px] min-[1800px]:text-[17px] max-[767px]:max-w-[360px] max-[767px]:justify-self-start max-[767px]:text-xs">
						<motion.p data-intro variants={copyFade}>
							A weekend to meet new people, learn something new,
							and make something you can call yours.
						</motion.p>
					</div>
				</motion.div>
			</motion.section>
		</div>
	);
}