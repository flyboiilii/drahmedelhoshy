// Copies the Draco decoder and the Basis (KTX2) transcoder from three's examples
// into public/, so GLBs with Draco geometry and KTX2 textures load without any
// CDN. Runs via `npm run draco`; re-run after upgrading three.
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIBS = path.join(ROOT, "node_modules", "three", "examples", "jsm", "libs");

const jobs = [
  ["draco/gltf", "draco", ["draco_decoder.js", "draco_decoder.wasm", "draco_wasm_wrapper.js"]],
  ["basis", "basis", ["basis_transcoder.js", "basis_transcoder.wasm"]],
];

for (const [src, dst, files] of jobs) {
  const out = path.join(ROOT, "public", dst);
  await mkdir(out, { recursive: true });
  for (const f of files) {
    await copyFile(path.join(LIBS, src, f), path.join(out, f));
    console.log("copied", dst + "/" + f);
  }
}
