"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CTA } from "@/lib/event";
import { hackathons, hackathonTotals } from "@/lib/hackathons";
import { SlideBody, SlideHeading } from "@/components/vinyl/slides";
import { useMediaQuery } from "@/components/vinyl/stage";

const milestones = [
	{
		edition: "I",
		label: "The beginning",
		title: "Every tradition starts with an idea.",
		story: "In spring 2015, student builders came together in Nashville. Their 35 projects started a tradition of turning big ideas into something real.",
	},
	{
		edition: "V",
		label: "Our biggest showcase",
		title: "More ideas coming to life.",
		story: "By our fifth edition, the showcase had grown to 96 projects—nearly three times our first. Our largest project gallery yet.",
	},
	{
		edition: "VI",
		label: "Code a Masterpiece",
		title: "A little art. A lot of possibility.",
		story: "The Art Edition celebrated the creative side of technology, with ideas in sustainability, financial literacy, and hardware at The Wond’ry.",
	},
	{
		edition: "VII",
		label: "Going virtual",
		title: "Creativity found a way to connect.",
		story: "Our Retro Edition took the hackathon online in 2020. Builders kept collaborating, experimenting, and sharing their ideas—even from afar.",
	},
	{
		edition: "IX",
		label: "Back on campus",
		title: "Nothing quite like building together.",
		story: "In 2022, we returned in person to Vanderbilt’s Engineering and Science Building, welcoming first-time hackers and environmentally friendly ideas.",
	},
	{
		edition: "XII",
		label: "A new spring chapter",
		title: "The story keeps growing.",
		story: "Our twelfth edition returned in spring 2026, with tracks in healthcare, startup ideas, and AI. Next up: your ideas at XIII.",
	},
].map((milestone) => ({
	...milestone,
	event: hackathons.find((event) => event.edition === milestone.edition)!,
}));

