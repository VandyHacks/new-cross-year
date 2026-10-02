import ScrollReveal from "@/components/scroll-reveal";

const aboutText =
	"Code, collaborate, learn, and network at Vanderbilt's official collegiate hackathon, VandyHacks! This in-person event brings students together for workshops, games, networking, meals, speaker events, and a weekend of building ambitious projects. Whether this is your first hackathon or your thirteenth, we hope to see you at VandyHacks XIII in March 2027. Go Hackers!";

export default function About() {
	return (
		<section
			id="about"
			className="relative z-10 flex min-h-svh items-center bg-black px-[clamp(20px,3vw,64px)] pt-[clamp(80px,12svh,160px)] pb-[max(35svh,160px)]"
			aria-labelledby="about-title"
		>
			<div className="mx-auto w-full max-w-[1400px]">
				<h2
					id="about-title"
					className="mb-10 font-heading text-[11px] tracking-[0.08em] text-[#ba87f8] uppercase max-[600px]:mb-7 max-[600px]:text-[10px]"
				>
					About
				</h2>
				<ScrollReveal className="font-heading text-[clamp(22px,2.65vw,44px)] leading-[1.5] tracking-[-0.035em] text-[#f1f0f3]">
					{aboutText}
				</ScrollReveal>
			</div>
		</section>
	);
}
