"use client";

import { useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Counter from "@/components/counter";
import { EVENT } from "@/lib/event";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function remainingParts(now: number) {
	const distance = Math.max(0, EVENT.start.getTime() - now);
	return {
		days: Math.floor(distance / DAY),
		hours: Math.floor((distance % DAY) / HOUR),
		minutes: Math.floor((distance % HOUR) / MINUTE),
		seconds: Math.floor((distance % MINUTE) / SECOND),
	};
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
	"flex min-w-[clamp(64px,9vw,104px)] flex-col items-center rounded-xl border border-white/10 bg-vh-navy-800/70 px-3 py-3 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_0_24px_rgb(113_56_199/0.25)] backdrop-blur-md sm:px-4";
const valueClassName =
	"flex h-[1.2em] items-center font-heading text-[clamp(24px,3.6vw,44px)] leading-none tracking-[-0.04em] text-white tabular-nums";

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
			<span className="type-label mt-2 text-[10px] text-vh-muted">
				{label}
			</span>
		</div>
	);
}

export default function EventCountdown() {
	const now = useNow();
	const reducedMotion = useReducedMotion();

	if (now !== null && now >= EVENT.start.getTime()) {
		const live = now < EVENT.end.getTime();
		return (
			<p className="type-label text-center text-vh-purple-300">
				{live
					? `${EVENT.name} is happening now`
					: `Thanks for hacking with us at ${EVENT.name}`}
			</p>
		);
	}

	const parts = now === null ? null : remainingParts(now);
	// Size the day reel to the starting count (e.g. 3 digits at 167 days).
	const dayDigits = Math.max(2, String(parts?.days ?? 0).length);
	const animate = !reducedMotion;

	return (
		<div>
			<p className="sr-only">
				{EVENT.name} takes place {EVENT.dateLabel}.
			</p>
			<div
				className="flex items-start justify-center gap-[clamp(8px,1.5vw,16px)]"
				aria-hidden="true"
			>
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
		</div>
	);
}
