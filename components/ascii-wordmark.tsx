"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Color } from "three";
import { loadGlyphAtlas } from "@/lib/ascii-logo/glyph-atlas.js";
import { AsciiLogoRenderer } from "@/lib/ascii-logo/renderer.js";

type RotationAxis = { value: number; velocity: number };

// Exact critically damped spring: continuous velocity, with no overshoot.
function smoothRotation(axis: RotationAxis, target: number, delta: number) {
	const speed = 5;
	const offset = axis.value - target;
	const decay = Math.exp(-speed * delta);
	const step = (axis.velocity + speed * offset) * delta;
	axis.value = target + (offset + step) * decay;
	axis.velocity = (axis.velocity - speed * step) * decay;
}

function AsciiWordmarkScene() {
	const { gl, size } = useThree();
	const renderer = useRef<AsciiLogoRenderer | null>(null);
	const reducedMotion = useRef(false);
	const pointer = useRef({ x: 0, y: 0 });
	const animationTime = useRef(0);
	const rotation = useRef({
		x: { value: 0.25, velocity: 0 },
		y: { value: -0.12, velocity: 0 },
		z: { value: -0.025, velocity: 0 },
	});
	const viewport = useRef(size);
	useEffect(() => {
		viewport.current = size;
	}, [size]);

	useEffect(() => {
		const canvas = gl.domElement;
		const move = (event: PointerEvent) => {
			if (event.pointerType === "touch") return;
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
		const updateMotion = () => {
			reducedMotion.current = motion.matches;
		};
		updateMotion();
		motion.addEventListener("change", updateMotion);
		gl.setClearColor(0x000000, 0);

		void loadGlyphAtlas("monospace", "400", 0.6).then((atlas) => {
			if (disposed) return;
			const ascii = new AsciiLogoRenderer(gl, atlas);
			ascii.setPaper(false);
			ascii.setInk(new Color().setRGB(0.68, 0.39, 1));
			const { width, height } = viewport.current;
			const cellHeight = Math.max(3, Math.min(10, width / 155));
			ascii.resize(
				width,
				height,
				gl.getPixelRatio(),
				cellHeight * 0.6,
				cellHeight,
			);
			renderer.current = ascii;
		});

		return () => {
			disposed = true;
			motion.removeEventListener("change", updateMotion);
			renderer.current?.destroy();
			renderer.current = null;
		};
	}, [gl]);

	useEffect(() => {
		const cellHeight = Math.max(3, Math.min(10, size.width / 155));
		renderer.current?.resize(
			size.width,
			size.height,
			gl.getPixelRatio(),
			cellHeight * 0.6,
			cellHeight,
		);
	}, [gl, size]);

	// A positive priority lets the ASCII passes take over Fiber's final render.
	useFrame((_, delta) => {
		// Resume gently after an inactive tab or a stalled frame.
		const dt = Math.min(delta, 1 / 30);
		const axes = rotation.current;
		if (reducedMotion.current) {
			axes.x.value = 0.25;
			axes.y.value = -0.12;
			axes.z.value = -0.025;
			axes.x.velocity = axes.y.velocity = axes.z.velocity = 0;
		} else {
			animationTime.current += dt * 0.25;
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
		renderer.current?.render({
			elevation: 0,
			azimuth: 0,
			rotateX: axes.x.value,
			rotateY: axes.y.value,
			rotateZ: axes.z.value,
			bob: 0,
		});
	}, 1);

	return null;
}

export default function AsciiWordmark() {
	return (
		<div
			className="absolute inset-x-0 inset-y-[20%] -translate-x-18 z-0 max-[600px]:top-[26%] max-[600px]:bottom-[39%] [&_canvas]:block [&_canvas]:size-full"
			role="img"
			aria-label="VANDYHACKSXIII rendered as a purple ASCII 3D solid"
		>
			<Canvas
				linear
				dpr={[1, 1.5]}
				gl={{
					alpha: true,
					antialias: false,
					powerPreference: "high-performance",
				}}
			>
				<AsciiWordmarkScene />
			</Canvas>
		</div>
	);
}
