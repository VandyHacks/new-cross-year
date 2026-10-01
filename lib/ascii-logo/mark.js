import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import fontData from "./font.json";

export const LOGO_SIZE = 12;

export function buildLogoGeometry() {
	const geometry = new TextGeometry("VANDYHACKSXIII", {
		font: new FontLoader().parse(fontData),
		size: 1,
		depth: 0.32,
		curveSegments: 8,
		bevelEnabled: true,
		bevelThickness: 0.035,
		bevelSize: 0.025,
		bevelSegments: 3,
	});
	geometry.computeBoundingBox();
	const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
	geometry.scale(LOGO_SIZE / width, LOGO_SIZE / width, LOGO_SIZE / width);
	geometry.center();
	return geometry;
}
