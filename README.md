# El Hoshy Dental Clinic website

Static, bilingual site for El Hoshy Dental Clinic, Heliopolis, Cairo. English at `/`, Arabic (RTL) at `/ar`. Built with Next.js 15 (App Router, static export), TypeScript, Tailwind v4, react-three-fiber, GSAP and Lenis. No backend, no API keys needed to run.

The build brief is in `BUILD_BRIEF.md` and is the source of truth for every fact on the site. Anything the brief does not state is a visible placeholder in the content files: `[IMAGE]`, `[ENTRY PRICE]`, `[CONFIRM]`, `[PLACEHOLDER]` and similar tokens.

## Run

Node 20 or newer (`.nvmrc` says 20; Node 22 also works), npm.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to out/
npm run preview      # serves out/ on http://localhost:4173
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run assets       # regenerates placeholder images and the two OG images (sharp)
npm run draco        # copies the Draco decoder from three into public/draco
node scripts/check-jsonld.mjs   # structural check of every JSON-LD block in out/
```

Environment variables (all optional, see `.env.example`):

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Base URL for canonical links, hreflang, sitemap and JSON-LD. Defaults to `https://drahmedelhoshy.com`. |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | When set, the lead form also posts a JSON copy of each lead to Web3Forms (email). |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | When set, the Cloudflare Web Analytics beacon is added to every page. |

## Where things live

```
app/
  (en)/            English tree, served at /          (root layout: <html lang="en" dir="ltr">)
  ar/              Arabic tree, served at /ar         (root layout: <html lang="ar-EG" dir="rtl">)
  global-not-found.tsx   bilingual 404 for URLs outside both trees
  sitemap.ts, robots.ts  generated at build
  globals.css      design tokens (section 3 of the brief), type scale, buttons, motion
  fonts.ts         Instrument Serif, Instrument Sans, Noto Naskh Arabic via next/font
components/
  pages/           one file per page type; route files in app/ are thin wrappers
  sections/        hero, before/after viewer, treatments, professor, abroad, reviews, book, FAQ
  cases/           case cards, CSS-filtered grid, consent gate
  forms/           LeadForm (WhatsApp composer, optional Web3Forms copy)
  layout/          Header, Footer, StickyBar (mobile), LangSwitch, client effects
  three/           root Canvas, drei View bridge, the four scroll sequences, arch viewer
  seo/             JsonLd
content/           all copy and facts as JSON, validated with Zod at build (lib/content.ts)
  i18n/en.json, ar.json   UI strings; the Arabic file must mirror every English key (typed)
  models.json      which GLBs exist (all false until the artist delivers)
lib/               content loader, i18n helpers, routes, SEO metadata, JSON-LD, WhatsApp, tracking, device check
public/
  placeholders/    flat stone-coloured stand-ins for every image slot
  posters/         poster fallbacks for the 3D sequences and the treatment list
  models/          drop GLBs here (empty)
  draco/           Draco decoder, copied from three
  og-en.png, og-ar.png   Open Graph images rendered by scripts/og.mjs
sanity/schemas/    TypeScript mirrors of the content types, not wired (see "Sanity swap")
scripts/           placeholders.mjs, og.mjs, copy-draco.mjs, check-jsonld.mjs
```

Both language trees share the same page components; each route file passes `lang`. UI strings come from `content/i18n/*.json` through `getDict(lang)`. Localised content fields are `{ en, ar }` pairs read with `l(value, lang)`.

## Content

Every file in `content/` is parsed with a Zod schema in `lib/content.ts` when the site builds. A missing field, a wrong type, an FAQ id that does not exist, or a concern pointing at a missing case fails `npm run build` with a readable message.

- `settings.json`: names, address, phones, hours, socials, rating, coordinates, licence number.
- `services.json`: the six treatment pages (title, fear-first intro, steps, who it is for, materials, cost paragraph, model, FAQ ids).
- `cases.json`: before/after cases (see "Adding a case").
- `reviews.json`: one real paraphrase (Salma R.) and five placeholders.
- `faqs.json`: 30 questions, each tied to a service.
- `awards.json`, `team.json`, `pricing.json`, `concerns.json`.
- `i18n/en.json`, `i18n/ar.json`: UI strings, sequence copy, page copy that is not content-driven.

Copy rules enforced by hand, not by code: no em dashes, no exclamation marks, no superlatives, no guarantees, a consent line under every case.

### Adding a case

1. Put the two photographs in `public/placeholders/` (or any folder under `public/`), same angle and light, 4:3, about 1400 px wide and under 150 KB each. Keep the hero case under 120 KB: it is the largest contentful paint on the home page.
2. Add an entry to `content/cases.json`:

