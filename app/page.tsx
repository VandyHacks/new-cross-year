import Hero from "@/components/hero";
import { SiteNavigation } from "@/components/hero";
import About from "@/components/about";
import Stats from "@/components/stats";
import MatrixRain from "@/components/matrix-rain";
import Sponsors from "@/components/sponsors";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import Team from "@/components/team";

export default function Home() {
	return (
		<>
			<SiteNavigation />
			<main className="relative isolate bg-[#080d20]">
				<Hero />
				<div className="relative z-10 isolate overflow-clip bg-[#0d142c]">
					<MatrixRain />
					<About />
					<Stats />
					<Sponsors />
					<Team />
					<FAQ />
				</div>
			</main>
			<Footer />
		</>
	);
}
