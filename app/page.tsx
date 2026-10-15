import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Mission from "@/components/about";
import About from "@/components/stats";
import MatrixRain from "@/components/matrix-rain";
import Sponsors from "@/components/sponsors";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import Team from "@/components/team";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="relative isolate bg-[#080d20]">
				<Hero />
				<div className="relative z-10 isolate overflow-clip bg-[#0d142c]">
					<MatrixRain />
					<Mission />
					<About />
					<Sponsors />
					<Team />
					<FAQ />
				</div>
			</main>
			<Footer />
		</>
	);
}
