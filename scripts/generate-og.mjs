// Generates /public/og-image.png from an inline SVG.
// Re-run: `node scripts/generate-og.mjs`

import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "og-image.png");

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.9" fill="#283044" opacity="0.55"/>
    </pattern>
    <radialGradient id="glow" cx="20%" cy="78%" r="55%">
      <stop offset="0%" stop-color="#00e676" stop-opacity="0.22"/>
      <stop offset="65%" stop-color="#00e676" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#00e676" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="88%" cy="22%" r="38%">
      <stop offset="0%" stop-color="#00a152" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#00a152" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stackgrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00e676" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#00e676" stop-opacity="0.55"/>
    </linearGradient>
  </defs>

  <!-- Canvas -->
  <rect width="1200" height="630" fill="#090b11"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="#141925" stroke-width="1"/>

  <!-- Top-left site indicator -->
  <g transform="translate(80, 78)">
    <rect width="8" height="8" fill="#00e676"/>
    <text x="20" y="9" font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#8490b5" letter-spacing="2">KULDEEP.TECH</text>
  </g>

  <!-- Top-right marker -->
  <g transform="translate(1120, 87)" text-anchor="end">
    <text font-family="DejaVu Sans Mono, monospace" font-size="14" fill="#505d84" letter-spacing="1">// portfolio</text>
  </g>

  <!-- Headline name -->
  <text x="80" y="290" font-family="DejaVu Sans, sans-serif" font-size="104" font-weight="700" fill="#ffffff" letter-spacing="-3">Kuldeep Parmar</text>

  <!-- Accent line -->
  <rect x="80" y="325" width="100" height="5" fill="#00e676"/>

  <!-- Tagline (two lines) -->
  <text x="80" y="388" font-family="DejaVu Sans, sans-serif" font-size="30" fill="#c3cadb" font-weight="400">Software Engineer building scalable backend systems</text>
  <text x="80" y="428" font-family="DejaVu Sans, sans-serif" font-size="30" fill="#c3cadb" font-weight="400">and robust cloud infrastructure.</text>

  <!-- Role pills -->
  <g transform="translate(80, 502)" font-family="DejaVu Sans, sans-serif" font-size="16" font-weight="600">
    <g>
      <rect width="120" height="42" rx="21" fill="#141925" stroke="#283044" stroke-width="1"/>
      <text x="60" y="27" fill="#69ffb4" text-anchor="middle">Backend</text>
    </g>
    <g transform="translate(132, 0)">
      <rect width="112" height="42" rx="21" fill="#141925" stroke="#283044" stroke-width="1"/>
      <text x="56" y="27" fill="#69ffb4" text-anchor="middle">DevOps</text>
    </g>
    <g transform="translate(256, 0)">
      <rect width="180" height="42" rx="21" fill="#141925" stroke="#283044" stroke-width="1"/>
      <text x="90" y="27" fill="#69ffb4" text-anchor="middle">Automation / AI</text>
    </g>
    <g transform="translate(448, 0)">
      <rect width="120" height="42" rx="21" fill="#141925" stroke="#283044" stroke-width="1"/>
      <text x="60" y="27" fill="#69ffb4" text-anchor="middle">Security</text>
    </g>
  </g>

  <!-- Right-side stacked-layers motif: suggests infra / backend stack, placed in upper-right above name -->
  <g transform="translate(900, 110)" stroke="#00e676" fill="none" stroke-width="1.5" stroke-linejoin="round">
    <rect x="40" y="0" width="200" height="38" stroke-opacity="0.25"/>
    <rect x="20" y="30" width="200" height="38" stroke-opacity="0.45" fill="url(#stackgrad)" fill-opacity="0.06"/>
    <rect x="0" y="60" width="200" height="38" stroke-opacity="0.85" fill="url(#stackgrad)" fill-opacity="0.12"/>
  </g>

  <!-- Bottom-right corner mark -->
  <g transform="translate(1120, 588)" text-anchor="end">
    <text font-family="DejaVu Sans Mono, monospace" font-size="13" fill="#505d84" letter-spacing="2">v.2026</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 95, compressionLevel: 9 }).toFile(OUT);

console.log(`Generated ${OUT}`);