export default function ImpactSlide() {
	const runwayRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const railRef = useRef<HTMLOListElement>(null);
	const reducedMotion = useReducedMotion();
	const hasRoomToPin = useMediaQuery(
		"(min-width: 768px) and (min-height: 700px), (min-height: 800px)",
	);
	const [fitsViewport, setFitsViewport] = useState(true);
	const pinned = hasRoomToPin && fitsViewport && !reducedMotion;
	const [travel, setTravel] = useState(0);
	const [active, setActive] = useState(0);
	const { scrollYProgress } = useScroll({
		target: runwayRef,
		offset: ["start start", "end end"],
	});
	const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
	const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

	useEffect(() => {
		const viewport = viewportRef.current;
		const rail = railRef.current;
		if (!viewport || !rail) return;
		const frame =
			runwayRef.current?.querySelector<HTMLElement>(".impact-slide");
		const content = frame?.firstElementChild as HTMLElement | null;
		const measure = () => {
			setTravel(Math.max(0, rail.scrollWidth - viewport.clientWidth));
			if (frame && content) {
				const topPadding = Number.parseFloat(
					getComputedStyle(frame).paddingTop,
				);
				setFitsViewport(
					content.offsetHeight + topPadding + 8 <= window.innerHeight,
				);
			}
		};
		const observer = new ResizeObserver(measure);
		observer.observe(viewport);
		observer.observe(rail);
		if (content) observer.observe(content);
		measure();
		return () => observer.disconnect();
	}, []);

	// CSS changes the rail between native horizontal overflow and a transform.
	useEffect(() => {
		if (pinned && viewportRef.current) viewportRef.current.scrollLeft = 0;
	}, [pinned]);

	useMotionValueEvent(scrollYProgress, "change", (value) => {
		if (pinned) setActive(Math.round(value * (milestones.length - 1)));
	});

	function goToChapter(index: number) {
		const runway = runwayRef.current;
		const viewport = viewportRef.current;
		const chapter = railRef.current?.children[index] as
			HTMLElement | undefined;
		if (!runway || !viewport || !chapter) return;
		const behavior = reducedMotion ? "instant" : "smooth";
		if (pinned) {
			const top = runway.getBoundingClientRect().top + window.scrollY;
			const distance = runway.offsetHeight - window.innerHeight;
			window.scrollTo({
				top: top + (distance * index) / (milestones.length - 1),
				behavior,
			});
		} else {
			viewport.scrollTo({
				left: Math.min(chapter.offsetLeft, travel),
				behavior,
			});
			setActive(index);
		}
	}

	function onNativeScroll() {
		if (pinned || !viewportRef.current || !travel) return;
		setActive(
			Math.round(
				(viewportRef.current.scrollLeft / travel) *
					(milestones.length - 1),
			),
		);
	}

	return (
		<section id="impact" aria-labelledby="impact-title">
			<div
				ref={runwayRef}
				className={`impact-runway${pinned ? " impact-runway-pinned" : ""}`}
				style={
					pinned
						? {
								height: `calc(100svh + ${Math.round(travel * 0.85)}px)`,
							}
						: undefined
				}
			>
				<div className="impact-sticky">
					<SlideBody fit className="impact-slide">
						<SlideHeading id="impact-title" wrapperClassName="mb-5">
							Impact
						</SlideHeading>
						<div className="impact-history">
							<p className="impact-intro">
								A decade of building <span>what’s next.</span>
							</p>
							<p className="impact-community">
								<strong>
									{hackathonTotals.editions} editions.
								</strong>{" "}
								<strong>
									{hackathonTotals.projects} projects.
								</strong>{" "}
								A community that keeps creating.
							</p>
							<div className="impact-scroll-toolbar">
								<p>
									{pinned
										? "Scroll down. Travel through our story."
										: "Swipe through our story."}{" "}
									<ArrowDown size={14} aria-hidden="true" />
								</p>
								<a href="#sponsors">
									Skip history{" "}
									<ArrowDown size={12} aria-hidden="true" />
								</a>
							</div>
							<div
								ref={viewportRef}
								className="impact-scroll-viewport"
								onScroll={onNativeScroll}
								aria-label="VandyHacks history highlights"
								tabIndex={pinned ? -1 : 0}
							>
								<motion.ol
									ref={railRef}
									className="impact-scroll-rail"
									style={pinned ? { x } : undefined}
								>
									{milestones.map((chapter, index) => (
										<li
											key={chapter.edition}
											className={`impact-scroll-chapter${index === active ? " is-current" : ""}`}
										>
											<div
												className="impact-chapter-year"
												aria-hidden="true"
											>
												{chapter.event.year}
											</div>
											<div
												className="impact-chapter-rule"
												aria-hidden="true"
											>
												<span />
											</div>
											<article
												aria-labelledby={`history-chapter-${chapter.edition}`}
											>
												<p className="impact-chapter-label">
													{chapter.label}{" "}
													<span>
														· {chapter.edition}
													</span>
												</p>
												<h3
													id={`history-chapter-${chapter.edition}`}
												>
													<span className="sr-only">
														{chapter.event.year}
														:{" "}
													</span>
													{chapter.title}
												</h3>
												<p className="impact-chapter-story">
													{chapter.story}
												</p>
												{chapter.edition === "V" && (
													<figure
														className="impact-growth-chart"
														aria-label="Project submissions: 35 at our first edition in 2015, 96 at our largest showcase in 2018."
													>
														<div className="impact-growth-row">
															<span>2015</span>
															<div>
																<span
																	style={{
																		width: `${(hackathons[0].projects / chapter.event.projects) * 100}%`,
																	}}
																/>
															</div>
															<strong>
																{
																	hackathons[0]
																		.projects
																}
															</strong>
														</div>
														<div className="impact-growth-row impact-growth-peak">
															<span>2018</span>
															<div>
																<span
																	style={{
																		width: "100%",
																	}}
																/>
															</div>
															<strong>
																{
																	chapter
																		.event
																		.projects
																}
															</strong>
														</div>
														<figcaption>
															Projects at our
															first and largest
															showcases.
														</figcaption>
													</figure>
												)}
												<a
													className="impact-project-link"
													href={`${chapter.event.devpost}project-gallery`}
													target="_blank"
													rel="noopener noreferrer"
													tabIndex={
														pinned &&
														index !== active
															? -1
															: 0
													}
													aria-label={`Explore VandyHacks ${chapter.edition} projects on Devpost (opens in a new tab)`}
												>
													Explore the projects{" "}
													<ArrowUpRight
														size={15}
														aria-hidden="true"
													/>
												</a>
											</article>
										</li>
									))}
								</motion.ol>
							</div>
							<div className="impact-scroll-footer">
								<nav
									className="impact-chapter-navigation"
									aria-label="History chapters"
								>
									<button
										type="button"
										aria-label="Previous history chapter"
										disabled={active === 0}
										onClick={() => goToChapter(active - 1)}
									>
										<ArrowLeft
											size={17}
											aria-hidden="true"
										/>
									</button>
									<div className="impact-chapter-dots">
										{milestones.map((chapter, index) => (
											<button
												type="button"
												key={chapter.edition}
												aria-label={`Go to ${chapter.event.year}: ${chapter.label}`}
												aria-current={
													active === index
														? "step"
														: undefined
												}
												onClick={() =>
													goToChapter(index)
												}
											>
												<span />
											</button>
										))}
									</div>
									<button
										type="button"
										aria-label="Next history chapter"
										disabled={
											active === milestones.length - 1
										}
										onClick={() => goToChapter(active + 1)}
									>
										<ArrowRight
											size={17}
											aria-hidden="true"
										/>
									</button>
								</nav>
								<span
									className="impact-chapter-position"
									aria-hidden="true"
								>
									{String(active + 1).padStart(2, "0")} / 06
								</span>
							</div>
							<div
								className="impact-scroll-progress"
								aria-hidden="true"
							>
								<motion.div
									style={
										pinned
											? { scaleX: progressScale }
											: {
													scaleX:
														active /
														(milestones.length - 1),
												}
									}
								/>
							</div>
							<div className="impact-history-end">
								<p>Selected highlights · 2015–2026</p>
								<a href={CTA.interest}>
									Your chapter is next.{" "}
									<span>
										Join us at XIII{" "}
										<ArrowRight
											size={15}
											aria-hidden="true"
										/>
									</span>
								</a>
							</div>
							<p className="sr-only" role="status">
								{milestones[active].event.year}:{" "}
								{milestones[active].label}
							</p>
						</div>
					</SlideBody>
				</div>
			</div>
		</section>
	);
}
