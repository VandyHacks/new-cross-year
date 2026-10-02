"use client";

import { useEffect, useRef } from "react";

const glyphs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}/*+=:;";
const frameInterval = 1000 / 24;

type Stream = {
	x: number;
	head: number;
	speed: number;
	length: number;
	brightness: number;
	characters: string[];
};

function signalHash(x: number, y: number) {
	const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return value - Math.floor(value);
}

export default function MatrixRain() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const context = canvas.getContext("2d");
		if (!context) return;

		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		let width = 0;
		let height = 0;
		let cellHeight = 20;
		let streams: Stream[] = [];
		let visible = false;
		let animationFrame = 0;
		let lastFrame = 0;
		let time = 0;

		function draw(delta: number) {
			if (!context) return;
			time += delta;
			context.clearRect(0, 0, width, height);
			context.font = `${cellHeight - 5}px monospace`;
			context.textAlign = "center";
			context.textBaseline = "top";

			const phase = time % 3;
			const start = 0.5 + signalHash(Math.floor(time / 3), 7) * 1.5;
			const glitch =
				!motion.matches && phase >= start && phase < start + 0.18;

			for (const stream of streams) {
				stream.head += stream.speed * delta;
				if (stream.head - stream.length * cellHeight > height) {
					stream.head = -cellHeight;
				}
				const head = Math.floor(stream.head / cellHeight) * cellHeight;
				for (let row = 0; row < stream.length; row++) {
					const y = head - row * cellHeight;
					if (y < -cellHeight || y > height) continue;
					const centeredY = (y / height) * 2 - 1;
					// Curve the character grid and add the logo's analog signal wave.
					let x =
						width / 2 +
						(stream.x - width / 2) / (1 + 0.075 * centeredY ** 2);
					if (!motion.matches) {
						x +=
							Math.sin((y / height) * 48 + time * 1.4) *
							width *
							0.0012;
					}
					const band = Math.floor(y / (cellHeight * 3));
					const tear =
						glitch && signalHash(band, Math.floor(time * 24)) > 0.6;
					if (tear) x += cellHeight * 0.6;

					const character =
						stream.characters[
							(row + Math.floor(time * 3)) %
								stream.characters.length
						];
					const fade = (1 - row / stream.length) ** 1.7;
					context.globalAlpha =
						stream.brightness * fade * (tear ? 0.8 : 1);
					context.shadowBlur = 0;
					if (row < 3 || tear) {
						const split = tear ? 1.5 : 0.65;
						context.fillStyle = "#ff6ea0";
						context.fillText(character, x + split, y);
						context.fillStyle = "#64beff";
						context.fillText(character, x - split, y);
					}
					context.shadowColor = "#ac64ff";
					context.shadowBlur = row < 3 ? 6 : 0;
					context.fillStyle = row === 0 ? "#d2b9ff" : "#ac64ff";
					context.fillText(character, x, y);
				}
			}
			context.globalAlpha = 1;
			context.shadowBlur = 0;
		}

		function animate(now: number) {
			if (now - lastFrame >= frameInterval) {
				draw(lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0);
				lastFrame = now;
			}
			animationFrame = requestAnimationFrame(animate);
		}

		function syncAnimation() {
			cancelAnimationFrame(animationFrame);
			lastFrame = 0;
			if (!visible || document.hidden) return;
			draw(0);
			if (!motion.matches)
				animationFrame = requestAnimationFrame(animate);
		}

		const resize = new ResizeObserver(() => {
			const bounds = canvas.getBoundingClientRect();
			width = bounds.width;
			height = bounds.height;
			if (!width || !height) return;
			const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			context.setTransform(dpr, 0, 0, dpr, 0, 0);
			cellHeight = width < 600 ? 18 : 22;
			const spacing = cellHeight * 1.25;
			streams = Array.from(
				{ length: Math.ceil(width / spacing) },
				(_, i) => {
					const length = 10 + Math.floor(Math.random() * 18);
					return {
						x: i * spacing + spacing / 2,
						head: Math.random() * (height + length * cellHeight),
						speed: 28 + Math.random() * 42,
						length,
						brightness: 0.35 + Math.random() * 0.65,
						characters: Array.from(
							{ length },
							() =>
								glyphs[
									Math.floor(Math.random() * glyphs.length)
								],
						),
					};
				},
			);
			syncAnimation();
		});
		const intersection = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			syncAnimation();
		});
		resize.observe(canvas);
		intersection.observe(canvas);
		motion.addEventListener("change", syncAnimation);
		document.addEventListener("visibilitychange", syncAnimation);

		return () => {
			cancelAnimationFrame(animationFrame);
			resize.disconnect();
			intersection.disconnect();
			motion.removeEventListener("change", syncAnimation);
			document.removeEventListener("visibilitychange", syncAnimation);
		};
	}, []);

	return (
		<div className="about-matrix" aria-hidden="true">
			<canvas ref={canvasRef} className="block size-full" />
		</div>
	);
}
