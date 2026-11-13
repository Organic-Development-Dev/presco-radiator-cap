/**
 * Generate the PWA / favicon PNGs from public/icons/icon.svg.
 *   npx tsx scripts/generate-icons.ts
 * Re-run after changing the SVG. The outputs are committed.
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";

const svg = readFileSync("public/icons/icon.svg");
const outputs: [file: string, size: number][] = [
  ["public/icons/icon-192.png", 192],
  ["public/icons/icon-512.png", 512],
  ["public/icons/apple-touch-icon.png", 180],
  ["public/icons/favicon-32.png", 32],
];

await Promise.all(outputs.map(([file, size]) => sharp(svg, { density: 300 }).resize(size, size).png().toFile(file)));

// Maskable: Android crops to a circle/squircle, so keep the cap inside the central 80% safe zone.
const inner = await sharp(svg, { density: 300 }).resize(400, 400).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#445a8e" } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile("public/icons/maskable-512.png");

console.log(`Generated ${outputs.length + 1} icons`);
