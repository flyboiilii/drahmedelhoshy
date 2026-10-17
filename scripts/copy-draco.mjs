// Copies the Draco decoder from three's examples into public/draco/ so GLBs
// compressed with Draco load without any CDN. Runs via `npm run draco`.
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "node_modules", "three", "examples", "jsm", "libs", "draco", "gltf");
const DST = path.join(ROOT, "public", "draco");

await mkdir(DST, { recursive: true });
for (const f of ["draco_decoder.js", "draco_decoder.wasm", "draco_wasm_wrapper.js"]) {
  await copyFile(path.join(SRC, f), path.join(DST, f));
  console.log("copied", f);
}
