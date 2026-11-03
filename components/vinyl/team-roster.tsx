"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Arc from "@/components/vinyl/arc";
import { SlideHeading } from "@/components/vinyl/slides";
import { type TeamMember, teamGroups } from "@/lib/team";

// Each member is an album sleeve with a record that slides out on hover.
function Sleeve({ member, index }: { member: TeamMember; index: number }) {
	const reducedMotion = useReducedMotion();
	const body = (
		<>
			<span className="sleeve-disc absolute inset-[4%] rounded-full transition-transform duration-500 ease-out group-hover:translate-x-[34%] group-focus-visible:translate-x-[34%] motion-reduce:transition-none" aria-hidden="true">
				<span className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle,#c8a2ff,#7138c7_70%)]" />
			</span>
			<span className="relative block aspect-square overflow-hidden rounded-lg border border-white/10 bg-vh-navy-800 shadow-[0_18px_40px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-out group-hover:-translate-x-[6%] group-hover:-rotate-2">
				<Image src={member.image} alt="" fill sizes="(max-width: 640px) 45vw, 220px" className="object-cover grayscale transition duration-500 group-hover:grayscale-0" />
				<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vh-navy-950/95 via-vh-navy-950/60 to-transparent p-3 pt-10">
					<span className="type-subheading block text-[13px] text-white">{member.name}</span>
				</span>
			</span>
		</>
	);

	return (
		<motion.li
			initial={reducedMotion ? false : { opacity: 0, y: 40, rotate: index % 2 ? 3 : -3 }}
			whileInView={{ opacity: 1, y: 0, rotate: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
		>
			{member.linkedin ? (
				<a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}, ${member.role} — LinkedIn (opens in a new tab)`} className="group relative block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-purple-300">
					{body}
				</a>
			) : (
				<div className="group relative">{body}</div>
			)}
		</motion.li>
	);
}

export default function TeamRoster() {
	return (
		<section id="team" aria-labelledby="team-title" className="slide-gutter slide-frame relative px-5 pt-24 pb-24 sm:px-8">
			<div className="mx-auto max-w-5xl">
				<SlideHeading id="team-title">
					The Team
				</SlideHeading>
				<div className="flex flex-col gap-14">
					{teamGroups.map((group) => (
						<Arc key={group.id} className="grid gap-5 md:grid-cols-[180px_1fr] md:gap-10">
							<motion.h3
								className="md:sticky md:top-24 md:self-start"
								initial={{ opacity: 0, x: -24 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, amount: 0.6 }}
								transition={{ duration: 0.6 }}
							>
								<span className="block font-heading text-xl tracking-[0.08em] text-white uppercase">{group.label}</span>
							</motion.h3>
							<ul className="grid grid-cols-2 gap-x-[clamp(20px,3vw,44px)] gap-y-8 pr-[12%] sm:grid-cols-3 lg:grid-cols-4">
								{group.members.map((member, i) => (
									<Sleeve key={i} member={member} index={i} />
								))}
							</ul>
						</Arc>
					))}
				</div>
			</div>
		</section>
	);
}
