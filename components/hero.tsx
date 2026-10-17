"use client";

import AsciiWordmark from "@/components/ascii-wordmark";
import EventCountdown from "@/components/event-countdown";
import {
	primaryButtonClassName,
	secondaryButtonClassName,
} from "@/lib/button-styles";
import { CTA, EVENT } from "@/lib/event";

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
					className="relative h-[min(76vw,46svh)] w-[98vw] shrink-0"
				>
					<span className="sr-only">VandyHacks</span>
					<div className="absolute inset-0" aria-hidden="true">
						<AsciiWordmark introActive />
					</div>
				</h1>
				<div className="relative z-10 mt-4 flex flex-col items-center gap-[clamp(16px,2.5vh,28px)] text-center">
					<p className="type-label text-vh-purple-300">
						Code. Collaborate. Create.
					</p>
					<p className="type-subheading flex flex-wrap justify-center gap-x-3 text-[clamp(14px,1.6vw,20px)] text-white">
						<time
							className="whitespace-nowrap"
							dateTime={EVENT.start.toISOString()}
						>
							{EVENT.dateLabel}
						</time>
						<span className="text-vh-purple-300" aria-hidden="true">
							/
						</span>
						<span className="whitespace-nowrap">
							{EVENT.venue}, {EVENT.city}
						</span>
					</p>
					<EventCountdown />
					<div className="flex flex-wrap items-center justify-center gap-3">
						<a
							className={primaryButtonClassName}
							href={CTA.interest}
						>
							Get notified
						</a>
						<a
							className={secondaryButtonClassName}
							href={CTA.sponsor}
						>
							Sponsor {EVENT.edition}
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
