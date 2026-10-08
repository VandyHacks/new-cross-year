import Hero from "@/components/hero";
import About from "@/components/about";
import Stats from "@/components/stats";
import MatrixRain from "@/components/matrix-rain";
import Sponsors from "@/components/sponsors";
import Footer from "@/components/footer";

export default function Home() {
	return (
		<main className="relative isolate bg-black">
			<Hero />
			<div className="relative z-10 isolate overflow-hidden bg-black">
				<MatrixRain />
				<About />
				<Stats />
				<Sponsors />
			</div>
			<Footer />
		</main>
	);
}
