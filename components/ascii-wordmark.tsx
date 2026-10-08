"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Color } from "three";
import { loadGlyphAtlas } from "@/lib/ascii-logo/glyph-atlas.js";
import { AsciiLogoRenderer } from "@/lib/ascii-logo/renderer.js";
import { screenFlicker } from "@/lib/intro-motion";

type RotationAxis = { value: number; velocity: number };

function smoothRotation(axis: RotationAxis, target: number, delta: number) {
	const speed = 5;
	const offset = axis.value - target;
	const decay = Math.exp(-speed * delta);
	const step = (axis.velocity + speed * offset) * delta;
	axis.value = target + (offset + step) * decay;
	axis.velocity = (axis.velocity - speed * step) * decay;
}

function AsciiWordmarkScene({
	onReady,
	introActive,
}: {
	onReady: () => void;
	introActive: boolean;
}) {
	const { gl, size } = useThree();
	const renderer = useRef<AsciiLogoRenderer | null>(null);
	const firstFrameRendered = useRef(false);
	const reducedMotion = useRef(false);
	const frontFacing = useRef(false);
	const pointer = useRef({ x: 0, y: 0 });
	const animationTime = useRef(0);
	const glitchTime = useRef(0);
	const rotation = useRef({
		x: { value: 0.25, velocity: 0 },
		y: { value: -0.12, velocity: 0 },
		z: { value: -0.025, velocity: 0 },
	});
	const viewport = useRef(size);
	const resizeRenderer = useCallback(() => {
		const { width, height } = viewport.current;
		const cellHeight = Math.max(3, Math.min(10, width / 155));
		renderer.current?.setInk(
			frontFacing.current
				? new Color().setRGB(0.95, 0.65, 1.35)
				: new Color().setRGB(0.68, 0.39, 1),
		);
		renderer.current?.resize(
			width,
			height,
			gl.getPixelRatio(),
			cellHeight * 0.6,
			cellHeight,
			{ frontFacing: frontFacing.current },
		);
	}, [gl]);

	useEffect(() => {
		viewport.current = size;
		resizeRenderer();
	}, [size, resizeRenderer]);

	useEffect(() => {
		const canvas = gl.domElement;
		const move = (event: PointerEvent) => {
			if (frontFacing.current || event.pointerType === "touch") return;
			const bounds = canvas.getBoundingClientRect();
			if (!bounds.width || !bounds.height) return;
			pointer.current.x = Math.max(
				-1,
				Math.min(
					1,
					((event.clientX - bounds.left) / bounds.width) * 2 - 1,
				),
			);
			pointer.current.y = Math.max(
				-1,
				Math.min(
					1,
					((event.clientY - bounds.top) / bounds.height) * 2 - 1,
				),
			);
		};
		const reset = () => {
			pointer.current = { x: 0, y: 0 };
		};
		canvas.addEventListener("pointermove", move);
		canvas.addEventListener("pointerleave", reset);
		canvas.addEventListener("pointercancel", reset);
		window.addEventListener("blur", reset);
		return () => {
			canvas.removeEventListener("pointermove", move);
			canvas.removeEventListener("pointerleave", reset);
			canvas.removeEventListener("pointercancel", reset);
			window.removeEventListener("blur", reset);
		};
	}, [gl]);

	useEffect(() => {
		let disposed = false;
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const mobile = window.matchMedia(
			"(max-width: 767px), (hover: none) and (pointer: coarse)",
		);
		const updateMotion = () => {
			reducedMotion.current = motion.matches;
		};
		updateMotion();
		motion.addEventListener("change", updateMotion);
		const updateMobile = () => {
			frontFacing.current = mobile.matches;
			pointer.current = { x: 0, y: 0 };
			resizeRenderer();
		};
		updateMobile();
		mobile.addEventListener("change", updateMobile);
		gl.setClearColor(0x000000, 0);

		// Finish font loading and the first render before starting the page intro.
		void Promise.all([
			loadGlyphAtlas("monospace", "400", 0.6),
			document.fonts.ready,
		]).then(([atlas]) => {
			if (disposed) return;
			const ascii = new AsciiLogoRenderer(gl, atlas);
			ascii.setPaper(false);
			renderer.current = ascii;
			resizeRenderer();
			firstFrameRendered.current = false;
		});

		return () => {
			disposed = true;
			motion.removeEventListener("change", updateMotion);
			mobile.removeEventListener("change", updateMobile);
			renderer.current?.destroy();
			renderer.current = null;
		};
	}, [gl, resizeRenderer]);

	useFrame((_, delta) => {
		const ascii = renderer.current;
		if (!ascii) return;

		// Resume gently after an inactive tab or a stalled frame.
		const dt = Math.min(delta, 1 / 30);
		const axes = rotation.current;
		if (frontFacing.current) {
			axes.x.value = axes.y.value = axes.z.value = 0;
			axes.x.velocity = axes.y.velocity = axes.z.velocity = 0;
		} else if (reducedMotion.current) {
			axes.x.value = 0.25;
			axes.y.value = -0.12;
			axes.z.value = -0.025;
			axes.x.velocity = axes.y.velocity = axes.z.velocity = 0;
		} else if (introActive && firstFrameRendered.current) {
			animationTime.current += dt * 0.25;
			glitchTime.current += dt;
			const t = animationTime.current;
			smoothRotation(
				axes.x,
				0.25 + Math.sin(t) * 0.06 + pointer.current.y * 0.2,
				dt,
			);
			smoothRotation(
				axes.y,
				-0.12 + Math.sin(t * 0.7) * 0.1 + pointer.current.x * 0.3,
				dt,
			);
			smoothRotation(axes.z, -0.025 + Math.sin(t * 0.6) * 0.015, dt);
		}
		ascii.render(
			{
				elevation: 0,
				azimuth: 0,
				rotateX: axes.x.value,
				rotateY: axes.y.value,
				rotateZ: axes.z.value,
				bob: 0,
			},
			{
				time: glitchTime.current,
				glitch:
					introActive &&
					!reducedMotion.current &&
					!frontFacing.current
						? 1
						: 0,
			},
		);
		if (!firstFrameRendered.current) {
			firstFrameRendered.current = true;
			onReady();
		}
	}, 1);

	return null;
}

export default function AsciiWordmark({
	introActive = true,
	onReady,
	onIntroComplete,
}: {
	introActive?: boolean;
	onReady?: () => void;
	onIntroComplete?: () => void;
}) {
	const [ready, setReady] = useState(false);
	const reducedMotion = useReducedMotion();
	const handleReady = useCallback(() => {
		setReady(true);
		onReady?.();
	}, [onReady]);

	return (
		<motion.div
			data-intro
			className="absolute inset-x-0 inset-y-[20%] z-0 max-[767px]:top-[27%] max-[767px]:bottom-[27%] [&_canvas]:block [&_canvas]:size-full"
			role="img"
			aria-label="VandyHacks rendered in purple ASCII"
			initial="hidden"
			animate={introActive && ready ? "visible" : "hidden"}
			variants={screenFlicker}
			custom={{ reducedMotion }}
			onAnimationComplete={(definition) => {
				if (definition === "visible") onIntroComplete?.();
			}}
		>
			<Canvas
				linear
				resize={{ offsetSize: true }}
				dpr={[1, 1.5]}
				gl={{
					alpha: true,
					antialias: false,
					powerPreference: "high-performance",
				}}
			>
				<AsciiWordmarkScene
					onReady={handleReady}
					introActive={introActive}
				/>
			</Canvas>
		</motion.div>
	);
}
