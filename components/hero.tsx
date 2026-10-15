"use client";

import AsciiWordmark from "@/components/ascii-wordmark";

export default function Hero() {
	return (
		<section
			id="home"
			className="relative isolate scroll-mt-20 overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_50%_42%,_#242052_0%,_#101731_48%,_#080d20_100%)] px-[clamp(20px,5vw,72px)]"
			aria-labelledby="event-title"
		>
			<div
				className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(to_right,rgb(255_255_255/0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
				aria-hidden="true"
			/>
			<div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-12">
				<h1
					id="event-title"
					className="relative h-[min(92vw,70svh)] w-[98vw] shrink-0"
				>
					<span className="sr-only">VandyHacks</span>
					<div className="absolute inset-0" aria-hidden="true">
						<AsciiWordmark introActive />
					</div>
				</h1>
				<p className="type-label relative z-10 mt-6 text-center text-[#c8a2ff]">
					Code. Collaborate. Create.
				</p>
			</div>
		</section>
	);
}
