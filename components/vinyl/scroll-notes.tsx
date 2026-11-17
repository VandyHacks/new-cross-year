"use client";

import { useMotionValueEvent } from "motion/react";
import { useRef, useState } from "react";
import { useStage } from "@/components/vinyl/stage";

type Note = { id: number; top: number; dx: number; dy: number; rot: number; size: number; glyph: string };

const GLYPHS = ["♪", "♫", "♬"];
const STEP = 0.2; // stage progress needed per note (smaller = more notes)

export default function ScrollNotes() {
	const { smooth } = useStage();
	const [notes, setNotes] = useState<Note[]>([]);
	const last = useRef<number | null>(null);
	const travelled = useRef(0);
	const nextId = useRef(0);

	useMotionValueEvent(smooth, "change", (p) => {
        if (document.documentElement.classList.contains("is-paused")) {
		    last.current = p; // keep tracking so no burst spawns on resume
		    return;
	    }
		if (last.current === null) {
			last.current = p;
			return;
		}
		travelled.current += Math.abs(p - last.current);
		last.current = p;
		while (travelled.current >= STEP) {
			travelled.current -= STEP;
			const note: Note = {
				id: nextId.current++,
				top: Math.random() < 0.5
	                ? 5 + Math.random() * 30   // top band: 10% to 50% of the screen
	                : 55 + Math.random() * 30, // bottom band: 55% to 90%
				dx: 30 + Math.random() * 20, 
				dy: -30 + Math.random() * 80, 
				rot: -30 + Math.random() * 60,
				size: 20 + Math.random() * 20,
				glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
			};
			setNotes((n) => [...n.slice(-4), note]);
		}
	});

	return (
		<div aria-hidden="true">
			{notes.map((n) => (
				<span
					key={n.id}
					className="scroll-note"
					style={
						{
							top: `${n.top}%`,
							fontSize: `${n.size}px`,
							"--dx": `${n.dx}vw`,
							"--dy": `${n.dy}px`,
							"--rot": `${n.rot}deg`,
						} as React.CSSProperties
					}
					onAnimationEnd={() => setNotes((l) => l.filter((x) => x.id !== n.id))}
				>
					{n.glyph}
				</span>
			))}
		</div>
	);
}
