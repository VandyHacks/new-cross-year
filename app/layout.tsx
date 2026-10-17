import type { Metadata } from "next";
import { Michroma, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "cn";
import { EVENT } from "@/lib/event";

export const metadata: Metadata = {
	title: EVENT.name,
	description: `Code, collaborate, learn, and build at ${EVENT.name}, Vanderbilt's collegiate hackathon, ${EVENT.dateLabel} in ${EVENT.city}.`,
};
const michroma = Michroma({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-michroma",
	display: "swap",
});
const spaceMono = Space_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-space-mono",
	display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={cn(
				"dark scheme-dark scroll-smooth scroll-pt-20 motion-reduce:scroll-auto",
				michroma.variable,
				spaceMono.variable,
			)}
		>
			<body className="retro-screen w-full bg-vh-navy-950 font-sans leading-[normal] bg-[radial-gradient(125%_125%_at_50%_0%,_#080d20_48%,_#171432_100%)] text-vh-text selection:bg-vh-purple-300 selection:text-vh-navy-950">
				{children}
				<div className="retro-crt" aria-hidden="true" />
			</body>
		</html>
	);
}
