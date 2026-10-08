import { Anton } from "next/font/google";

const anton = Anton({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});

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
			className={`${anton.className} mb-[clamp(40px,6vw,60px)] text-center text-[clamp(64px,10vw,144px)] leading-[0.95] font-normal tracking-[-0.025em] text-[#f1f0f3] uppercase max-[767px]:text-[clamp(44px,11vw,76px)]`}
		>
			{children}
		</h2>
	);
}
