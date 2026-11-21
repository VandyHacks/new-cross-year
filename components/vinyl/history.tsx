"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { hackathons } from "@/lib/hackathons";
import { SlideBody, SlideHeading } from "@/components/vinyl/slides";
import { useMediaQuery } from "@/components/vinyl/stage";

const milestones = [...hackathons].reverse().map((event) => ({
	edition: event.edition,
	event,
}));

export default function HistorySlide() {
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
		if (viewportRef.current) viewportRef.current.scrollLeft = 0;
	}, [pinned, travel]);

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
				left: (travel * index) / (milestones.length - 1),
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
		<section id="history" aria-labelledby="history-title">
			<div
				ref={runwayRef}
				className={`impact-runway${pinned ? " impact-runway-pinned" : ""}`}
				style={
					pinned
						? {
								height: `calc(100svh + ${Math.round(travel * 0.65)}px)`,
							}
						: undefined
				}
			>
				<div className="impact-sticky">
					<SlideBody fit className="impact-slide history-slide">
						<SlideHeading
							id="history-title"
							wrapperClassName="mb-5"
						>
							History
						</SlideHeading>
						<div className="impact-history">
							<p className="history-intro">
								Every year, a new sound.{" "}
								<span>The same spirit of building.</span>
							</p>
							<div className="impact-scroll-toolbar">
								<p>
									{pinned
										? "Scroll down to play through the years"
										: "Swipe through the years"}
									<ArrowDown size={14} aria-hidden="true" />
								</p>
								<a href="#sponsors">
									Skip history{" "}
									<ArrowDown size={12} aria-hidden="true" />
								</a>
							</div>
							<div className="history-staff">
								<div
									className="history-clef"
									aria-hidden="true"
								>
									<span>𝄞</span>
									<span className="history-time">
										4<br />4
									</span>
								</div>
								<div
									ref={viewportRef}
									className="impact-scroll-viewport history-viewport"
									onScroll={onNativeScroll}
									aria-label="Past VandyHacks editions"
									tabIndex={pinned ? -1 : 0}
								>
									<motion.ol
										ref={railRef}
										className="history-score"
										style={pinned ? { x } : undefined}
									>
										{milestones.map((chapter, index) => (
											<li
												key={chapter.edition}
												className="history-note"
												style={
													{
														"--note-offset":
															[
																0, 56, -32, 32,
																-16, 72,
															][index % 6] + "px",
														"--note-color": [
															"#c8a2ff",
															"#9dbbff",
															"#e7b8ee",
														][index % 3],
													} as CSSProperties
												}
											>
												<a
													className="history-note-link"
													href={chapter.event.devpost}
													target="_blank"
													rel="noopener noreferrer"
													aria-label={`VandyHacks ${chapter.edition}, ${chapter.event.year} — view on Devpost (opens in a new tab)`}
													onFocus={() => {
														if (
															pinned &&
															index !== active
														)
															goToChapter(index);
													}}
												>
													<span className="history-note-art">
														<HistoryArtwork
															event={
																chapter.event
															}
														/>
														<ArrowUpRight
															className="history-note-open"
															size={20}
															aria-hidden="true"
														/>
													</span>
													<span className="history-note-year">
														{chapter.event.year}
													</span>
													<span className="history-note-edition">
														VandyHacks{" "}
														{chapter.edition}
													</span>
													{chapter.event.year ===
														2015 && (
														<span className="history-note-season">
															{chapter.edition ===
															"I"
																? "Spring"
																: "Fall"}
														</span>
													)}
												</a>
											</li>
										))}
									</motion.ol>
								</div>
							</div>
						</div>
					</SlideBody>
				</div>
			</div>
		</section>
	);
}
function HistoryArtwork({ event }: { event: (typeof hackathons)[number] }) {
	const [failed, setFailed] = useState(false);
	return (
		<Image
			src={failed || !event.artwork ? "/logo-trimmed.png" : event.artwork}
			alt=""
			fill
			sizes="(max-width:767px) 132px, 164px"
			className="history-artwork"
			style={
				event.artworkLightBackground && event.artwork && !failed
					? { backgroundColor: "white" }
					: undefined
			}
			onError={() => {
				if (!failed) setFailed(true);
			}}
		/>
	);
}
