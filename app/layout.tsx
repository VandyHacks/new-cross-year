import type { Metadata } from "next";
import { Michroma, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "cn";

export const metadata: Metadata = { title: "VandyHacks XIII" };
const michroma = Michroma({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-michroma",
	display: "swap",
});
const spaceMono = Michroma({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-space-mono",
	display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={cn(
				"dark scheme-dark scroll-smooth scroll-pt-6 motion-reduce:scroll-auto",
				michroma.variable,
				spaceMono.variable,
			)}
		>
			<body className="retro-screen w-full bg-black font-sans leading-[normal] bg-[radial-gradient(125%_125%_at_50%_0%,_#000000_50%,_#7e51a4ff)] text-[#f1f0f3] selection:bg-[#ba87f8] selection:text-black">
				{children}
			</body>
		</html>
	);
}
