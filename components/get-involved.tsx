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
		blurb: "Applications for VandyHacks XIII aren't open yet. Leave your details and we'll email you the moment they are.",
		command: "vandyhacks://interest",
		submitLabel: "Notify me",
		fields: interestFields,
		action: submitInterest,
	},
	{
		id: "judge",
		label: "Judge or mentor",
		heading: "Help hackers ship",
		blurb: "Industry pros, alumni, and grad students: judge projects or mentor teams over the weekend. Tell us about you and we'll follow up.",
		command: "vandyhacks://judge",
		submitLabel: "Offer to help",
		fields: judgeFields,
		action: submitJudge,
	},
	{
		id: "sponsor",
		label: "Sponsor",
		heading: "Back the next builders",
		blurb: "Put your company in front of 1,000+ student builders. Tell us a little about your goals and our sponsorship team will reach out.",
		command: "vandyhacks://sponsor",
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
				<SlideHeading id="get-involved-title">Sign Up</SlideHeading>
				<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-[clamp(28px,4vw,56px)]">
					<Arc>
						<motion.div
							key={active.id}
							initial={reducedMotion ? false : { opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						>
							<h3 className="font-heading text-[clamp(20px,1.9vw,26px)] leading-tight tracking-tight text-white">
								{active.heading}
							</h3>
							<p id={blurbId} className="type-body-sm mt-3 text-pretty text-vh-muted">
								{active.blurb}
							</p>
						</motion.div>
						<p className="type-body-sm mt-5 hidden text-[12px] leading-5 text-vh-faint lg:block">
							We only use your details to contact you about VandyHacks, and never sell them.
						</p>
					</Arc>

					<Arc>
						{/* A browser window: each form is a tab in the title bar. Glass like
						    the rest of the page: a see-through, blurred base that reads
						    darkest in the title bar. The body and the active tab share
						    one light tint, so the selected tab still flows into its form. */}
						<div className="overflow-hidden rounded-xl border border-white/10 bg-vh-navy-950/35 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_20px_50px_rgb(0_0_0/0.3),0_0_40px_rgb(113_56_199/0.14)] backdrop-blur-md">
							<div className="flex items-end gap-3 bg-black/20 px-2 pt-2 sm:px-3">
								<div aria-hidden="true" className="mb-3 ml-1 hidden shrink-0 gap-2 sm:flex">
									<span className="size-3 rounded-full bg-[#ff5f57]" />
									<span className="size-3 rounded-full bg-[#febc2e]" />
									<span className="size-3 rounded-full bg-[#28c840]" />
								</div>
								<div role="tablist" aria-label="Ways to get involved" className="flex min-w-0 flex-1">
									{tabs.map((tab, index) => {
										const selected = tab.id === active.id;
										const divider =
											!selected && index < tabs.length - 1 && tabs[index + 1].id !== active.id;
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
												className={`group relative flex h-9 min-w-0 flex-auto items-center justify-start rounded-t-lg px-3 text-left font-sans text-[12px] transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-vh-purple-300 sm:max-w-[13rem] sm:text-[13px] lg:px-2.5 xl:px-4 ${
													selected ? "text-white" : "text-vh-muted hover:text-white"
												}`}
											>
												{selected ? (
													<motion.span
														layoutId={`${baseId}-active-tab`}
														aria-hidden="true"
														className="absolute inset-0 rounded-t-lg bg-white/[0.05]"
														transition={
															reducedMotion
																? { duration: 0 }
																: { type: "spring", stiffness: 520, damping: 40 }
														}
													/>
												) : (
													<span
														aria-hidden="true"
														className="absolute inset-x-1 top-1 bottom-1 rounded-md bg-white/0 transition-colors duration-150 group-hover:bg-white/[0.06]"
													/>
												)}
												<span className="relative truncate">{tab.label}</span>
												{divider && (
													<span aria-hidden="true" className="absolute top-1/2 right-0 h-4 w-px -translate-y-1/2 bg-white/12" />
												)}
											</button>
										);
									})}
								</div>
							</div>
							{/* All three panels stay mounted (hidden) so half-typed answers
							    and success messages survive switching tabs. */}
							<div className="bg-white/[0.05]">
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
												command={tab.command}
												active={selected}
											/>
										</div>
									);
								})}
							</div>
						</div>
						<p className="type-body-sm mt-4 text-[12px] leading-5 text-vh-faint lg:hidden">
							We only use your details to contact you about VandyHacks, and never sell them.
						</p>
					</Arc>
				</div>
			</SlideBody>
		</section>
	);
}
