export const CELL_FRAG =
	"// Cell pass: one fragment per character cell.\n//\n// Each cell reads its own six points plus the ten around it, so a glyph is picked by where the tone\n// sits and which way an edge runs through the cell, not by an average. The winner leaves in alpha\n// as `index / 255`.\n//\n// INNER must match INNER_SAMPLES in samples.js, or the search compares against vectors built\n// some other way.\n\nprecision highp float;\nout vec4 outColor;\nuniform sampler2D tScene;\nuniform sampler2D tShapes;\nuniform vec2 uResolution;\nuniform vec2 uCellPx;\nuniform int uGlyphCount;\n\nconst float CONTRAST = 1.5;\nconst float EDGE_CONTRAST = 3.0;\n\nconst vec2 INNER[6] = vec2[6](\n  vec2(0.28, 0.26), vec2(0.72, 0.14),\n  vec2(0.28, 0.56), vec2(0.72, 0.44),\n  vec2(0.28, 0.86), vec2(0.72, 0.74)\n);\nconst vec2 OUTER[10] = vec2[10](\n  vec2(0.28, -0.2), vec2(0.72, -0.2),\n  vec2(-0.22, 0.25), vec2(1.22, 0.25),\n  vec2(-0.22, 0.5), vec2(1.22, 0.5),\n  vec2(-0.22, 0.75), vec2(1.22, 0.75),\n  vec2(0.28, 1.2), vec2(0.72, 1.2)\n);\nconst vec2 RING[6] = vec2[6](\n  vec2(1.0, 0.0), vec2(0.5, 0.8660254), vec2(-0.5, 0.8660254),\n  vec2(-1.0, 0.0), vec2(-0.5, -0.8660254), vec2(0.5, -0.8660254)\n);\n\nvec2 cellBase;\n\nvec4 fetchTap(vec2 p) {\n  vec2 uv = p / uResolution;\n\n  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {\n    return vec4(0.0);\n  }\n\n  return texture(tScene, uv);\n}\n\nvec4 sampleCircle(vec2 c) {\n  vec2 middle = cellBase + vec2(c.x, 1.0 - c.y) * uCellPx;\n  float r = uCellPx.y * 0.161;\n  vec4 acc = fetchTap(middle);\n\n  for (int k = 0; k < 6; k++) {\n    acc += fetchTap(middle + RING[k] * r);\n  }\n\n  return acc / 7.0;\n}\n\nfloat circleLum(vec4 acc) {\n  vec3 straight = acc.rgb / max(acc.a, 1e-4);\n\n  return clamp(dot(straight, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0) * acc.a;\n}\n\nfloat dirContrast(float value, float ext) {\n  float peak = max(value, ext);\n\n  if (peak < 1e-4) {\n    return value;\n  }\n\n  return pow(value / peak, EDGE_CONTRAST) * peak;\n}\n\nvoid main() {\n  cellBase = floor(gl_FragCoord.xy) * uCellPx;\n\n  float v[6];\n  vec3 colAcc = vec3(0.0);\n  float alphaAcc = 0.0;\n\n  for (int i = 0; i < 6; i++) {\n    vec4 acc = sampleCircle(INNER[i]);\n\n    v[i] = circleLum(acc);\n    colAcc += acc.rgb;\n    alphaAcc += acc.a;\n  }\n\n  float e[10];\n\n  for (int i = 0; i < 10; i++) {\n    e[i] = circleLum(sampleCircle(OUTER[i]));\n  }\n\n  v[0] = dirContrast(v[0], max(max(e[0], e[1]), max(e[2], e[4])));\n  v[1] = dirContrast(v[1], max(max(e[0], e[1]), max(e[3], e[5])));\n  v[2] = dirContrast(v[2], max(e[2], max(e[4], e[6])));\n  v[3] = dirContrast(v[3], max(e[3], max(e[5], e[7])));\n  v[4] = dirContrast(v[4], max(max(e[4], e[6]), max(e[8], e[9])));\n  v[5] = dirContrast(v[5], max(max(e[5], e[7]), max(e[8], e[9])));\n\n  float peak = max(max(max(v[0], v[1]), max(v[2], v[3])), max(v[4], v[5]));\n\n  if (peak > 1e-4) {\n    for (int i = 0; i < 6; i++) {\n      v[i] = pow(v[i] / peak, CONTRAST) * peak;\n    }\n  }\n\n  int best = 0;\n  float bestD = 1e9;\n\n  for (int g = 0; g < uGlyphCount; g++) {\n    float d = 0.0;\n\n    for (int i = 0; i < 6; i++) {\n      float diff = v[i] - texelFetch(tShapes, ivec2(i, g), 0).r;\n\n      d += diff * diff;\n    }\n\n    if (d < bestD) {\n      bestD = d;\n      best = g;\n    }\n  }\n\n  outColor = vec4(colAcc / max(alphaAcc, 1e-4), float(best) / 255.0);\n}\n";