```json
{
  "slug": "case-032",
  "caseNumber": "032",
  "treatmentSlug": "veneers",
  "ageBand": { "en": "30 to 39", "ar": "٣٠ إلى ٣٩" },
  "ageLabel": { "en": "36 years old", "ar": "٣٦ عاماً" },
  "gender": "f",
  "teethCount": 8,
  "material": "Lithium disilicate",
  "visits": 3,
  "monthsPostOp": 6,
  "before": "/cases/case-032-before.jpg",
  "after": "/cases/case-032-after.jpg",
  "story": { "en": ["...", "...", "..."], "ar": ["...", "...", "..."] },
  "consent": true,
  "featured": false,
  "placeholder": false
}
```

`consent` must be `true` or the build fails. `featured` puts the case on the home grid. The hero case is `case-014`; change the slug in `components/pages/HomePage.tsx` to feature a different one. The case page, both language trees, the sitemap and the filters pick the new case up automatically.

## 3D sequences

Four scroll-driven explainers (`veneer`, `implant`, `aligner`, `fullmouth`) answer one fear each, as section 8 of the brief describes. Engineering:

- One root `<Canvas>` per layout (`components/three/RootCanvas.tsx`), `frameloop="demand"`, `dpr` 1 to 1.5, fixed over the page with `pointer-events: none`. It is only mounted once a sequence asks for it, so three.js is never downloaded on pages without 3D or by visitors who never scroll.
- Each sequence is a drei `<View>` rendered inside the poster box of its section (`components/three/SequenceView.tsx`). Outside the Canvas, drei's `View` renders its own tracking `div`, which is why it must live in the box rather than track a ref.
- `lib/useScrollProgress.ts` creates a GSAP ScrollTrigger (`pin: true`, `scrub: 0.6`) that writes progress into a ref and calls `invalidate()`. The models read the ref in `useFrame`.
- Weak-device fallback (`lib/device.ts`): `prefers-reduced-motion`, `deviceMemory < 4`, `hardwareConcurrency < 4`, no WebGL2 or Save-Data all get the poster and the step text only.
- Posters: `public/posters/{veneer,implant,aligner,fullmouth}.webp`.

### Dropping in a GLB

1. Export from Blender with Draco, under 1.5 MB and 50K triangles, PBR, baked AO, KTX2 1024 textures, morph targets not skeletons, node names exactly as in section 8 of the brief (`tooth`, `prepLayer`, `veneer`; `bone`, `gum`, `fixture`, `abutment`, `crown`; `arch` with morphs `m0`, `m6`, `m12` and `tray`; `arch` with morph `worn` to `restored` and `crown_01` to `crown_10`; `archBefore`, `archAfter`).
2. Save it as `public/models/{veneer|implant|aligner|fullmouth|arch}.glb`.
3. Flip the matching flag in `content/models.json` to `true`. The sequence component switches from the procedural stand-in to the GLB version (same choreography on the named nodes). `arch: true` swaps the home hero from the image compare to the 3D `ArchViewer`.
4. The Draco decoder (`public/draco/`) and the KTX2 transcoder (`public/basis/`) are served locally; run `npm run draco` after upgrading three. GLBs may use Draco geometry and KTX2 textures, as the artist brief in `MODELS-BRIEF.md` asks.

## Conversion layer

- WhatsApp: `lib/whatsapp.ts` builds `https://wa.me/201028294777?text=...` with a page-aware message in the current language. `WhatsAppLink`, the sticky bar and every WhatsApp button use it.
- Lead form (`components/forms/LeadForm.tsx`): name, WhatsApp number, treatment, visit type, preferred day. Validates on the client, composes the message, `window.open`s the wa.me URL and shows a thank-you state. With `NEXT_PUBLIC_WEB3FORMS_KEY` set it also posts JSON to Web3Forms.
- Call: `tel:+201028294777`. Maps: an iframe whose src is built from the verified coordinates until the Google place embed URL is supplied in `content/settings.json`.
- Tracking: elements carry `data-event="whatsapp|call|book"`. `lib/track.ts` forwards to Cloudflare Zaraz when `window.zaraz` exists and always dispatches an `elhoshy:track` DOM event. Cloudflare Web Analytics itself counts page views when the beacon token is set.

## SEO

