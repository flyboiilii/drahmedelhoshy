// Renders the two Open Graph images (1200x630) once, with sharp from an SVG.
// Output: public/og-en.png and public/og-ar.png. Commit the results.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");

const W = 1200;
const H = 630;

function card({ lang }) {
  const isAr = lang === "ar";
  const sub = isAr ? "Heliopolis, Cairo" : "Heliopolis, Cairo";
  const line = isAr ? "Prof. Ahmed El Hoshy" : "Prof. Ahmed El Hoshy";
  const arabic = isAr ? `<text x="96" y="340" text-anchor="start" font-family="'Noto Naskh Arabic', 'Segoe UI', 'Arial', sans-serif" font-size="56" fill="#1F1C1A">عيادة الهوشي للأسنان</text>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#F4F0E9"/>
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="#E3DBD0" stroke-width="2"/>
  <text x="96" y="150" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="6" fill="#7A6557">DENTAL CLINIC</text>
  <text x="96" y="${isAr ? 250 : 290}" font-family="Georgia, 'Times New Roman', serif" font-size="96" fill="#1F1C1A">El Hoshy <tspan fill="#7A6557">Dental</tspan></text>
  ${arabic}
  <text x="96" y="${H - 150}" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#5E544B">${line}</text>
  <text x="96" y="${H - 110}" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="4" fill="#7A6557">${sub.toUpperCase()}</text>
  <line x1="96" y1="${H - 84}" x2="${W - 96}" y2="${H - 84}" stroke="#C8B08A" stroke-width="1"/>
</svg>`;
}

for (const lang of ["en", "ar"]) {
  const out = path.join(PUB, `og-${lang}.png`);
  await sharp(Buffer.from(card({ lang }))).png().toFile(out);
  console.log("wrote", `og-${lang}.png`);
}
