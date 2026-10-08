"use client";

import {
	motion,
	type MotionValue,
	useSpring,
	useTransform,
} from "motion/react";

// Rolling digit reels adapted from React Bits Counter:
// https://reactbits.dev/components/counter
function ReelNumber({
	value,
	digit,
}: {
	value: MotionValue<number>;
	digit: number;
}) {
	const y = useTransform(value, (latest) => {
		const offset = (10 + digit - (latest % 10)) % 10;
		return `${(offset > 5 ? offset - 10 : offset) * 100}%`;
	});

	return (
		<motion.span
			className="absolute inset-0 flex items-center justify-center"
			style={{ y }}
		>
			{digit}
		</motion.span>
	);
}

function Digit({
	value,
	place,
}: {
	value: MotionValue<number>;
	place: number;
}) {
	const target = useTransform(value, (latest) => Math.floor(latest / place));
	const animated = useSpring(target, { stiffness: 180, damping: 28 });

	return (
		<span className="relative inline-block h-[1.2em] w-[1ch]">
			{Array.from({ length: 10 }, (_, digit) => (
				<ReelNumber key={digit} value={animated} digit={digit} />
			))}
		</span>
	);
}

export default function Counter({
	value,
	max,
}: {
	value: MotionValue<number>;
	max: number;
}) {
	const characters = max.toLocaleString("en-US").split("");
	let remaining = String(max).length;

	return (
		<span
			className="inline-flex overflow-hidden leading-none tabular-nums"
			aria-hidden="true"
		>
			{characters.map((character, index) =>
				character === "," ? (
					<span key={index} className="flex h-[1.2em] items-center">
						,
					</span>
				) : (
					<Digit
						key={index}
						value={value}
						place={10 ** --remaining}
					/>
				),
			)}
		</span>
	);
}
