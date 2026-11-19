"use client";

import { animate as motionAnimate, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Counter from "@/components/counter";
import { EVENT } from "@/lib/event";


const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// Progress bar range. The start is not shown on screen; the end is.
// Months are 0-indexed in JavaScript: 7 = August, 3 = April.
const BAR_START = new Date(2026, 2, 22).getTime(); // 03/22/26 ->last day of last year's Hackathon
const BAR_END = new Date(2027, 3, 9).getTime(); // 04/02/27 -> this year's Hackathon start date
const BAR_TOP_LABEL = `${EVENT.name} · ${EVENT.dateLabel}`;

function remainingParts(now: number) {
	const distance = Math.max(0, BAR_END - now);
	return {
		days: Math.floor(distance / DAY),
		hours: Math.floor((distance % DAY) / HOUR),
		minutes: Math.floor((distance % HOUR) / MINUTE),
		seconds: Math.floor((distance % MINUTE) / SECOND),
	};
}

function barProgress(now: number | null) {
	if (now === null) return 0;
	const ratio = (now - BAR_START) / (BAR_END - BAR_START);
	return Math.min(1, Math.max(0, ratio));
}

// `now` is null until mount, so the server and first client render match.
function useNow() {
	const [now, setNow] = useState<number | null>(null);
	useEffect(() => {
		const tick = () => setNow(Date.now());
		tick();
		const id = setInterval(tick, SECOND);
		return () => clearInterval(id);
	}, []);
	return now;
}

const unitClassName =
	"flex min-w-[clamp(36px,5vw,52px)] flex-col items-center";
const valueClassName =
	"flex h-[1.2em] items-center font-zen text-[clamp(18px,2.4vw,26px)] leading-none tracking-[-0.04em] text-white tabular-nums";

function Unit({
	label,
	value,
	digits,
	animate,
}: {
	label: string;
	value: number | null;
	digits: number;
	animate: boolean;
}) {
	const motionValue = useMotionValue(value ?? 0);
	useEffect(() => {
		if (value !== null) motionValue.set(value);
	}, [motionValue, value]);

	return (
		<div className={unitClassName}>
			<span className={valueClassName}>
				{value === null ? (
					"–".repeat(digits)
				) : animate ? (
					<Counter value={motionValue} max={10 ** digits - 1} />
				) : (
					String(value).padStart(digits, "0")
				)}
			</span>
			<span className="type-label mt-1 text-[12px] text-vh-text-soft">
				{label}
			</span>
		</div>
	);
}

function PlayerIcons({
	paused,
	onToggle,
}: {
	paused: boolean;
	onToggle: () => void;
}) {
	const iconClassName = "h-4 w-4 text-white/45";
	return (
		<div className="-mt-1 flex items-center justify-center gap-[clamp(22px,5vw,44px)] opacity-80">
			{/* Skip back */}
			<svg className={iconClassName} viewBox="0 0 24 24" fill="currentColor">
				<path d="M3 5h2v14H3z M13 5v14l-8-7z M22 5v14l-14-7z" />
			</svg>
			{/* Pause / play toggle */}
			<button
				type="button"
				onClick={onToggle}
				aria-label={paused ? "Resume countdown" : "Pause countdown"}
				className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
			>
				<svg className={iconClassName} viewBox="0 0 24 24" fill="currentColor">
					{paused ? (
						<path d="M7 4v16l13-8z" />
					) : (
						<path d="M6 4h4v16H6z M14 4h4v16h-4z" />
					)}
				</svg>
			</button>
			{/* Skip forward */}
			<svg className={iconClassName} viewBox="0 0 24 24" fill="currentColor">
				<path d="M19 5h2v14h-2z M11 5v14l8-7z M2 5v14l8-7z" />
			</svg>
		</div>
	);
}

function ProgressBar({
	target,
	intro,
	onScrub,
}: {
	target: number;
	intro: boolean;
	onScrub: (percent: number | null) => void;
}) {
	const [percent, setPercent] = useState(intro ? 0 : target);
	const [introDone, setIntroDone] = useState(!intro);
	const trackRef = useRef<HTMLDivElement>(null);
	const draggingRef = useRef(false);
	const percentRef = useRef(percent);
	percentRef.current = percent;
	const introRef = useRef<{ stop: () => void } | null>(null);
	const returnRef = useRef<{ stop: () => void } | null>(null);

	// One-time intro sweep.
	useEffect(() => {
		if (!intro) return;
		const controls = motionAnimate(0, target, {
			duration: 3.5,
			ease: [0.16, 1, 0.3, 1],
			delay: 0.4,
			onUpdate: (v) => setPercent(v),
			onComplete: () => setIntroDone(true),
		});
		introRef.current = controls;
		return () => controls.stop();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Follow the real position, unless the user is dragging.
	useEffect(() => {
		if (introDone && !draggingRef.current) setPercent(target);
	}, [target, introDone]);

	const update = (clientX: number) => {
		const track = trackRef.current;
		if (!track) return;
		const rect = track.getBoundingClientRect();
		const p = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
		setPercent(p);
		onScrub(p);
	};

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		introRef.current?.stop();
		returnRef.current?.stop();
		setIntroDone(true);
		draggingRef.current = true;
		e.currentTarget.setPointerCapture(e.pointerId);
		update(e.clientX);
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (draggingRef.current) update(e.clientX);
	};

	const endDrag = () => {
		if (!draggingRef.current) return;
		draggingRef.current = false;
		onScrub(null); // numbers go back to the real countdown
		returnRef.current = motionAnimate(percentRef.current, target, {
			duration: 0.8,
			ease: "easeOut",
			onUpdate: (v) => setPercent(v),
		});
	};

	return (
		<div
			ref={trackRef}
			className="relative flex h-6 cursor-grab touch-none select-none items-center active:cursor-grabbing"
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={endDrag}
			onPointerCancel={endDrag}
		>
			<div className="absolute inset-x-0 h-px bg-white/30" />
			<div
				className="absolute left-0 h-px bg-vh-purple-300"
				style={{ width: `${percent}%` }}
			/>
			<div
				className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgb(200_162_255/0.8)]"
				style={{ left: `${percent}%` }}
			/>
		</div>
	);
}

export default function EventCountdown() {
	const now = useNow();
	const reducedMotion = useReducedMotion();
	const [scrub, setScrub] = useState<number | null>(null);
	const [paused, setPaused] = useState(false);
	const [frozenNow, setFrozenNow] = useState<number | null>(null);
	const togglePause = () => {
		if (paused) {
			setPaused(false);
			setFrozenNow(null);
			document.documentElement.classList.remove("is-paused");
		} else {
			setFrozenNow(now);
			setPaused(true);
			document.documentElement.classList.add("is-paused");
		}
	};

	// Remove the freeze class if the component goes away.
	useEffect(() => {
		return () => document.documentElement.classList.remove("is-paused");
	}, []);

	if (now !== null && now >= BAR_END) {
		const live = now < EVENT.end.getTime();
		return (
			<p className="type-label text-center text-vh-purple-300">
				{live
					? `${EVENT.name} is happening now`
					: `Thanks for hacking with us at ${EVENT.name}`}
			</p>
		);
	}

	// While dragging, pretend "now" is the date under the dot.
	const liveNow = paused && frozenNow !== null ? frozenNow : now;
	const shownNow =
		scrub === null ? liveNow : BAR_START + (scrub / 100) * (BAR_END - BAR_START);
	const parts = shownNow === null ? null : remainingParts(shownNow);
	const dayDigits = Math.max(2, String(remainingParts(BAR_START).days).length);
	const animate = !reducedMotion;
	const percent = barProgress(liveNow) * 100;

	return (
		<div>
			<p className="sr-only">
				{EVENT.name} takes place {EVENT.dateLabel}.
			</p>
			<div
				className="mx-auto flex w-[min(82vw,26rem)] flex-col gap-3 rounded-xl border border-white/10 bg-vh-purple-300/30 px-[clamp(16px,3vw,28px)] py-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_0_24px_rgb(113_56_199/0.25)] backdrop-blur-md"
				aria-hidden="true"
			>
				<div className="mt-2 mb-1 flex items-start justify-center gap-[clamp(10px,2vw,20px)]">
					<Unit
						label="Days"
						value={parts?.days ?? null}
						digits={dayDigits}
						animate={animate}
					/>
					<Unit
						label="Hours"
						value={parts?.hours ?? null}
						digits={2}
						animate={animate}
					/>
					<Unit
						label="Mins"
						value={parts?.minutes ?? null}
						digits={2}
						animate={animate}
					/>
					<Unit
						label="Secs"
						value={parts?.seconds ?? null}
						digits={2}
						animate={animate}
					/>
				</div>
	
				{/* Message in between countdown and bar */}
				<div className="flex justify-center">
						<span className="type-label text-[13px] text-white">
							{BAR_TOP_LABEL}
						</span>
					</div>

				<div>
					{/* Progress bar */}
					{now !== null && (
						<ProgressBar target={percent} intro={animate} onScrub={setScrub} />
						)}
				</div>
				<PlayerIcons paused={paused} onToggle={togglePause} />
			</div>
		</div>
	);
}
