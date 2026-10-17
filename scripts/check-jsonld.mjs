// Structural check of every JSON-LD block in the static export: parses each
// block, verifies the types the brief requires carry their key fields, and
// lists per page what was found. Run after `npm run build`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name === "index.html") acc.push(p);
  }
  return acc;
}

const REQUIRED = {
  Dentist: ["name", "address", "geo", "telephone", "openingHoursSpecification", "sameAs", "aggregateRating"],
  MedicalClinic: ["name", "address"],
  Physician: ["name", "alumniOf", "award", "medicalSpecialty"],
  MedicalProcedure: ["name", "description", "howPerformed"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
};

let blocks = 0;
let problems = 0;
const counts = {};

for (const file of walk(OUT)) {
  const html = readFileSync(file, "utf8");
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    blocks++;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      problems++;
      console.log("INVALID JSON in", path.relative(OUT, file), String(e));
      continue;
    }
    const types = Array.isArray(data["@type"]) ? data["@type"] : [data["@type"]];
    for (const t of types) {
      counts[t] = (counts[t] ?? 0) + 1;
      for (const key of REQUIRED[t] ?? []) {
        if (data[key] === undefined || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          problems++;
          console.log(`MISSING ${t}.${key} in`, path.relative(OUT, file));
        }
      }
    }
    if (types.includes("FAQPage")) {
      for (const q of data.mainEntity) {
        if (!q.name || !q.acceptedAnswer?.text) {
          problems++;
          console.log("FAQ item incomplete in", path.relative(OUT, file));
        }
      }
    }
    if (types.includes("BreadcrumbList")) {
      data.itemListElement.forEach((it, i) => {
        if (it.position !== i + 1 || !it.name || !it.item) {
          problems++;
          console.log("Breadcrumb item incomplete in", path.relative(OUT, file));
        }
      });
    }
    if (data["@context"] !== "https://schema.org") {
      problems++;
      console.log("Missing @context in", path.relative(OUT, file));
    }
  }
}

console.log(`JSON-LD blocks: ${blocks}`);
console.log("Types:", counts);
console.log(problems === 0 ? "OK: no structural problems" : `PROBLEMS: ${problems}`);
process.exitCode = problems === 0 ? 0 : 1;
