// Turns the Blender preview renders (1200 x 960, alabaster background) into the
// sequence posters used on phones and weak devices. Usage: node scripts/posters.mjs <render dir>
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/posters.mjs <directory with the *-preview-*.png renders>");
  process.exit(1);
}
const MAP = {
  veneer: "veneer-preview-3-lifted.png",
  implant: "implant-preview-2-cutaway.png",
  aligner: "aligner-preview-3-tray-above.png",
  fullmouth: "fullmouth-preview-2-halfway.png",
  arch: "arch-preview-3-wipe.png",
};
for (const [name, file] of Object.entries(MAP)) {
  const from = join(src, file);
  if (!existsSync(from)) {
    console.warn("missing", from);
    continue;
  }
  const to = join(root, "public", "posters", `${name}.webp`);
  await sharp(from).resize(1200, 960, { fit: "cover" }).webp({ quality: 82 }).toFile(to);
  console.log("wrote", to);
}
