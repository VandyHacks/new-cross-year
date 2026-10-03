import Hero from "@/components/hero";
import About from "@/components/about";
import Stats from "@/components/stats";
import Sponsors from "@/components/sponsors";
import Team from "@/components/team";
import Footer from "@/components/footer";

export default function Home() {
	return (
		<main className="relative isolate bg-black">
			<Hero />
			<About />
			<Stats />
			<Sponsors />
			<Footer />
		</main>
	);
}
