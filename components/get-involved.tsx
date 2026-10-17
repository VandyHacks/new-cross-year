"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import FormPanel from "@/components/forms/form-panel";
import SectionContainer from "@/components/section-container";
import SectionTitle from "@/components/section-title";
import { interestFields, judgeFields, sponsorFields } from "@/lib/forms/fields";
import {
	submitInterest,
	submitJudge,
	submitSponsor,
} from "@/lib/forms/actions";

const tabs = [
	{
		id: "interest",
		label: "Stay in the loop",
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
		submitLabel: "Start the conversation",
		fields: sponsorFields,
		action: submitSponsor,
	},
] as const;

type TabId = (typeof tabs)[number]["id"];

const HASH_PATTERN = /^#get-involved(?:\/(interest|judge|sponsor))?$/;

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
		apply();
		window.addEventListener("hashchange", apply);
		return () => window.removeEventListener("hashchange", apply);
	}, [reducedMotion]);

	const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

	return (
		<section
			id="get-involved"
			className="relative z-10 scroll-mt-20 py-[clamp(48px,7vw,88px)]"
			aria-labelledby="get-involved-title"
		>
			<SectionContainer>
				<SectionTitle id="get-involved-title">
					Get Involved
				</SectionTitle>
				<div
					role="tablist"
					aria-label="Ways to get involved"
					className="mb-8 flex flex-wrap gap-2"
				>
					{tabs.map((tab) => {
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
									const step =
										event.key === "ArrowRight"
											? 1
											: event.key === "ArrowLeft"
												? -1
												: 0;
									if (!step) return;
									event.preventDefault();
									const index = tabs.findIndex(
										(item) => item.id === active.id,
									);
									const next =
										tabs[
											(index + step + tabs.length) %
												tabs.length
										];
									setActiveId(next.id);
									document
										.getElementById(
											`${baseId}-tab-${next.id}`,
										)
										?.focus();
								}}
								className={`type-button rounded-full border px-4 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 ${
									selected
										? "border-vh-purple-300 bg-vh-purple-700/30 text-white shadow-[0_0_18px_rgb(113_56_199/0.45)]"
										: "border-white/15 text-vh-muted hover:border-vh-purple-300/60 hover:text-white"
								}`}
							>
								{tab.label}
							</button>
						);
					})}
				</div>

				{/* All three panels stay mounted (hidden) so half-typed answers and
				    success messages survive switching tabs. */}
				{tabs.map((tab) => {
					const selected = tab.id === active.id;
					return (
						<div
							key={tab.id}
							role="tabpanel"
							id={`${baseId}-panel-${tab.id}`}
							aria-labelledby={`${baseId}-tab-${tab.id}`}
							hidden={!selected}
							className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-[clamp(32px,5vw,72px)]"
						>
							<div>
								<h3 className="type-heading text-white">
									{tab.heading}
								</h3>
								<p className="type-body mt-4 text-vh-muted">
									{tab.blurb}
								</p>
							</div>
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
			</SectionContainer>
		</section>
	);
}
