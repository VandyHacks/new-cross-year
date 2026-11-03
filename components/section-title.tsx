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
			className="mb-[clamp(20px,3vw,36px)] font-heading text-[clamp(30px,4.4vw,64px)] leading-[1.05] font-normal tracking-[0.12em] text-white uppercase"
		>
			{children}
		</h2>
	);
}
