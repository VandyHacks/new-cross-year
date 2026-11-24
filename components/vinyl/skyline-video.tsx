"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
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
// The clip's first frame. Served through next/image (resized, WebP/AVIF), so
// first paint never waits on the raw PNG or the video.
const POSTER = "/skyline/city-poster.png";

// False on the server and during hydration, true once mounted on the client.
const noopSubscribe = () => () => {};
function useHydrated() {
	return useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false,
	);
}

export default function SkylineVideo({ className = "" }: { className?: string }) {
	const { smooth } = useStage();
	const reducedMotion = useReducedMotion();
	const hydrated = useHydrated();
	const video = useRef<HTMLVideoElement>(null);
	const target = useRef(0);
	const frame = useRef(0);
	const [failed, setFailed] = useState(false);
	const opacity = useTransform(smooth, [0, 0.95], [1, 0]);
	// The clip only exists to be scrubbed: reduced-motion visitors keep the
	// still poster and never download it.
	const showVideo = hydrated && !reducedMotion;

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
		const v = video.current;
		if (!v) return;
		// Only metadata loads up front; buffer the whole clip once the visitor
		// actually starts scrolling, so smooth scrubbing doesn't cost a bounce.
		if (p > 0 && v.preload !== "auto") v.preload = "auto";
		target.current = Math.min(1, Math.max(0, p));
		if (!frame.current) frame.current = requestAnimationFrame(seek);
	};

	useMotionValueEvent(smooth, "change", scrub);
	useEffect(
		() => () => {
			cancelAnimationFrame(frame.current);
			frame.current = 0;
		},
		[],
	);

	if (failed) return <Skyline className={className} />;

	return (
		<motion.div
			className={`skyline-video ${className}`}
			style={{ opacity }}
			aria-hidden="true"
		>
			<Image
				src={POSTER}
				alt=""
				fill
				sizes="100vw"
				loading="eager"
				className="object-cover object-bottom"
			/>
			{showVideo && (
				<video
					ref={video}
					src={SRC}
					muted
					playsInline
					preload="metadata"
					disablePictureInPicture
					onLoadedMetadata={() => scrub(smooth.get())}
					onError={() => setFailed(true)}
					className="absolute inset-0 h-full w-full object-cover object-bottom"
				/>
			)}
		</motion.div>
	);
}
