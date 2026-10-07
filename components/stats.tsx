const metrics = [
	{
		value: "2,000+",
		label: "Hackers around the world",
		floatClass: "-translate-y-8",
	},
	{
		value: "500+",
		label: "Projects Created",
		floatClass: "translate-y-6",
	},
	{
		value: "20+",
		label: "Speakers Hosted",
		floatClass: "translate-y-2",
	},
	{
		value: "25+",
		label: "Different Schools Represented",
		floatClass: "-translate-y-5",
	},
	{
		value: "13",
		label: "Editions of VandyHacks",
		floatClass: "-translate-y-1",
	},
	{
		value: "$50K",
		label: "Total prize pool",
		floatClass: "-translate-y-10",
	},
];

export default function Stats() {
	return (
		<section
			id="stats"
			className="relative z-10 isolate overflow-hidden px-[clamp(8px,3vw,64px)] pt-[clamp(8px,1vw,16px)] pb-[clamp(120px,18vw,220px)]"
			aria-labelledby="stats-title"
		>
			<div className="relative z-10 mx-auto w-full max-w-[1400px]">
				<div className="grid grid-cols-6 items-start gap-[clamp(4px,1vw,20px)] pt-7 pb-10">
					{metrics.map((metric) => (
						<article
							key={metric.label}
							className={`group flex min-h-[clamp(100px,14vw,190px)] min-w-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-[#100d14]/80 p-[clamp(5px,1.4vw,24px)] text-center shadow-[0_12px_40px_rgb(0_0_0/0.4),0_0_30px_rgb(186_135_248/0.08)] backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#ba87f8]/50 hover:bg-[#181020]/90 hover:shadow-[0_16px_48px_rgb(0_0_0/0.5),0_0_36px_rgb(186_135_248/0.16)] motion-reduce:transition-none ${metric.floatClass}`}
						>
							<p className="mb-2 font-heading text-[clamp(12px,1.7vw,28px)] leading-tight tracking-[-0.04em] text-[#ba87f8]">
								{metric.value}
							</p>
							<h3 className="mb-1 break-words font-mono text-[clamp(7px,0.9vw,14px)] font-normal leading-tight text-[#f1f0f3]">
								{metric.label}
							</h3>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