export const POST_FRAG = /* glsl */ `
// Post pass: glyph compositing with short, cell-aligned signal glitches.
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D tCells;
uniform sampler2D tAtlas;
uniform vec2 uCellsPerUv;
uniform vec2 uGrid;
uniform vec2 uAtlasGrid;
uniform vec2 uAtlasPad;
uniform vec2 uAtlasInner;
uniform vec3 uColor;
uniform float uGlyphCount;
uniform float uTime;
uniform float uGlitch;

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float glyphMask(vec2 cellPos, float corruption, float frame, vec2 dx, vec2 dy) {
  // Shifted samples outside the grid stay transparent instead of repeating an edge cell.
  if (any(lessThan(cellPos, vec2(0.0))) || any(greaterThanEqual(cellPos, uGrid))) {
    return 0.0;
  }

  vec2 cell = floor(cellPos);
  float glyph = floor(texelFetch(tCells, ivec2(cell), 0).a * 255.0 + 0.5);
  // Only corrupt occupied cells, so blank space never fills with random characters.
  if (glyph < 0.5) return 0.0;
  if (hash21(cell + vec2(frame, 17.0)) > 1.0 - corruption * 0.12) {
    glyph = 1.0 + floor(hash21(cell + vec2(31.0, frame)) * (uGlyphCount - 1.0));
  }

  vec2 local = fract(cellPos);
  float gx = mod(glyph, uAtlasGrid.x);
  float gy = floor(glyph / uAtlasGrid.x);
  vec2 atlasUv = vec2(
    (gx + uAtlasPad.x + local.x * uAtlasInner.x) / uAtlasGrid.x,
    (uAtlasGrid.y - gy - 1.0 + uAtlasPad.y + local.y * uAtlasInner.y) / uAtlasGrid.y
  );
  vec2 atlasStep = uAtlasInner / uAtlasGrid;
  return textureGrad(tAtlas, atlasUv, dx * atlasStep, dy * atlasStep).a;
}

void main() {
  vec2 cellPos = vUv * uCellsPerUv;
  // Derivatives come from the undisturbed grid to keep glyphs crisp along tear boundaries.
  vec2 dx = dFdx(cellPos);
  vec2 dy = dFdy(cellPos);
  float frame = floor(uTime * 24.0);
  float glitch = 0.0;
  float tear = 0.0;

  if (uGlitch > 0.0) {
    // A short burst and a weaker echo every few seconds, with a changing start time.
    float cycle = floor(uTime / 6.5);
    float phase = mod(uTime, 6.5);
    float start = 3.0 + hash21(vec2(cycle, 7.0)) * 2.0;
    float burst = step(start, phase) * (1.0 - step(start + 0.24, phase));
    float echo = step(start + 0.4, phase) * (1.0 - step(start + 0.52, phase));
    glitch = uGlitch * max(burst, echo * 0.5);

    // Three character rows share a displacement; offsets land on whole ASCII cells.
    float row = floor(cellPos.y / 3.0);
    tear = step(0.6, hash21(vec2(row, frame)));
    float shift = (hash21(vec2(row + 19.0, frame)) - 0.5) * 8.0;
    cellPos.x += floor(shift * glitch * tear + 0.5);
  }

  float mask = glyphMask(cellPos, glitch * tear, frame, dx, dy);
  vec3 color = uColor * mask;
  float alpha = mask;

  if (glitch > 0.0) {
    // Separate the color channels by less than one cell, with transparent colored fringes.
    float split = glitch * (0.25 + tear * 0.6);
    float redMask = glyphMask(cellPos + vec2(split, 0.0), 0.0, frame, dx, dy);
    float blueMask = glyphMask(cellPos - vec2(split, 0.0), 0.0, frame, dx, dy);
    color = uColor * vec3(redMask, mask, blueMask);
    alpha = max(mask, max(redMask, blueMask));
    color *= 1.0 - glitch * tear * 0.16;
  }

  outColor = vec4(color, alpha);
}
`;
export const QUAD_VERT =
	"// Shared vertex stage for the two full-frame passes. The plane is already in clip space.\n\nout vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position.xy, 0.0, 1.0);\n}\n";
