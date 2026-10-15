"use client";

import {
	easeInOut,
	motion,
	type MotionValue,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "motion/react";
import { useRef } from "react";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";

const missionText =
	"At VandyHacks, we believe the next big idea can come from anyone. We bring together curious minds, bold thinkers, and passionate builders to turn ideas into reality through hackathons, hands-on workshops, and collaborations with industry leaders. From first-time coders to experienced developers, we create a space where students can experiment with emerging technologies, challenge what's possible, and build connections that last beyond the event. Join us on April 3–4, 2027, for VandyHacks XIII, the thirteenth edition of Vanderbilt University's annual student-run hackathon, where innovation meets opportunity and ideas come to life.";

const BASE_OPACITY = 0.12;

const missionTextClassName =
	"text-center font-heading text-[clamp(15px,2.1vw,32px)] leading-[1.35] tracking-[-0.02em] text-[#f1f0f3]";

// Each word fades from low to full opacity over its slice of the section's
// sticky scroll progress — the same scroll-linked technique Stats uses.
function MissionWord({
	children,
	progress,
	index,
	total,
	reducedMotion,
}: {
	children: string;
	progress: MotionValue<number>;
	index: number;
	total: number;
	reducedMotion: boolean;
}) {
	const opacity = useTransform(
		progress,
		[index / total, (index + 1) / total],
		[BASE_OPACITY, 1],
		{ ease: easeInOut },
	);

	return (
		<motion.span
			data-scroll-reveal-word
			className="inline-block"
			style={{ opacity: reducedMotion ? 1 : opacity }}
		>
			{children}
		</motion.span>
	);
}

function StickyMission() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});
	// Spring smoothing keeps the word sequence gradual, matching the site feel.
	const progress = useSpring(scrollYProgress, {
		stiffness: 55,
		damping: 24,
		mass: 1,
		restDelta: 0.001,
		restSpeed: 0.001,
	});
	const tokens = missionText.split(/(\s+)/);
	const wordCount = tokens.filter((token) => token.trim()).length;
	let wordIndex = 0;

	return (
		<section
			ref={sectionRef}
			id="mission"
			className="relative z-10 h-[240svh] max-[767px]:h-[180svh]"
			aria-labelledby="mission-title"
		>
			<div className="sticky top-0 flex h-svh flex-col justify-center">
				<SectionContainer>
					<SectionTitle id="mission-title">Mission</SectionTitle>
					<p className={missionTextClassName}>
						<span className="sr-only">{missionText}</span>
						<span aria-hidden="true">
							{tokens.map((token, index) =>
								token.trim() ? (
									<MissionWord
										key={index}
										progress={progress}
										index={wordIndex++}
										total={wordCount}
										reducedMotion={false}
									>
										{token}
									</MissionWord>
								) : (
									token
								),
							)}
						</span>
					</p>
				</SectionContainer>
			</div>
		</section>
	);
}

export default function Mission() {
	const reducedMotion = useReducedMotion();

	if (!reducedMotion) return <StickyMission />;

	// Reduced motion: no pinning or animation — the full text, shown large.
	return (
		<section
			id="mission"
			className="relative z-10 scroll-mt-20 py-[clamp(48px,7vw,88px)]"
			aria-labelledby="mission-title"
		>
			<SectionContainer>
				<SectionTitle id="mission-title">Mission</SectionTitle>
				<p className={missionTextClassName}>{missionText}</p>
			</SectionContainer>
		</section>
	);
}
