"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Arc from "@/components/vinyl/arc";

// Heading (first child) pinned at a shared offset; body centred below, or pinned just
// under it when `anchorTop` (so tab-switchable content grows downward without shifting).
export function SlideBody({
	children,
	className = "",
	fit = false,
	anchorTop = false,
}: {
	children: ReactNode;
	className?: string;
	/** Trim the bottom padding for slides whose content should fit a laptop screen. */
	fit?: boolean;
	anchorTop?: boolean;
}) {
	const [heading, ...body] = Children.toArray(children);
	return (
		<div
			className={`slide-gutter slide-frame flex min-h-svh flex-col px-5 pt-24 sm:px-8 ${
				fit ? "pb-8 lg:pb-[clamp(16px,3svh,32px)]" : "pb-12"
			} ${className}`}
		>
			<div
				className={`mx-auto flex w-full max-w-5xl flex-1 flex-col ${
					anchorTop ? "gap-[clamp(16px,3svh,32px)]" : ""
				}`}
			>
				{heading}
				<div
					className={`flex flex-1 flex-col ${anchorTop ? "justify-start" : "justify-center"}`}
				>
					{body}
				</div>
			</div>
		</div>
	);
}

export function SlideHeading({
	id,
	children,
	className,
	wrapperClassName = "",
}: {
	id: string;
	children: ReactNode;
	className?: string;
	wrapperClassName?: string;
}) {
	const reducedMotion = useReducedMotion();
	return (
		<Arc className={wrapperClassName}>
			<motion.h2
				id={id}
				className={cn(
					"font-heading text-[clamp(30px,4.4vw,64px)] leading-[1.05] tracking-[0.12em] text-white uppercase",
					className,
				)}
				initial={reducedMotion ? false : { opacity: 0, x: -48, filter: "blur(10px)" }}
				whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
				viewport={{ once: true, amount: 0.6 }}
				transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
			>
				{children}
			</motion.h2>
		</Arc>
	);
}

// --- About ----------------------------------------------------------------

// Past-event photos used in the About collage.
const GROUP = {
	src: "/about/group-balloons.jpg",
	alt: "VandyHacks participants gathered under giant balloon letters",
	position: "center 35%",
};
const COLLAB = {
	src: "/about/collaborating.jpg",
	alt: "Students collaborating around laptops at VandyHacks",
	position: "center",
};
const GUITAR = {
	src: "/about/guitar.jpg",
	alt: "Hackers taking a break with a guitar",
	position: "center",
};

// One collage photo; position, size and rotation come from the caller.
function PhotoCard({
	src,
	alt,
	className = "",
	position,
	sizes,
}: {
	src: string;
	alt: string;
	className?: string;
	position?: string;
	// Rendered width, so phones don't download a 750px image for a 180px card.
	sizes: string;
}) {
	return (
		<div
			className={`group overflow-hidden rounded-xl bg-vh-navy-900 ring-1 ring-white/10 shadow-[0_12px_30px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-out hover:z-40 ${className}`}
		>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				style={position ? { objectPosition: position } : undefined}
				className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
			/>
		</div>
	);
}

function FadeUp({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
	const reducedMotion = useReducedMotion();
	return (
		<motion.div
			className={className}
			initial={reducedMotion ? false : { opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.div>
	);
}

// "Who We Are": intro paragraph beside a photo collage.
export function AboutSlide() {
	return (
		<section id="about" aria-labelledby="about-title">
			<SlideBody fit>
				<SlideHeading id="about-title">Who We Are</SlideHeading>
				<Arc>
					<div className="grid items-stretch gap-x-[clamp(16px,2.2vw,36px)] gap-y-8 md:grid-cols-2">
						<FadeUp delay={0.3} className="flex items-center">
							<p className="type-body max-w-[40ch] text-[clamp(16px,1.6vw,23px)] leading-[2] text-pretty text-vh-text-soft">
								We are VandyHacks, Vanderbilt University’s student-run hackathon
								organization dedicated to bringing together curious minds, creative
								thinkers, and passionate builders. Through our annual hackathon, we
								bring students from all backgrounds together to{" "}
								<strong className="font-semibold text-white">
									collaborate, innovate, and turn bold ideas into reality
								</strong>
								. Whether you’re a first-time hacker or an experienced developer,
								there’s a place for you at VandyHacks.
							</p>
						</FadeUp>
						<FadeUp delay={0.45}>
							{/* Desktop: asymmetric, layered editorial collage. */}
							<div className="relative mx-auto hidden aspect-square w-full max-w-[440px] md:block">
								<PhotoCard
									{...GROUP}
									sizes="400px"
									className="absolute top-0 right-0 z-10 w-[90%] rotate-[-1.5deg] aspect-[4/3]"
								/>
								<PhotoCard
									{...COLLAB}
									sizes="230px"
									className="absolute right-[1%] bottom-[3%] z-20 w-[52%] rotate-[2deg] aspect-[4/3]"
								/>
								<PhotoCard
									{...GUITAR}
									sizes="200px"
									className="absolute bottom-0 left-0 z-30 w-[44%] aspect-[3/4]"
								/>
							</div>
							{/* Mobile: clean stacked layout. */}
							<div className="flex flex-col gap-3 md:hidden">
								<PhotoCard {...GROUP} sizes="90vw" className="relative aspect-[16/10]" />
								<div className="grid grid-cols-2 gap-3">
									<PhotoCard {...GUITAR} sizes="45vw" className="relative aspect-[3/4]" />
									<PhotoCard {...COLLAB} sizes="45vw" className="relative aspect-[3/4]" />
								</div>
							</div>
						</FadeUp>
					</div>
				</Arc>
			</SlideBody>
		</section>
	);
}
