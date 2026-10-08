import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import fontData from "./font.json";

export const LOGO_SIZE = 12;

export function buildLogoGeometry({ stacked = false } = {}) {
	const font = new FontLoader().parse(fontData);
	const lines = stacked ? ["VANDY", "HACKS", "XII"] : ["VANDYHACKSXIII"];
	const parts = lines.map((text, index) => {
		const line = new TextGeometry(text, {
			font,
			size: 1,
			depth: 0.32,
			curveSegments: 8,
			bevelEnabled: true,
			bevelThickness: 0.035,
			bevelSize: 0.025,
			bevelSegments: 3,
		});
		line.center();
		line.translate(0, ((lines.length - 1) / 2 - index) * 1.2, 0);
		return line;
	});
	const geometry = mergeGeometries(parts);
	for (const part of parts) part.dispose();
	geometry.computeBoundingBox();
	const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
	geometry.scale(LOGO_SIZE / width, LOGO_SIZE / width, LOGO_SIZE / width);
	geometry.center();
	return geometry;
}
