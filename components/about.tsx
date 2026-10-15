import ScrollReveal from "@/components/scroll-reveal";

const aboutText =
	"At VandyHacks, we believe the next big idea can come from anyone. We bring together curious minds, bold thinkers, and passionate builders to turn ideas into reality through hackathons, hands-on workshops, and collaborations with industry leaders. From first-time coders to experienced developers, we create a space where students can experiment with emerging technologies, challenge what's possible, and build connections that last beyond the event. Join us on April 3–4, 2027, for **VandyHacks XIII**, the thirteenth edition of Vanderbilt University's annual student-run hackathon, where innovation meets opportunity and ideas come to life.";

export default function About() {
	return (
		<section
			id="about"
			className="relative z-10 scroll-mt-20 px-[clamp(20px,5vw,72px)] py-[clamp(48px,7vw,88px)]"
			aria-label="About VandyHacks"
		>
			<div className="mx-auto w-full max-w-4xl">
				<h2 className="mb-6 font-heading text-2xl tracking-tight text-white sm:text-3xl">
					About VandyHacks
				</h2>
				<ScrollReveal className="text-base leading-8 text-[#d5d9e8] sm:text-lg">
					{aboutText}
				</ScrollReveal>
			</div>
		</section>
	);
}