export const SCENE_FRAG =
	"// Scene pass, fragment stage: gradient dome, key lobe, rim lobe, Fresnel, ACES, sRGB.\n//\n// The tone curve is baked in rather than left linear, so the glyph pass can average taps in an\n// 8-bit target without crushing what the shadows hold.\n\nprecision highp float;\nin vec3 vNormal;\nin vec3 vWorld;\nout vec4 outColor;\nuniform float uPaper;\n\nconst vec3 KEY = normalize(vec3(-0.45, 0, 0.45));\nconst vec3 RIM = normalize(vec3(0.62, -0.12, -0.75));\nconst float ROUGHNESS = 0.32;\n\nvec3 studio(vec3 d) {\n  float up = d.y * 0.5 + 0.5;\n\n  // Floor lifted off black: the shaded side is one wide field, and at near-black the cell pass\n  // finds nothing to tell apart down there.\n  return mix(vec3(0.05), vec3(0.4), up * up) + pow(max(dot(d, KEY), 0.0), 6.0) * 1.85 + pow(max(dot(d, RIM), 0.0), 40.0) * 4.5;\n}\n\nvec3 aces(vec3 x) {\n  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);\n}\n\nvec3 encodeSrgb(vec3 c) {\n  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));\n}\n\nvoid main() {\n  vec3 n = normalize(vNormal);\n  vec3 v = normalize(cameraPosition - vWorld);\n  vec3 lobe = normalize(mix(reflect(-v, n), n, ROUGHNESS));\n  float fresnel = 0.05 + 0.95 * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 4.0);\n\n  vec3 lit = encodeSrgb(aces(studio(n) * 0.6 + studio(lobe) * fresnel * 1.35));\n\n  // uPaper: 1 on a light ground, 0 on a dark one. The cell pass spends dense glyphs on high tone,\n  // and on paper density reads as darkness, so light grounds need the tone inverted or the mark\n  // prints as its own negative. The 0.18 floor is the lit side's minimum ink: without it fully lit\n  // tone inverts to zero and the silhouette dissolves exactly where the light lands.\n  outColor = vec4(mix(lit, mix(vec3(0.18), vec3(1.0), 1.0 - lit), uPaper), 1.0);\n}\n";
export const SCENE_VERT =
	"// Scene pass, vertex stage. Attributes and matrices come from three.js's own prefix.\n\nout vec3 vNormal;\nout vec3 vWorld;\n\nvoid main() {\n  vec4 world = modelMatrix * vec4(position, 1.0);\n\n  vWorld = world.xyz;\n  // Uniform scale, so renormalizing is enough and normalMatrix would be wasted work.\n  vNormal = normalize(mat3(modelMatrix) * normal);\n  gl_Position = projectionMatrix * viewMatrix * world;\n}\n";
