"use client";

import { ArrowUpRight } from "lucide-react";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useTransform,
} from "motion/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { type Hackathon, hackathons } from "@/lib/hackathons";
import { SlideBody, SlideHeading } from "@/components/vinyl/slides";
import { useMediaQuery } from "@/components/vinyl/stage";

const milestones = [...hackathons].reverse().map((event) => ({
	edition: event.edition,
	event,
}));

// Record's right rim ≈ 0.35 × viewport-height (see stage-record.tsx geometry);
// the clef and staff lines start here so they flow out of the vinyl.
const RECORD_RIM_RATIO = 0.35;
// Pinned-runway scroll length as a multiple of the horizontal travel; higher
// makes the notes move slower per unit of scroll.
const SCROLL_SPAN = 1;

const NOTE_OFFSETS = [0, 56, -32, 32, -16, 72];
const NOTE_COLORS = ["#c8a2ff", "#9dbbff", "#e7b8ee"];

export default function HistorySlide() {
	const runwayRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const railRef = useRef<HTMLOListElement>(null);
	const staffRef = useRef<HTMLDivElement>(null);
	const reducedMotion = useReducedMotion();
	// Pinning drives the scroll-linked timeline; `fitsViewport` falls back to
	// native horizontal scroll when the content can't fit.
	const hasRoomToPin = useMediaQuery(
		"(min-width: 768px) and (min-height: 560px), (min-height: 800px)",
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
			const staff = staffRef.current;
			if (staff) {
				const staffLeft = staff.getBoundingClientRect().left;
				const rimX = RECORD_RIM_RATIO * window.innerHeight;
				// Pull the clef to the rim and anchor the lines to the screen's
				// left edge so they run behind the vinyl (desktop only).
				const overhang =
					window.innerWidth >= 1024
						? Math.max(0, staffLeft - rimX)
						: 0;
				staff.style.setProperty("--staff-overhang", `${overhang}px`);
				staff.style.setProperty(
					"--staff-left",
					`${Math.max(0, staffLeft)}px`,
				);
			}
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
		window.addEventListener("resize", measure);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
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
			| HTMLElement
			| undefined;
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
								height: `calc(100svh + ${Math.round(travel * SCROLL_SPAN)}px)`,
							}
						: undefined
				}
			>
				<div className="impact-sticky">
					<SlideBody fit className="impact-slide history-slide">
						<SlideHeading id="history-title">
							Past Editions
						</SlideHeading>
						<div className="impact-history">
							<div ref={staffRef} className="history-staff">
								<div
									className="history-lines"
									aria-hidden="true"
								/>
								<motion.div
									className="history-clef"
									aria-hidden="true"
									style={pinned ? { x } : undefined}
								>
									<span>𝄞</span>
								</motion.div>
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
											<Milestone
												key={chapter.edition}
												event={chapter.event}
												index={index}
												pinned={pinned}
												active={active}
												goToChapter={goToChapter}
											/>
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

function Milestone({
	event,
	index,
	pinned,
	active,
	goToChapter,
}: {
	event: Hackathon;
	index: number;
	pinned: boolean;
	active: number;
	goToChapter: (index: number) => void;
}) {
	return (
		<li
			className="history-note"
			style={
				{
					"--note-offset": `${NOTE_OFFSETS[index % 6]}px`,
					"--note-color": NOTE_COLORS[index % 3],
				} as CSSProperties
			}
		>
			<a
				className="history-note-link"
				href={event.devpost}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`VandyHacks ${event.edition}, ${event.year} — view on Devpost (opens in a new tab)`}
				onFocus={() => {
					if (pinned && index !== active) goToChapter(index);
				}}
			>
				<span className="history-note-art">
					<HistoryArtwork event={event} />
					<span className="history-note-flag">{event.edition}</span>
					<ArrowUpRight
						className="history-note-open"
						size={20}
						aria-hidden="true"
					/>
				</span>
				<span className="history-note-year">{event.year}</span>
			</a>
		</li>
	);
}

// Zoom for editions whose artwork has wide empty margins around the mark.
const ART_SCALE: Record<string, number> = { I: 1.45, II: 1.3, XII: 1.7 };

function HistoryArtwork({ event }: { event: Hackathon }) {
	const [failed, setFailed] = useState(false);
	const artwork = !failed && event.artwork ? event.artwork : null;
	const scale = artwork ? (ART_SCALE[event.edition] ?? 1) : 1;
	// White backing for artwork designed on white (keeps transparent areas white).
	const lightBg = artwork != null && event.artworkLightBackground;
	return (
		<span
			className="history-artwork-clip"
			style={lightBg ? { backgroundColor: "white" } : undefined}
		>
			<Image
				src={artwork ?? "/logo-trimmed.png"}
				alt=""
				fill
				sizes="(max-width:767px) 132px, 164px"
				className="history-artwork"
				style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
				onError={() => {
					if (!failed) setFailed(true);
				}}
			/>
		</span>
	);
}
