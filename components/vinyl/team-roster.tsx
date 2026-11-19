"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Arc from "@/components/vinyl/arc";
import { SlideBody, SlideHeading } from "@/components/vinyl/slides";
import { type TeamGroup, type TeamMember, teamGroups } from "@/lib/team";

// Row 1: Technology (3) + Experience (4) = 7 cards.
// Row 2: Marketing (3) + Partnerships (3) + Leadership (2) = 8 cards.
const row1 = teamGroups.slice(0, 2);
const row2 = teamGroups.slice(2);

// A portrait card. On hover a small decorative record slides out from behind to
// the right (capped at ~28% of its diameter), while the card tilts and gains a
// subtle purple highlight.
function Sleeve({ member, team, index }: { member: TeamMember; team: string; index: number }) {
	const reducedMotion = useReducedMotion();
	const body = (
		<>
			{/* Decorative record: grooves (from .sleeve-disc) + purple centre. */}
			<span className="sleeve-disc absolute left-[4%] top-1/2 aspect-square w-[92%] -translate-y-1/2 rounded-full transition-transform duration-500 ease-out group-hover:translate-x-[28%] group-focus-visible:translate-x-[28%] motion-reduce:transition-none" aria-hidden="true">
				<span className="absolute inset-[38%] rounded-full bg-[radial-gradient(circle,#c8a2ff,#7138c7_70%)]" />
			</span>
			<span className="relative block aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-vh-navy-800 shadow-[0_14px_32px_rgb(0_0_0/0.45)] transition-[transform,border-color,box-shadow] duration-500 ease-out group-hover:-translate-x-[6%] group-hover:-rotate-2 group-hover:border-vh-purple-300/40 group-hover:shadow-[0_16px_34px_rgb(113_56_199/0.28)]">
				<Image src={member.image} alt="" fill sizes="(max-width: 640px) 44vw, (max-width: 1024px) 20vw, 140px" className="object-cover grayscale transition duration-500 group-hover:grayscale-0" />
				<span className="absolute inset-0 bg-vh-purple-700/25 opacity-0 mix-blend-color transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
				<span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vh-navy-950/95 via-vh-navy-950/45 to-transparent p-2 pt-9">
					<span className="type-subheading block text-[13px] leading-tight text-white">{member.name}</span>
				</span>
			</span>
		</>
	);

	return (
		<motion.li
			className="relative w-[96px] shrink-0 transition-[transform] duration-300 hover:z-10 focus-within:z-10 sm:w-[108px] lg:w-[120px]"
			initial={reducedMotion ? false : { opacity: 0, y: 26 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 0.6, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
		>
			{member.linkedin ? (
				<a
					href={member.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`${member.name}, ${team} — LinkedIn (opens in a new tab)`}
					className="group relative block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-purple-300"
				>
					{body}
				</a>
			) : (
				<div className="group relative block rounded-lg">{body}</div>
			)}
		</motion.li>
	);
}

function TeamGroupCluster({ group, startIndex }: { group: TeamGroup; startIndex: number }) {
	return (
		<div className="flex flex-col items-center gap-2.5">
			<ul className="relative flex gap-1">
				{group.members.map((member, i) => (
					<Sleeve key={i} member={member} team={group.label} index={startIndex + i} />
				))}
			</ul>
			{/* Simple display-font team label, centred under the group. */}
			<motion.span
				className="font-heading text-[clamp(10px,0.95vw,13px)] tracking-[0.16em] text-vh-purple-300 uppercase"
				initial={{ opacity: 0, y: 8 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.6 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				{group.label}
			</motion.span>
		</div>
	);
}

function withIndex(groups: TeamGroup[], base: number) {
	let n = base;
	return groups.map((group) => {
		const startIndex = n;
		n += group.members.length;
		return { group, startIndex };
	});
}

export default function TeamRoster() {
	const r1 = withIndex(row1, 0);
	const r2 = withIndex(row2, 7);
	return (
		<section id="team" aria-labelledby="team-title">
			<SlideBody fit>
				<SlideHeading id="team-title">The Team</SlideHeading>
				<div className="flex flex-col gap-[clamp(22px,3.4svh,40px)]">
					<Arc>
						<div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-5">
							{r1.map(({ group, startIndex }) => (
								<TeamGroupCluster key={group.id} group={group} startIndex={startIndex} />
							))}
						</div>
					</Arc>
					<Arc>
						<div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-5">
							{r2.map(({ group, startIndex }) => (
								<TeamGroupCluster key={group.id} group={group} startIndex={startIndex} />
							))}
						</div>
					</Arc>
				</div>
			</SlideBody>
		</section>
	);
}
