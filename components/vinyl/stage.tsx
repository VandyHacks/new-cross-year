"use client";

import {
	animate,
	type MotionValue,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	useSpring,
} from "motion/react";
import {
	createContext,
	type ReactNode,
	useContext,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";

// Slides in page order. The ones with a `label` sit on the vinyl record's
// label ring; the footer is the record player the record lands on at the end
// of the page, so it has no label.
export const SLIDES = [
	{ key: "home", label: "Home" },
	{ key: "about", label: "About" },
	{ key: "impact", label: "Impact" },
	{ key: "sponsors", label: "Sponsors" },
	{ key: "get-involved", label: "Sign Up" },
	{ key: "faq", label: "FAQ" },
	{ key: "team", label: "Team" },
	{ key: "footer" },
] as const;

export type SlideKey = (typeof SLIDES)[number]["key"];

export const FOOTER_INDEX = SLIDES.findIndex((s) => s.key === "footer");

// Desktop gets the big pinned record and settling onto slides; below this the
// record shrinks into the header (see MiniRecord in the header).
export const DESKTOP_QUERY = "(min-width: 1024px)";

type StageValue = {
	/** Continuous slide index: 2.5 = halfway from slide 2 to slide 3. */
	progress: MotionValue<number>;
	/** `progress`, spring-smoothed for things that rotate or fly. */
	smooth: MotionValue<number>;
	/** Index of the slide that currently owns the screen. */
	active: number;
	desktop: boolean;
	/** Record rotation (deg), shared so the turntable's disc picks up where
	 * the pinned record left off. */
	spin: MotionValue<number>;
};

const StageContext = createContext<StageValue | null>(null);

export function useStage() {
	const value = useContext(StageContext);
	if (!value) throw new Error("useStage must be used inside <VinylStage>");
	return value;
}

export function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const list = window.matchMedia(query);
		const update = () => setMatches(list.matches);
		update();
		list.addEventListener("change", update);
		return () => list.removeEventListener("change", update);
	}, [query]);
	return matches;
}

// Slides taller than the viewport (FAQ, Get Involved) hold their index while
// they scroll, then hand over to the next slide during the final viewport of
// travel, so the record only turns while a new slide is coming into view.
function progressAt(y: number, vh: number, tops: number[], heights: number[]) {
	for (let i = 0; i < tops.length - 1; i++) {
		if (y < tops[i + 1]) {
			const handover = tops[i] + heights[i] - vh;
			const span = Math.max(1, tops[i + 1] - handover);
			return i + Math.min(1, Math.max(0, (y - handover) / span));
		}
	}
	return tops.length - 1;
}

const GLIDE_EASE = [0.65, 0, 0.35, 1] as const;
const SETTLE_EASE = [0.33, 1, 0.68, 1] as const;
// Only settle when the resting position is this close (in viewport heights)
// to a slide edge; anywhere else the page stays exactly where it was left.
const SETTLE_ZONE = 0.22;

/** Fired with the Sign Up tab id when a deep link like #get-involved/judge
 * is followed; components/get-involved.tsx switches tabs on it. */
export const TAB_EVENT = "vinyl:get-involved-tab";

function slideForHash(hash: string): SlideKey | null {
	const id = hash.slice(1).split("/")[0];
	return SLIDES.find((s) => s.key === id)?.key ?? null;
}