- `lib/seo.ts` builds per-page metadata: title, description, canonical, `hreflang` for `en`, `ar` and `x-default` (English), Open Graph and Twitter cards with `/og-en.png` or `/og-ar.png`.
- `lib/jsonld.ts`: `Dentist` + `MedicalClinic` (home, book), `Physician` (doctor page), `MedicalProcedure` and `FAQPage` (service pages), `FAQPage` (FAQ), `BreadcrumbList` (every page). A `Review` helper exists but is not emitted (see Decisions).
- `app/sitemap.ts` lists both trees with alternates; `app/robots.ts` allows everything and points at the sitemap.
- Footer carries the name variants once for search: "El Hoshy Dental Clinic (Elhoshy, El-Hoshy) · عيادة الهوشي".

## Sanity swap (phase 1, after the deposit)

The JSON files are the content model. `sanity/schemas/` already mirrors them as plain TypeScript objects in the shape `defineType()` accepts. To swap:

1. `npm create sanity@latest` in a sibling folder (or `sanity/` here), install `sanity` and `@sanity/client`, and register `schemaTypes` from `sanity/schemas/index.ts` with `defineType`.
2. Import the current JSON into the dataset with `sanity dataset import` after converting each file to NDJSON (one document per entry; images become asset references).
3. Replace the JSON imports at the top of `lib/content.ts` with a GROQ fetch at build time (`@sanity/client` with `useCdn: true`), keeping the Zod schemas as they are so the rest of the site does not change. Static export still works: data is fetched once during `next build`.
4. Add a Sanity webhook that triggers a Cloudflare Pages deploy hook so publishing in the studio rebuilds the site.

Nothing in the page components depends on where the content comes from.

## Deploying to Cloudflare Pages

1. Push the repository to GitHub (`main`).
2. Cloudflare dashboard: Workers and Pages, Create, Pages, Connect to Git, pick the repo.
3. Framework preset: Next.js (Static HTML Export). Build command `npm run build`. Output directory `out`. Environment variable `NODE_VERSION` = `20`. Add `NEXT_PUBLIC_SITE_URL` (and the optional keys) as needed.
4. Deploy. The `out/` folder contains both language trees, `404.html`, `sitemap.xml`, `robots.txt` and the OG images.
5. Custom domain: in the Pages project add the apex (`drahmedelhoshy.com`) and `www`. With the domain at Cloudflare Registrar the DNS records are created for you. Redirect `www` to the apex with a Bulk Redirect.

The full checklist, including the launch-day list, is in section 13 of the brief.

## Verification record (phase 1 build, 17 October 2026)

- `npm run lint`, `npm run typecheck`, `npm run build`: pass. 63 static pages.
- Static server on `out/`: `/`, `/ar/`, `/veneers/`, `/ar/veneers/`, `/cases/`, `/book/`, a case page and an unknown path (404) all return the expected status.
- Lighthouse mobile (headless Chrome, Lighthouse 13.5, reports in `lighthouse/`, kept out of git): `/` 92 performance, 100 accessibility, 100 best practices, 100 SEO (LCP 2.9 s, TBT 180 ms, CLS 0.04); `/ar/` 90 / 100 / 100 / 100 (TBT 220 ms); `/veneers/` 95 / 100 / 100 / 100. Scores vary by two or three points between runs. In this headless setup the first paint lands at about 1.2 s on every page regardless of content, so field numbers on real phones should be better, not worse.
- Four 3D sequences, consent gate, case filters, language switch and the mobile sticky bar checked in the built site, with no console errors.
- Lead form opens the right `wa.me` URL with every field in both languages (verified by intercepting `window.open`).
- Arabic tree: `<html lang="ar-EG" dir="rtl">`, mirrored layout, before/after wipe reads right to left.
- JSON-LD: 90 blocks across both trees parse and carry the required fields (`scripts/check-jsonld.mjs`).

## Decisions

Choices made where the brief was silent or where two of its rules met:

