import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import About from "@/components/about";
import Impact from "@/components/stats";
import MatrixRain from "@/components/matrix-rain";
import Sponsors from "@/components/sponsors";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import Team from "@/components/team";
import GetInvolved from "@/components/get-involved";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="relative isolate bg-vh-navy-950">
				<Hero />
				<div className="relative z-10 isolate overflow-clip bg-vh-navy-900">
					<MatrixRain />
					<About />
					<Impact />
					<Sponsors />
					<Team />
					<GetInvolved />
					<FAQ />
				</div>
			</main>
			<Footer />
		</>
	);
}
