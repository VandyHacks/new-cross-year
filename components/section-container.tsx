import type { ReactNode } from "react";

// Shared content container: the same max-width and horizontal padding the
// footer uses (padding outside the max-width), so every section's content
// lines up on the same left and right edges as the footer.
export default function SectionContainer({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className="w-full px-[clamp(20px,5vw,72px)]">
			<div className={`mx-auto w-full max-w-7xl ${className}`}>
				{children}
			</div>
		</div>
	);
}
