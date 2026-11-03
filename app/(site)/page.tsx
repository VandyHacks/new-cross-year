import FAQ from "@/components/faq";
import GetInvolved from "@/components/get-involved";
import VinylHeader from "@/components/vinyl/header";
import VinylHero from "@/components/vinyl/hero";
import RecordPlayerFooter from "@/components/vinyl/record-player-footer";
import { AboutSlide, ImpactSlide } from "@/components/vinyl/slides";
import SponsorWall from "@/components/vinyl/sponsor-wall";
import VinylStage, { Slide } from "@/components/vinyl/stage";
import StageRecord from "@/components/vinyl/stage-record";
import TeamRoster from "@/components/vinyl/team-roster";

// Vinyl redesign: one snap-scrolling "slide" per section, with a pinned record
// on the left whose label ring turns to the current section. The page ends on
// a 3D record player: the record lands on its deck, and the footer is printed
// on its front panel.
export default function Home() {
	return (
		<VinylStage>
			<VinylHeader />
			<StageRecord />
			<main>
				<Slide slide="home">
					<VinylHero />
				</Slide>
				<Slide slide="about">
					<AboutSlide />
				</Slide>
				<Slide slide="impact">
					<ImpactSlide />
				</Slide>
				<Slide slide="sponsors">
					<SponsorWall />
				</Slide>
				<Slide slide="get-involved" className="slide-gutter slide-legacy">
					<GetInvolved />
				</Slide>
				<Slide slide="faq" className="slide-gutter slide-legacy">
					<FAQ />
				</Slide>
				<Slide slide="team">
					<TeamRoster />
				</Slide>
			</main>
			<Slide slide="footer">
				<RecordPlayerFooter />
			</Slide>
		</VinylStage>
	);
}
