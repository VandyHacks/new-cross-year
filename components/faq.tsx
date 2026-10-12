const questions = [
	{
		question: "What is VandyHacks?",
		answer:
			"VandyHacks is Vanderbilt's collegiate hackathon: a weekend for students to build projects, learn, meet other hackers, and share what they create.",
	},
	{
		question: "When and where is VandyHacks XIII?",
		answer:
			"VandyHacks XIII is planned for March 2027 at Vanderbilt University in Nashville, Tennessee. The schedule and venue details will be shared closer to the event.",
	},
	{
		question: "Do I need hackathon experience to participate?",
		answer:
			"No. VandyHacks welcomes first-time hackers as well as returning participants. Event registration will include the latest participation and eligibility details.",
	},
	{
		question: "How can my organization sponsor VandyHacks?",
		answer:
			"Email info@vandyhacks.org to talk with the team about sponsorship opportunities.",
	},
	{
		question: "Where can I find updates or ask another question?",
		answer:
			"Follow @vandyhacks on Instagram for updates, or email info@vandyhacks.org with questions.",
	},
];

export default function FAQ() {
	return (
		<section
			id="faq"
			className="relative z-10 scroll-mt-20 px-[clamp(20px,5vw,72px)] pt-[clamp(48px,7vw,88px)] pb-[clamp(64px,9vw,112px)]"
			aria-labelledby="faq-title"
		>
			<div className="mx-auto w-full max-w-4xl">
				<h2
					id="faq-title"
					className="mb-8 font-heading text-2xl tracking-tight text-white sm:text-3xl"
				>
					FAQ
				</h2>
				<div className="divide-y divide-white/10 border-y border-white/10">
					{questions.map(({ question, answer }) => (
						<details key={question} className="group py-5">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-sm text-white marker:content-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c8a2ff] sm:text-base">
								{question}
								<span
									className="text-lg text-[#c8a2ff] transition-transform group-open:rotate-45"
									aria-hidden="true"
								>
									+
								</span>
							</summary>
							<p className="max-w-3xl pt-4 pr-8 text-sm leading-7 text-[#c3c8dc]">
								{answer}
							</p>
						</details>
					))}
				</div>
			</div>
		</section>
	);
}
