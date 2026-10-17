"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import type { Sponsor } from "@/lib/sponsors";

const cardClassName =
	"group relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-vh-navy-800/60 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-vh-purple-300/50 hover:shadow-[0_8px_32px_rgb(113_56_199/0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

// Cursor-following purple glow, driven by --mx/--my set on pointer move.
const glowClassName =
	"pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(220px_circle_at_var(--mx,50%)_var(--my,50%),rgb(136_83_220/0.32),transparent_70%)] group-hover:opacity-100 group-focus-visible:opacity-100";

function trackPointer(event: PointerEvent<HTMLElement>) {
	const rect = event.currentTarget.getBoundingClientRect();
	event.currentTarget.style.setProperty(
		"--mx",
		`${event.clientX - rect.left}px`,
	);
	event.currentTarget.style.setProperty(
		"--my",
		`${event.clientY - rect.top}px`,
	);
}

function Logo({ sponsor }: { sponsor: Sponsor }) {
	const { logo, name } = sponsor;
	if (!logo) {
		return (
			<span className="px-2 text-center font-heading text-[clamp(12px,1.3vw,16px)] leading-snug text-vh-text/85 transition-colors group-hover:text-white">
				{name}
			</span>
		);
	}

	const src = `/sponsors/${logo.src}`;
	const tone =
		logo.tone === "mono"
			? "brightness-0 invert opacity-80 transition-opacity group-hover:opacity-100"
			: "";

	if (logo.kind === "icon") {
		return (
			<span className="flex w-full flex-col items-center gap-2.5">
				<span className="relative size-[clamp(36px,4vw,52px)]">
					<Image
						src={src}
						alt=""
						fill
						sizes="52px"
						className={`object-contain ${logo.tone === "color" ? "rounded-md" : ""} ${tone}`}
					/>
				</span>
				<span className="type-label px-1 text-center text-[10px] leading-snug tracking-[0.1em] text-vh-muted transition-colors group-hover:text-white">
					{name}
				</span>
			</span>
		);
	}

	return (
		<span
			className={`relative block h-[46%] w-[76%] ${
				logo.plate ? "rounded-md bg-vh-text p-2" : ""
			}`}
		>
			<Image
				src={src}
				alt=""
				fill
				sizes="(max-width: 640px) 40vw, 240px"
				className={`object-contain ${logo.plate ? "p-1.5" : ""} ${tone}`}
			/>
		</span>
	);
}

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
	return (
		<a
			href={sponsor.url}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={`${sponsor.name} (opens in a new tab)`}
			onPointerMove={trackPointer}
			className={cardClassName}
		>
			<span className={glowClassName} aria-hidden="true" />
			<span className="relative flex size-full items-center justify-center">
				<Logo sponsor={sponsor} />
			</span>
		</a>
	);
}

export function BecomeSponsorCard({ href }: { href: string }) {
	return (
		<a
			href={href}
			onPointerMove={trackPointer}
			className={`${cardClassName} border-dashed border-vh-purple-300/40 bg-vh-purple-700/10`}
		>
			<span className={glowClassName} aria-hidden="true" />
			<span className="relative flex flex-col items-center gap-2 text-center">
				<span className="type-label text-vh-purple-300">
					Your logo here
				</span>
				<span className="type-button text-white">
					Become a sponsor →
				</span>
			</span>
		</a>
	);
}
