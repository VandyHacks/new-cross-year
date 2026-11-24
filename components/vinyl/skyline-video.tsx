"use client";

import { useEffect, useRef, useState } from "react";
import {
	motion,
	useMotionValueEvent,
	useReducedMotion,
	useTransform,
} from "motion/react";
import Skyline from "@/components/vinyl/skyline";
import { useStage } from "@/components/vinyl/stage";

// Experimental: an ElevenLabs-generated clip of the Nashville skyline, scrubbed
// by scroll instead of played. Stage progress 0 → 1 is the Home → About
// handover, and that maps onto the clip's full length, so scrolling down plays
// it forward and scrolling back rewinds it. Falls back to the SVG skyline if
// the video can't load.
const SRC = "/skyline/city.mp4";
const POSTER = "/skyline/city-poster.png";

export default function SkylineVideo({ className = "" }: { className?: string }) {
	const { smooth } = useStage();
	const reducedMotion = useReducedMotion();
	const video = useRef<HTMLVideoElement>(null);
	const target = useRef(0);
	const frame = useRef(0);
	const [failed, setFailed] = useState(false);
	const opacity = useTransform(smooth, [0, 0.95], [1, 0]);

	// Seek at most once per frame, and never while a seek is still decoding,
	// so fast scrolling doesn't queue up a backlog of seeks.
	const seek = () => {
		frame.current = 0;
		const v = video.current;
		if (!v || !v.duration) return;
		const t = target.current * (v.duration - 0.05);
		if (v.seeking) {
			frame.current = requestAnimationFrame(seek);
			return;
		}
		if (Math.abs(v.currentTime - t) > 1 / 60) v.currentTime = t;
	};

	const scrub = (p: number) => {
		target.current = reducedMotion ? 0 : Math.min(1, Math.max(0, p));
		if (!frame.current) frame.current = requestAnimationFrame(seek);
	};

	useMotionValueEvent(smooth, "change", scrub);
	useEffect(() => {
		// The server-rendered <video> starts loading before hydration, so a
		// load error (or ready metadata) can land before React's handlers exist.
		const v = video.current;
		if (v?.error) setFailed(true);
		else if (v && v.readyState >= 1) scrub(smooth.get());
		return () => {
			cancelAnimationFrame(frame.current);
			frame.current = 0;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (failed) return <Skyline className={className} />;

	return (
		<motion.div className={className} style={{ opacity }} aria-hidden="true">
			<video
				ref={video}
				src={SRC}
				poster={POSTER}
				muted
				playsInline
				preload="auto"
				disablePictureInPicture
				onLoadedMetadata={() => scrub(smooth.get())}
				onError={() => setFailed(true)}
				className="skyline-video h-full w-full object-cover object-bottom"
			/>
		</motion.div>
	);
}
