// Generates flat, stone-coloured placeholder images for every image slot and
// poster so the build never 404s. Re-run with `npm run assets` after changing
// the lists below. Real photographs replace these files one for one.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public");

const C = {
  alabaster: "#F4F0E9",
  paper: "#FBF8F3",
  limestone: "#D9CFC2",
  sand: "#EDE6DC",
  line: "#E3DBD0",
  bronzeDeep: "#7A6557",
  graphite: "#1F1C1A",
  muted: "#5E544B",
};

function svg({ w, h, from, to, label, sub }) {
  const fs = Math.round(Math.min(w, h) * 0.045);
  const fs2 = Math.round(fs * 0.7);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/>
      <stop offset="1" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect x="${Math.round(w * 0.04)}" y="${Math.round(h * 0.06)}" width="${Math.round(w * 0.92)}" height="${Math.round(h * 0.88)}" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 10"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${fs}" fill="${C.bronzeDeep}" letter-spacing="2">${label}</text>
  ${sub ? `<text x="50%" y="${Math.round(h * 0.5 + fs * 1.6)}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fs2}" fill="${C.muted}" letter-spacing="3">${sub}</text>` : ""}
</svg>`;
}

async function make(file, opts) {
  const out = path.join(PUB, file);
  await mkdir(path.dirname(out), { recursive: true });
  const img = sharp(Buffer.from(svg(opts)));
  if (file.endsWith(".webp")) await img.webp({ quality: 80 }).toFile(out);
  else if (file.endsWith(".png")) await img.png().toFile(out);
  else await img.jpeg({ quality: 72, mozjpeg: true }).toFile(out);
  console.log("wrote", file);
}

const cases = ["014", "009", "011", "017", "021", "023", "026", "031"];

const jobs = [];
for (const n of cases) {
  jobs.push(make(`placeholders/case-${n}-before.jpg`, { w: 1400, h: 1050, from: C.limestone, to: C.sand, label: "[IMAGE]", sub: `CASE ${n} BEFORE` }));
  jobs.push(make(`placeholders/case-${n}-after.jpg`, { w: 1400, h: 1050, from: C.paper, to: C.alabaster, label: "[IMAGE]", sub: `CASE ${n} AFTER` }));
}
jobs.push(make("placeholders/professor-portrait.jpg", { w: 1200, h: 1600, from: C.limestone, to: C.sand, label: "[IMAGE]", sub: "PROFESSOR PORTRAIT 3:4" }));
jobs.push(make("placeholders/professor-chair.jpg", { w: 1600, h: 900, from: C.sand, to: C.limestone, label: "[IMAGE]", sub: "AT THE CHAIR 16:9" }));
jobs.push(make("placeholders/clinic-exterior.jpg", { w: 1600, h: 1067, from: C.sand, to: C.alabaster, label: "[IMAGE]", sub: "CLINIC EXTERIOR" }));
jobs.push(make("placeholders/reception.jpg", { w: 1600, h: 1067, from: C.paper, to: C.sand, label: "[IMAGE]", sub: "RECEPTION" }));
jobs.push(make("placeholders/treatment-room.jpg", { w: 1600, h: 1067, from: C.paper, to: C.sand, label: "[IMAGE]", sub: "TREATMENT ROOM" }));
jobs.push(make("placeholders/sterilisation.jpg", { w: 1600, h: 1067, from: C.paper, to: C.sand, label: "[IMAGE]", sub: "STERILISATION AREA" }));
jobs.push(make("placeholders/team-01.jpg", { w: 1200, h: 1600, from: C.limestone, to: C.sand, label: "[IMAGE]", sub: "TEAM MEMBER" }));
jobs.push(make("placeholders/team-02.jpg", { w: 1200, h: 1600, from: C.limestone, to: C.sand, label: "[IMAGE]", sub: "TEAM MEMBER" }));
for (const i of [1, 2, 3]) {
  jobs.push(make(`placeholders/reel-${i}.jpg`, { w: 1080, h: 1920, from: C.sand, to: C.limestone, label: "[STILL]", sub: `REEL ${i}` }));
}
for (const p of ["veneer", "implant", "aligner", "fullmouth", "arch", "whitening-bonding", "general-dentistry"]) {
  jobs.push(make(`posters/${p}.webp`, { w: 1200, h: 960, from: C.alabaster, to: C.limestone, label: "", sub: "" }));
}

await Promise.all(jobs);
console.log("placeholders done");
