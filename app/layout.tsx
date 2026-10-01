import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "cn";

export const metadata: Metadata = { title: "VandyHacks XIII" };
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className="dark scheme-dark scroll-smooth scroll-pt-6 motion-reduce:scroll-auto"
		>
			<body
				className={cn(
					"w-full bg-black font-sans leading-[normal] bg-[radial-gradient(125%_125%_at_50%_0%,_#000000_50%,_#7e51a488)] text-[#f1f0f3] selection:bg-[#ba87f8] selection:text-black",
					inter.variable,
				)}
			>
				{children}
			</body>
		</html>
	);
}
