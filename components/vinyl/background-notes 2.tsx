// Ambient background: a fixed field of the same floating music notes used on the
// Home hero (reusing the `.music-note` class — colour, glow, and `note-float`
// animation), shown behind every section in place of the old twinkling dots.

const DOUBLE = "M9 3v10.55A4 4 0 1 0 11 17V7h8v6.55A4 4 0 1 0 21 17V3H9z";
const SINGLE = "M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z";

// Stable positions (module-level so they don't re-randomise between renders).
// left/top in %, size in px, delay in s, and which glyph.
const NOTES: { left: number; top: number; size: number; delay: number; glyph: string }[] = [
	{ left: 6, top: 18, size: 26, delay: 0, glyph: DOUBLE },
	{ left: 14, top: 62, size: 22, delay: 3.5, glyph: SINGLE },
	{ left: 23, top: 34, size: 30, delay: 1.5, glyph: SINGLE },
	{ left: 31, top: 78, size: 24, delay: 5, glyph: DOUBLE },
	{ left: 39, top: 12, size: 20, delay: 2.5, glyph: SINGLE },
	{ left: 47, top: 54, size: 32, delay: 0.8, glyph: DOUBLE },
	{ left: 55, top: 24, size: 24, delay: 4.2, glyph: SINGLE },
	{ left: 63, top: 70, size: 28, delay: 1.2, glyph: DOUBLE },
	{ left: 71, top: 16, size: 22, delay: 6, glyph: SINGLE },
	{ left: 78, top: 48, size: 34, delay: 2, glyph: DOUBLE },
	{ left: 85, top: 80, size: 24, delay: 3, glyph: SINGLE },
	{ left: 90, top: 30, size: 28, delay: 0.4, glyph: DOUBLE },
	{ left: 96, top: 60, size: 22, delay: 4.8, glyph: SINGLE },
	{ left: 19, top: 90, size: 26, delay: 2.8, glyph: DOUBLE },
	{ left: 50, top: 88, size: 22, delay: 5.6, glyph: SINGLE },
	{ left: 67, top: 40, size: 20, delay: 3.8, glyph: SINGLE },
];

export default function BackgroundNotes() {
	return (
		// Negative z keeps the field above the page's background gradient but
		// behind all section content; group opacity keeps it subtle. The notes
		// themselves keep their existing design and float animation.
		<div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-45" aria-hidden="true">
			{NOTES.map((n, i) => (
				<svg
					key={i}
					className="music-note"
					style={{
						left: `${n.left}%`,
						top: `${n.top}%`,
						width: n.size,
						height: n.size,
						animationDelay: `${n.delay}s`,
						// Softer glow than the hero's own notes (inline overrides the
						// stronger drop-shadow on .music-note).
						filter: "drop-shadow(0 0 4px rgb(200 162 255 / 0.25))",
					}}
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d={n.glyph} />
				</svg>
			))}
		</div>
	);
}
