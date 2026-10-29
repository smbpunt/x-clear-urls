import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

// Small sizes use a simplified drawing that stays legible at 16px.
const SOURCES = [
  { file: 'assets/icon-16.svg', viewBox: 16, sizes: [16, 32] },
  { file: 'assets/icon.svg', viewBox: 96, sizes: [48, 96, 128] },
];
const SUPERSAMPLE = 4;

const out = process.argv[2] ?? 'public/icon';
mkdirSync(out, { recursive: true });
for (const { file, viewBox, sizes } of SOURCES) {
  for (const s of sizes) {
    await sharp(file, { density: (72 * s / viewBox) * SUPERSAMPLE })
      .resize(s, s)
      .png()
      .toFile(`${out}/${s}.png`);
  }
}
