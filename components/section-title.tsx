// Shared section title — the footer group-label style (Michroma, purple,
// uppercase, wide tracking) scaled up to work as a section heading. Solid
// fill, left-aligned, one size/weight/color/spacing for every section.
export default function SectionTitle({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) {
	return (
		<h2
			id={id}
			className="mb-[clamp(20px,3vw,36px)] font-mono text-[clamp(28px,3.6vw,52px)] leading-tight font-normal tracking-[0.18em] text-[#c8a2ff] uppercase"
		>
			{children}
		</h2>
	);
}