// One owner for every programmatic scroll, so nothing competes:
// - In-page links (#about, #get-involved/judge, …) glide to the exact top of
//   their slide. A click mid-glide retargets from wherever the page is, so
//   rapid clicking always ends on the last section clicked.
// - Wheel, touch and keys stay fully native (the way Apple's product pages
//   work) and instantly cancel any glide.
// - On desktop, once native scrolling fully stops just past a slide edge, the
//   page settles onto it.
function useScrollDirector(
	bounds: RefObject<{ tops: number[]; heights: number[] }>,
	{ desktop, reducedMotion }: { desktop: boolean; reducedMotion: boolean },
) {
	useEffect(() => {
		let stop: (() => void) | undefined;
		let gliding = false;
		let timer: number | undefined;

		const cancel = () => {
			window.clearTimeout(timer);
			stop?.();
			stop = undefined;
			gliding = false;
		};

		const glide = (
			to: number,
			duration: number,
			ease: readonly [number, number, number, number],
		) => {
			cancel();
			if (reducedMotion) {
				window.scrollTo({ top: to, behavior: "instant" });
				return;
			}
			gliding = true;
			const controls = animate(window.scrollY, to, {
				duration,
				ease,
				onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
				onComplete: () => {
					gliding = false;
				},
			});
			stop = () => controls.stop();
		};

		const onClick = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			const link = (event.target as Element).closest?.("a[href^='#']");
			if (!(link instanceof HTMLAnchorElement)) return;
			const key = slideForHash(link.hash);
			const slide = key && slideElement(key);
			if (!slide) return;
			event.preventDefault();
			history.pushState(null, "", link.hash);
			const tab = link.hash.split("/")[1];
			if (key === "get-involved" && tab) {
				window.dispatchEvent(new CustomEvent(TAB_EVENT, { detail: tab }));
			}
			const to = slide.getBoundingClientRect().top + window.scrollY;
			const distance = Math.abs(to - window.scrollY) / window.innerHeight;
			glide(to, Math.min(1.4, 0.55 + distance * 0.12), GLIDE_EASE);
		};

		const settle = () => {
			if (!desktop || gliding) return;
			const { tops, heights } = bounds.current;
			const y = window.scrollY;
			const vh = window.innerHeight;
			const i = tops.findLastIndex((top) => top <= y + 1);
			if (i < 0 || i + 1 >= tops.length) return;
			// The resting range of slide i ends when its bottom meets the
			// viewport bottom; past that, slide i + 1 is partly in view.
			const end = tops[i] + Math.max(0, heights[i] - vh);
			const next = tops[i + 1];
			if (y <= end + 1 || y >= next - 1) return;
			const target =
				y - end < SETTLE_ZONE * vh ? end : next - y < SETTLE_ZONE * vh ? next : null;
			if (target !== null) glide(target, 0.55, SETTLE_EASE);
		};

		// `scrollend` fires after momentum finishes; the short delay lets a
		// user who is still mid-gesture keep going without being pulled.
		const onScrollEnd = () => {
			if (gliding) return;
			window.clearTimeout(timer);
			timer = window.setTimeout(settle, 120);
		};

		const inputs = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
		for (const type of inputs) {
			window.addEventListener(type, cancel, { passive: true });
		}
		document.addEventListener("click", onClick);
		window.addEventListener("scrollend", onScrollEnd);
		return () => {
			cancel();
			for (const type of inputs) window.removeEventListener(type, cancel);
			document.removeEventListener("click", onClick);
			window.removeEventListener("scrollend", onScrollEnd);
		};
	}, [bounds, desktop, reducedMotion]);
}

export function slideElement(key: SlideKey) {
	return document.querySelector<HTMLElement>(`[data-slide="${key}"]`);
}

export default function VinylStage({ children }: { children: ReactNode }) {
	const reducedMotion = useReducedMotion();
	const desktop = useMediaQuery(DESKTOP_QUERY);
	const progress = useMotionValue(0);
	const smooth = useSpring(progress, {
		stiffness: reducedMotion ? 1000 : 140,
		damping: reducedMotion ? 100 : 28,
		mass: 0.9,
	});
	const [active, setActive] = useState(0);
	const spin = useMotionValue(0);

	useMotionValueEvent(progress, "change", (latest) => {
		setActive(Math.round(latest));
	});

	// Page-space top and height of every slide, kept current by the effect below.
	const bounds = useRef<{ tops: number[]; heights: number[] }>({
		tops: [],
		heights: [],
	});

	useEffect(() => {
		const update = () => {
			const { tops, heights } = bounds.current;
			progress.set(
				progressAt(window.scrollY, window.innerHeight, tops, heights),
			);
		};
		const measure = () => {
			const slides = SLIDES.map((s) => slideElement(s.key));
			bounds.current = {
				tops: slides.map((el) =>
					el ? el.getBoundingClientRect().top + window.scrollY : 0,
				),
				heights: slides.map((el) => el?.offsetHeight ?? 0),
			};
			update();
		};

		measure();
		// FAQ answers and form messages change slide heights after load.
		const observer = new ResizeObserver(measure);
		for (const s of SLIDES) {
			const el = slideElement(s.key);
			if (el) observer.observe(el);
		}
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", measure);
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", measure);
		};
	}, [progress]);

	useScrollDirector(bounds, { desktop, reducedMotion: !!reducedMotion });

	return (
		<StageContext.Provider value={{ progress, smooth, active, desktop, spin }}>
			<div className="vinyl-stage">{children}</div>
		</StageContext.Provider>
	);
}

// One snap point. Semantics (section, footer) come from the content inside.
export function Slide({
	slide,
	className = "",
	children,
}: {
	slide: SlideKey;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div
			data-slide={slide}
			className={`vinyl-slide relative min-h-svh ${className}`}
		>
			{children}
		</div>
	);
}
