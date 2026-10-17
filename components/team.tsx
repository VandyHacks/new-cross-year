"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import CircularGallery from "@/components/circular-gallery";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";
import { team } from "@/lib/team";

const items = team.map((member) => ({
	image: member.image,
	text: member.name,
	description: member.role,
	alt: `${member.name}, ${member.role}`,
}));

export default function Team() {
	const reducedMotion = useReducedMotion();
	const [active, setActive] = useState(0);
	const member = team[active % team.length];

	return (
		<section
			id="team"
			className="relative z-10 scroll-mt-20 py-[clamp(48px,7vw,88px)]"
			aria-labelledby="team-title"
		>
			<SectionContainer>
				<SectionTitle id="team-title">Team</SectionTitle>
				<p className="type-body mb-4 max-w-2xl text-vh-muted">
					The students behind VandyHacks. Drag or swipe to meet them.
				</p>
			</SectionContainer>
			<div className="h-[clamp(340px,46vw,540px)] w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
				<CircularGallery
					items={items}
					bend={2.2}
					autoScroll={1}
					grayscale
					showTitles={false}
					openOnClick={false}
					borderRadius={0.07}
					fadeEdges={0.18}
					itemAspect={0.8}
					gap={0.22}
					shadow={0.35}
					font="16px sans-serif"
					aria-label="Team members"
					onActiveChange={setActive}
				/>
			</div>
			<SectionContainer>
				<div
					className="mt-2 flex min-h-20 flex-col items-center text-center"
					aria-hidden="true"
				>
					<AnimatePresence mode="wait" initial={false}>
						<motion.div
							key={active}
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
						>
							<h3 className="type-subheading text-white">
								{member.name}
							</h3>
							<p className="type-label mt-2 text-vh-purple-300">
								{member.role}
							</p>
							{member.linkedin && (
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="type-button mt-2 inline-block text-vh-muted hover:text-white"
								>
									LinkedIn →
								</a>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</SectionContainer>
		</section>
	);
}
