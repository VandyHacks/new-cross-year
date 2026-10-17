"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { primaryButtonClassName } from "@/lib/button-styles";
import { CTA } from "@/lib/event";

const navigationLinks = [
	{ label: "Home", href: "#home", id: "home" },
	{ label: "About", href: "#about", id: "about" },
	{ label: "Impact", href: "#impact", id: "impact" },
	{ label: "Sponsors", href: "#sponsors", id: "sponsors" },
	{ label: "Team", href: "#team", id: "team" },
	{ label: "FAQ", href: "#faq", id: "faq" },
];

function useActiveSection() {
	const [active, setActive] = useState("home");

	useEffect(() => {
		const sections = navigationLinks
			.map((link) => document.getElementById(link.id))
			.filter((el): el is HTMLElement => el !== null);
		if (sections.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActive(entry.target.id);
				}
			},
			// A section is "active" while its midpoint is near the viewport center.
			{ rootMargin: "-50% 0px -50% 0px", threshold: 0 },
		);
		for (const section of sections) observer.observe(section);
		return () => observer.disconnect();
	}, []);

	return active;
}

function useScrolled(threshold = 24) {
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > threshold);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [threshold]);
	return scrolled;
}

export default function Navbar() {
	const reducedMotion = useReducedMotion();
	const active = useActiveSection();
	const scrolled = useScrolled();
	const [menuOpen, setMenuOpen] = useState(false);

	// Close the mobile menu on Escape and lock body scroll while it's open.
	useEffect(() => {
		if (!menuOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setMenuOpen(false);
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	return (
		<motion.header
			initial={reducedMotion ? false : { y: -24, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow,padding] duration-300 ${
				scrolled
					? "border-white/10 bg-vh-navy-950/90 py-2 shadow-lg shadow-black/30"
					: "border-transparent bg-vh-navy-950/60 py-4"
			}`}
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between px-[clamp(16px,3vw,48px)]">
				{/* Logo — far left, links to top */}
				<a
					href="#home"
					aria-label="VandyHacks — back to top"
					className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vh-purple-300"
				>
					<Image
						src="/logo-trimmed.png"
						alt="VandyHacks"
						width={261}
						height={231}
						priority
						className={`w-auto transition-[height] duration-300 ${
							scrolled ? "h-7" : "h-9"
						}`}
					/>
				</a>

				{/* Centered nav links (desktop) */}
				<nav
					aria-label="Main navigation"
					className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
				>
					{navigationLinks.map((link) => {
						const isActive = active === link.id;
						return (
							<a
								key={link.href}
								href={link.href}
								aria-current={isActive ? "true" : undefined}
								className={`type-nav relative rounded-md px-3 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 ${
									isActive
										? "text-white"
										: "text-vh-muted hover:text-vh-purple-300"
								}`}
							>
								{link.label}
								{isActive && (
									<motion.span
										layoutId="nav-active-pill"
										className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-vh-purple-300"
										transition={
											reducedMotion
												? { duration: 0 }
												: {
														type: "spring",
														stiffness: 380,
														damping: 30,
													}
										}
									/>
								)}
							</a>
						);
					})}
				</nav>

				{/* Right cluster: Apply button + mobile hamburger */}
				<div className="flex shrink-0 items-center gap-2">
					<a className={primaryButtonClassName} href={CTA.interest}>
						Get notified
					</a>
					<button
						type="button"
						onClick={() => setMenuOpen((v) => !v)}
						aria-expanded={menuOpen}
						aria-controls="mobile-menu"
						aria-label={menuOpen ? "Close menu" : "Open menu"}
						className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 md:hidden"
					>
						<svg
							viewBox="0 0 24 24"
							aria-hidden="true"
							className="size-6"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						>
							{menuOpen ? (
								<path d="M6 6l12 12M6 18L18 6" />
							) : (
								<>
									<path d="M4 7h16" />
									<path d="M4 12h16" />
									<path d="M4 17h16" />
								</>
							)}
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile slide-down panel */}
			<AnimatePresence>
				{menuOpen && (
					<motion.nav
						id="mobile-menu"
						aria-label="Mobile navigation"
						initial={reducedMotion ? false : { opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={
							reducedMotion
								? { opacity: 0 }
								: { opacity: 0, y: -8 }
						}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="border-t border-white/10 bg-vh-navy-950/95 backdrop-blur-xl md:hidden"
					>
						<ul className="flex flex-col gap-1 px-[clamp(16px,3vw,48px)] py-4">
							{navigationLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										onClick={() => setMenuOpen(false)}
										aria-current={
											active === link.id
												? "true"
												: undefined
										}
										className={`type-nav block rounded-md px-3 py-3 text-2xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vh-purple-300 ${
											active === link.id
												? "text-vh-purple-300"
												: "text-white hover:text-vh-purple-300"
										}`}
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</motion.nav>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