- **Header is static, not sticky.** Terracotta may appear once per viewport. A sticky header with the terracotta button would collide with the book section's button; the mobile sticky bar carries the call to action instead.
- **Hero buttons are dark and outline.** Same rule: the header's terracotta button owns the first viewport.
- **"Treatments" in the nav links to the treatments list on the home page** (`/#treatments`). The six service links also sit in the footer and the mobile menu, so no dropdown was needed.
- **Every inner page has a `#book` block** (`BookCta`), so the header button works on every page, not only the home page.
- **Bronze-deep text is darkened 20% toward graphite on sand backgrounds** (`--bronze-ink`), because `#7A6557` on `#EDE6DC` is 4.43:1, just under the 4.5:1 needed for 12px text. The palette hex values themselves are unchanged.
- **Captions use `--muted`, not `--muted-2`.** `#7A6F65` on alabaster is 4.31:1, below AA for small text; `--muted-2` is kept for larger decorative text.
- **Arabic before/after reads right to left**: "before" sits on the right, the wipe reveals "after" on the left. English keeps the usual left-to-right order.
- **Case filtering is CSS-driven.** Cards are server-rendered; the filter bar only sets `data-filter` on the grid. It keeps the home page's hydration small.
- **Lenis, GSAP and three.js load after the first scroll or touch.** Nothing from them is in the initial bundle, and a visitor who never scrolls (or an audit robot) never downloads them. The pinned sequence upgrades from the poster when the user comes within about 1200px of it.
- **Global 404 uses Next's `global-not-found` convention** (experimental flag) so the page can be branded and bilingual without a shared root layout.
- **`Review` structured data is not emitted.** The only real review is a paraphrase; review markup should carry verbatim text with permission. The helper is ready in `lib/jsonld.ts`.
- **Google Maps links use the verified coordinates** (`maps/search/?api=1&query=30.0943,31.3299`) until the place URL and embed URL are supplied.
- **The OG images use system serif fonts**, rendered once with sharp. Instrument Serif is not available to librsvg at build time; the wordmark still reads as a serif. Re-render with `npm run assets` if the copy changes.
- **No font preload links.** The fonts are declared with `font-display: swap` and size-adjusted fallbacks, so text paints at once and swaps a moment later; the preload links only added bytes to the critical path.
- **Suspense boundaries around page sections.** The server still renders everything; on the client React hydrates each boundary in its own small task instead of one long one, which cut total blocking time on the home page from about 390 ms to under 200 ms.
- **On small screens only the active step of a pinned sequence shows its text**, and the 3D box is 16:10 rather than 4:3, so the pinned section fits a phone viewport.
- **`scroll-padding-bottom` on mobile** keeps anchored targets above the sticky bar.
- **The clinic's six-petal mark is redrawn as a single-colour vector** (`components/ui/LogoMark.tsx`, favicon, OG images). The original artwork is blue, which the palette excludes, so the mark sits in graphite or brass beside the serif wordmark. Swap in the clinic's vector file when it arrives.
- **Site URL defaults to `https://drahmedelhoshy.com`** (the domain chosen on 18 October 2026). Set `NEXT_PUBLIC_SITE_URL` if a different domain is bought before the first deploy.
- **Node 22 was used for the build on this machine**; the project pins 20 for Cloudflare (`NODE_VERSION`, `.nvmrc`). Both work.
- **The GLB models are built headlessly in Blender 4.2** from the scripts in `blender/` (one script per model, shared helpers in `common.py`). The brief asked for an artist; no artist was available before the pitch, so the geometry is scripted: lofted cross-sections, Draco export, previews rendered from the site's camera. Rebuild one with `"<blender>" --background --python blender/veneer.py -- <out dir>` and copy the `.glb` into `public/models/`. Each script prints the node list with triangle counts.
- **Veneer preparation depth is 0.02 to 0.09 units** on a crown 1 unit tall (about half a millimetre on a real tooth), not the 0.4 to 0.6 the first brief suggested, which would have read as a quarter of the tooth. All three veneer nodes are cut from one subdivided mesh: the veneer is the removed layer itself, its outer surface is the tooth face and the prepared tooth sits 0.004 inside its fitting surface, so nothing z-fights when it seats. The enamel node is hidden once it has faded for the same reason.
- **Vertex colours instead of textures in the GLBs.** Bone section, old crowns, the before-arch mottling and the gum are painted per vertex. One material per node keeps each node a single primitive, which is what lets three.js keep `morphTargetInfluences` on the mesh itself; a second material would split the node into a group and the aligner and full mouth morphs would stop working.
- **Vertex colours are float colour layers, not byte layers.** A bmesh byte colour layer reads assigned floats as sRGB, so linear values written to it come out roughly a stop darker in the export (the first builds had grey teeth and a deep red gum for this reason). `loops.layers.float_color` stores what it is given.
- **No clearcoat in the GLBs.** The implant crown and the full mouth crowns rendered mid grey in three.js with KHR_materials_clearcoat through drei's loader; plain roughness gives the same gloss at this size.
- **The poster under a live view fades out once the model is drawing** (`data-live` on the host, set from a `Ready` child inside the Suspense boundary). The canvas is transparent, so before this the Blender still showed through behind the live geometry as a misaligned ghost.
- **The home hero keeps the real photo compare.** The scripted 3D arch lives in its own section below the veneer explainer (`components/sections/ArchSection.tsx`, shown only when `arch.glb` exists). A real case is a stronger opening than an illustration, and the two were being read as the same thing.
- **The aligner tray carries the same morph targets as the arch** (m6, m12), built as one shell per stage with identical topology, so it always fits the teeth it is moving. A tray shaped for the finished arch let crowded teeth poke through it.
- **Arch teeth are levelled to one incisal plane**: canine tips at the level of the centrals, laterals a tenth shorter, posterior cusps low. The first build had tall pointed canines and short laterals that read as crooked even in the after state.
- **Arch slots are contact-to-contact widths, no gap.** Spacing teeth by their widest ring left visible gaps once each tooth turned with the arch, because the widest ring is near the incisal edge and the teeth are thin. The slots now sit a little inside that ring, so neighbours meet at contact points, and the incisors carry more labio-lingual depth.
- **GLB nodes keep their rest position in `userData`.** drei caches a loaded scene across mounts, so a sequence that reads a node position on its first frame after a client-side navigation would read a mid-animation value and seat the part in the wrong place (the veneer stuck to the right on the veneers page after visiting the home page).
- **The aligner tray draws only its outer faces** (FrontSide, no depth write, 0.38 opacity, 0.03 thick). A double-sided blended shell showed its inner surfaces and every overlap between neighbouring teeth through itself.
- **Hosting is a Cloudflare Worker serving static assets, not a Pages project.** The brief named Pages, but the dashboard the user set up on 18 October 2026 creates Workers for Git imports, and its auto-configuration tried to turn the static export into an OpenNext server app and failed. `wrangler.jsonc` points the deploy at `out` as plain static assets: same free static hosting, no server code, same custom-domain flow (Settings, Domains and Routes). Build command `npm run build`, deploy command `npx wrangler deploy`.
- **Fonts are self-hosted in `public/fonts` and preloaded by name.** With next/font the display serif arrived after first paint and the hero heading reflowed (CLS 0.25 on the live home page), and Next 15.5 emitted no font preload links in the static export, so `app/fonts.css` carries the same font-face rules and metric-adjusted fallbacks that next/font generated, and each layout preloads the two or three files its first paint needs. English pages do not download the Arabic font.
- **The hero arch section waits for the first interaction**, like every other 3D view. Mounting it on page load pulled three.js into the home page's first two seconds and dropped the mobile performance score to 61.
- **Performance is verified with PageSpeed Insights, not local Lighthouse.** Headless Chrome on the build laptop presents no frame for one to two seconds after navigation (the trace shows an idle renderer and black filmstrip frames), which inflates LCP and sinks the score by 20 to 30 points at random. Google's run of the live site on 18 October 2026: home 96, Arabic home 94, veneers 100, with accessibility, best practices and SEO at 100 on all three.
- **No free consultation anywhere; every call to action is "Book on WhatsApp"** (decided by the clinic, 18 October 2026). The prefilled WhatsApp message is the same on every page: "Hello, I would like to book a consultation session. I found you on the website https://drahmedelhoshy.com", with an Arabic equivalent.
- **The canvas renders every frame while a 3D section is on screen** (`sceneStore.setActive`, an IntersectionObserver per sequence and on the arch box) and on demand otherwise. With demand-only frames the view lagged behind fast touch scrolling and the model tore away from its box on phones; the box behind a live model is also transparent now, so any residual lag has no frame to show against.
- **The implant, aligner and arch scenes are scaled to the site cameras** (0.72, 0.8 and 0.72 of the brief's nominal sizes) so the whole model, crown included, sits inside the frame without touching the camera tables in `SequenceView.tsx`.
- **The aligner tray is ten per-tooth shells joined in one mesh**, not a single swept band: it hugs the aligned crowns exactly and reads as a thin film, which is what a real tray looks like.
- **Sequence posters come from the Blender renders** of the same models (`npm run posters -- <render dir>`), 1200 x 960 on alabaster, so phones see the same objects the desktop animates.
- **No transmission materials in the GLBs.** The aligner tray is alpha-blended rather than refractive, and the veneer is opaque porcelain that fades in through code: three.js renders every transmissive object through an extra full-frame pass each frame, which the phone budget does not have, and at this size the two looks are hard to tell apart.
- **Frame requests go through `sceneStore.invalidate()`, never `useThree().invalidate` inside a View.** The canvas runs on demand; a drei View is an R3F portal whose copy of `invalidate` counts frames on the portal's own state, which the root loop never reads. The hero arch viewer stayed blank until the first scroll for exactly this reason.
