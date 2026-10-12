const aboutText =
	"Code, collaborate, learn, and network at Vanderbilt's official collegiate hackathon, VandyHacks! This in-person event brings students together for workshops, games, networking, meals, speaker events, and a weekend of building ambitious projects. Whether this is your first hackathon or your thirteenth, we hope to see you at VandyHacks XIII in March 2027. Go Hackers!";

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
				<p className="text-base leading-8 text-[#d5d9e8] sm:text-lg">
					{aboutText}
				</p>
			</div>
		</section>
	);
}
