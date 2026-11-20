"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import FormPanel from "@/components/forms/form-panel";
import Arc from "@/components/vinyl/arc";
import { SlideBody, SlideHeading } from "@/components/vinyl/slides";
import { TAB_EVENT } from "@/components/vinyl/stage";
import { interestFields, judgeFields, sponsorFields } from "@/lib/forms/fields";
import {
	submitInterest,
	submitJudge,
	submitSponsor,
} from "@/lib/forms/actions";

const tabs = [
	{
		id: "interest",
		label: "Hackers",
		heading: "Be first to know",
		blurb: "Registration for VandyHacks XIII isn't open yet! Leave your information below to be notified when it opens.",
		submitLabel: "Notify me",
		fields: interestFields,
		action: submitInterest,
	},
	{
		id: "judge",
		label: "Judge/Mentor",
		heading: "Help shape what's next",
		blurb: "Interested in judging or mentoring at VandyHacks XIII? Share your information below, and we'll be in touch!",
		submitLabel: "Offer to help",
		fields: judgeFields,
		action: submitJudge,
	},
	{
		id: "sponsor",
		label: "Sponsor",
		heading: "Partner with VandyHacks",
		blurb: "Connect with 200+ hackers at VandyHacks XIII! Leave your information below, and our team will reach out.",
		submitLabel: "Get in touch",
		fields: sponsorFields,
		action: submitSponsor,
	},
] as const;

type TabId = (typeof tabs)[number]["id"];

const HASH_PATTERN = /^#get-involved(?:\/(interest|judge|sponsor))?$/;

// Left/Right move between tabs (Home/End jump to the ends), like a browser.
const KEY_STEP: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

export default function GetInvolved() {
	const reducedMotion = useReducedMotion();
	const baseId = useId();
	const [activeId, setActiveId] = useState<TabId>("interest");

	// Deep links: #get-involved, #get-involved/judge, #get-involved/sponsor.
	// The browser can't scroll to those ("/" isn't in an id), so do it here.
	useEffect(() => {
		const apply = () => {
			const match = HASH_PATTERN.exec(window.location.hash);
			if (!match) return;
			if (match[1]) setActiveId(match[1] as TabId);
			document.getElementById("get-involved")?.scrollIntoView({
				behavior: reducedMotion ? "auto" : "smooth",
				block: "start",
			});
		};
		// Links on the vinyl page scroll via its scroll director and only ask
		// this component to switch tabs.
		const onTab = (event: Event) => {
			const tab = (event as CustomEvent<string>).detail;
			if (tabs.some((t) => t.id === tab)) setActiveId(tab as TabId);
		};
		apply();
		window.addEventListener("hashchange", apply);
		window.addEventListener(TAB_EVENT, onTab);
		return () => {
			window.removeEventListener("hashchange", apply);
			window.removeEventListener(TAB_EVENT, onTab);
		};
	}, [reducedMotion]);

	const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
	const blurbId = `${baseId}-blurb`;

	return (
		<section id="get-involved" aria-labelledby="get-involved-title">
			<SlideBody fit>
				<SlideHeading id="get-involved-title" wrapperClassName="mb-[clamp(24px,4.5svh,52px)]">
					Get Involved
				</SlideHeading>
				<Arc className="mb-[clamp(14px,2.6svh,28px)]">
					<motion.p
						key={active.id}
						id={blurbId}
						className="text-pretty text-[clamp(16px,1.4vw,21px)] leading-[1.7] text-vh-text-soft"
						initial={reducedMotion ? false : { opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
					>
						{active.blurb}
					</motion.p>
				</Arc>

				<Arc className="mr-auto w-full max-w-[920px]">
					{/* Dark glass form container with a faint purple glow. Modern tab
					    bar up top with an animated purple underline for the active tab. */}
					<div className="overflow-hidden rounded-xl border border-white/10 bg-vh-navy-950/35 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_20px_50px_rgb(0_0_0/0.3),0_0_40px_rgb(113_56_199/0.14)] backdrop-blur-md">
							<div
								role="tablist"
								aria-label="Ways to get involved"
								className="flex gap-1 border-b border-white/10 px-[clamp(8px,1.5vw,16px)]"
							>
								{tabs.map((tab, index) => {
									const selected = tab.id === active.id;
									return (
										<button
											key={tab.id}
											type="button"
											role="tab"
											id={`${baseId}-tab-${tab.id}`}
											aria-selected={selected}
											aria-controls={`${baseId}-panel-${tab.id}`}
											tabIndex={selected ? 0 : -1}
											onClick={() => setActiveId(tab.id)}
											onKeyDown={(event) => {
												const target =
													event.key === "Home"
														? 0
														: event.key === "End"
															? tabs.length - 1
															: KEY_STEP[event.key] !== undefined
																? (index + KEY_STEP[event.key] + tabs.length) % tabs.length
																: -1;
												if (target < 0) return;
												event.preventDefault();
												const next = tabs[target];
												setActiveId(next.id);
												document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
											}}
											className={`relative px-[clamp(10px,1.6vw,18px)] py-3 font-mono text-[12px] tracking-[0.02em] whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-vh-purple-300 sm:text-[13px] ${
												selected ? "text-white" : "text-vh-muted hover:text-white"
											}`}
										>
											{tab.label}
											{selected && (
												<motion.span
													layoutId={`${baseId}-active-tab`}
													aria-hidden="true"
													className="absolute inset-x-[clamp(10px,1.6vw,18px)] -bottom-px h-0.5 rounded-full bg-vh-purple-300 shadow-[0_0_8px_rgb(200_162_255/0.6)]"
													transition={
														reducedMotion
															? { duration: 0 }
															: { type: "spring", stiffness: 520, damping: 40 }
													}
												/>
											)}
										</button>
									);
								})}
							</div>
							{/* All three panels stay mounted (hidden) so half-typed answers
							    and success messages survive switching tabs. */}
							<div>
								{tabs.map((tab) => {
									const selected = tab.id === active.id;
									return (
										<div
											key={tab.id}
											role="tabpanel"
											id={`${baseId}-panel-${tab.id}`}
											aria-labelledby={`${baseId}-tab-${tab.id}`}
											aria-describedby={selected ? blurbId : undefined}
											hidden={!selected}
										>
											<FormPanel
												action={tab.action}
												fields={[...tab.fields]}
												submitLabel={tab.submitLabel}
												active={selected}
											/>
										</div>
									);
								})}
							</div>
						</div>
					{/* Privacy note: below the submit button, small and subtle. */}
					<p className="mt-3 px-1 text-[11px] leading-5 text-vh-faint/80">
						We only use your details to contact you about VandyHacks, and never sell them.
					</p>
				</Arc>
			</SlideBody>
		</section>
	);
}
