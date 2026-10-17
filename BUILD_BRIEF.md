# El Hoshy Dental Clinic — Website Build Brief

This file is the single source of truth for building the site. Read all of it before writing code. Every fact below was verified on 17 Oct 2026 from public sources. Anything not in this file is a placeholder and must be marked as one, never invented.

---

## 0. Working rules for the build session

1. Build the entire site first, end to end, with placeholders. Do not stop to ask about images, prices, domain or accounts. Only stop when the site is complete, running locally, type-checked, built with `next build`, and committed.
2. After the build, print the PLACEHOLDERS checklist (section 12) and wait. The user will supply images, confirm facts, buy the domain and link it. Only then run the deploy steps (section 13).
3. Simplicity rule (the "DJ Dizzy rule"): if something works as a plain link or static file, do it that way. No backend, no API keys required to run, no paid services. WhatsApp is a `wa.me` link. The lead form opens WhatsApp with a composed message. Maps is an iframe. Nothing needs a server.
4. Never write marketing superlatives ("best dentist in Egypt"), never promise results, never show a patient image without a consent note. Egypt's Medical Syndicate draft rules (July 2026) ban both.
5. No em dashes in any copy. Plain punctuation.
6. No emoji in the UI. Icons are inline stroke SVG.
7. English is the default language at `/`. Arabic mirror at `/ar`. Arabic pages are RTL.
8. Everything must pass `npm run build` with `output: "export"`. No server components that need a runtime, no middleware, no ISR, no API routes.

---

## 1. Client facts (verified)

| Field | Value |
| --- | --- |
| Clinic name (master brand) | El Hoshy Dental Clinic |
| Arabic clinic name | عيادة الهوشي للأسنان |
| Doctor | Prof. Ahmed Zoheir El Hoshy |
| Arabic name | أ.د. أحمد زهير الهوشي |
| Spelling variants (SEO only) | Elhoshy, El-Hoshy, Hoshy, Ahmed Zohier El Hoshy, الهوشى |
| Address | 47 Cleopatra St, Salah El Din, Korba, Heliopolis, Cairo 11345, facing Cleopatra Hospital |
| Arabic address | ٤٧ شارع كليوباترا، صلاح الدين، الكوربة، مصر الجديدة، القاهرة، أمام مستشفى كليوباترا |
| Coordinates | 30.0943, 31.3299 |
| Hours | Saturday to Thursday 11:00 to 21:30, closed Friday |
| Primary phone / WhatsApp | +20 102 829 4777 (wa.me/201028294777) |
| Other phones | +20 122 107 0377, +20 2 2414 7290 |
| Google rating | 4.9 from 141 reviews |
| Google review keyword chips | infection control, virtually painless, dental aesthetics |
| Instagram | https://www.instagram.com/elhoshydentalclinic/ (7,561 followers, 701 posts) |
| Facebook | https://www.facebook.com/ehhoshy |
| Linktree | https://linktr.ee/hoshyclinic |
| Languages spoken | Arabic, English, French, Italian |
| Payment | Cards, payment plans available, free first consultation |
| Existing website | None |

### Credentials (from his Future University CV and Instagram bio)

- Bachelor of Oral and Dental Medicine, Cairo University, 1997
- Master's in Restorative Dentistry, Cairo University, 2003
- PhD in Restorative Dentistry, Cairo University, 2007
- Assistant Lecturer then Lecturer, Cairo University, 2002 to 2009
- Professor, Faculty of Dentistry, Future University in Egypt (FUE)
- Self-described: Professor of Esthetic Dentistry, Cairo University
- Award: First African and Arab bur designer for Ceraline, Komet (Germany)
- Award: DENTSPLY award for outstanding Master's performance
- Award: Gold medal, highest score in Oral Histology and Restorative Dentistry
- Award: Silver medal, second highest score in Oral Pathology
- Teaches courses to dentists (Instagram "Course" highlight)
- Family: Prof. Zoheir El Hoshy, Professor of ENT, Cairo University, listed at the same clinic

### Services (confirmed on his listings)

Veneers, smile design, Invisalign and braces, dental implants, bone graft and sinus lift, crowns and bridges, whitening, root canals, gum treatment, TMJ, paediatric dentistry, fillings, dentures.

### Real patient quote (Google review, use with first name and initial only)

"I am an Egyptian American woman that was diagnosed with advanced periodontal..." — Salma R. Use as: "I flew in from the US with advanced gum disease and left with my teeth, and my confidence, intact." attributed to Salma R., Egyptian American patient. Mark as paraphrased from a Google review.

---

## 2. Positioning and voice

One line: The professor of aesthetic dentistry who teaches the dentists other clinics hire.

Voice: calm, precise, kind. First person from the professor on the About page. No superlatives, no guarantees, no offers language, no exclamation marks. Arabic in clean Modern Standard Arabic with warmth, not stiff. English at the level of a London private practice.

Hero (Concept B, case-led): a full-width before/after case with the headline "The work speaks. Quietly." Arabic: "النتيجة تتكلّم. بهدوء."

---

## 3. Design system: Alabaster and Light

### Colours

| Token | Hex | Use |
| --- | --- | --- |
| --alabaster | #F4F0E9 | Page ground |
| --paper | #FBF8F3 | Cards, form backgrounds |
| --limestone | #D9CFC2 | Secondary surfaces, dividers on dark |
| --sand | #EDE6DC | Alternate section ground |
| --line | #E3DBD0 | Borders on light |
| --bronze | #9C8574 | Eyebrows, labels, small accents |
| --bronze-deep | #7A6557 | Links, secondary text accents |
| --graphite | #1F1C1A | Text, dark sections |
| --graphite-2 | #2A2521 | Dark card |
| --muted | #5E544B | Body text secondary |
| --muted-2 | #7A6F65 | Captions |
| --terracotta | #B4453B | THE action colour. Book buttons only. Never elsewhere |
| --brass | #C8B08A | Hairlines and labels on dark sections |

Rules: terracotta appears once per viewport at most. No teal, no blue, no gradients except the soft stone gradients on 3D placeholders. Dark sections use graphite ground with alabaster text.

### Type

- Display: Instrument Serif (Google Fonts), weight 400, italic for emphasis words
- Body and UI: Instrument Sans (Google Fonts), 400/500/600
- Arabic: Noto Naskh Arabic (Google Fonts) 400/500 for display and body. Arabic display sizes are 0.85x the Latin size for the same role
- Self-host via `next/font/google` with `display: swap`, subsets latin and arabic
- Scale (desktop): h1 72 to 88px line-height 0.96, h2 44 to 56px, h3 28 to 30px, body 16 to 17px line-height 1.6, eyebrow 12px uppercase letter-spacing 0.3em, caption 13px
- Letter-spacing on serif display: -0.015em

### Spacing and shape

- Max content width 1440px, side padding 48px desktop, 20px mobile
- Section padding 88 to 96px desktop, 56px mobile
- Radius 4px on buttons and inputs, 6px on cards and images
- Buttons: 12px uppercase letter-spacing 0.14em, padding 16 to 18px by 24 to 28px
- Borders 1px --line on light, rgba(244,240,233,0.2) on dark

### Motion rules

- Easing: cubic-bezier(0.16, 1, 0.3, 1). Durations 0.6 to 1.2s. Nothing bounces, nothing scales on hover beyond 1.02
- Hero text rises in with 150ms stagger
- Images reveal with a soft wipe
- Before/after: draggable line, also auto-wipes once on first view
- Buttons: lift 2px and darken on hover
- Respect prefers-reduced-motion: all GSAP scrubs become static end states

---

## 4. Stack (final, simplified)

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15, App Router, TypeScript strict, Tailwind v3 or v4 | `output: "export"`, `images.unoptimized: true`, `trailingSlash: true` |
| i18n | Route groups: `app/(en)/...` serves `/`, `app/ar/...` serves `/ar`. Dictionaries in `content/i18n/en.json` and `content/i18n/ar.json`. `<html lang dir>` set per tree, `dir="rtl"` on the Arabic tree | No middleware. No next-intl. Hand-rolled `t()` helper |
| Content | Typed JSON in `/content` (services, cases, reviews, faqs, awards, team, pricing, concerns, settings). Zod schemas in `lib/content.ts` validate at build | Sanity comes in phase 1 after the deposit; include `/sanity/schemas` as TypeScript files mirroring the JSON types, not wired yet |
| 3D | `@react-three/fiber`, `@react-three/drei`, `three`. One root `<Canvas>` with drei `<View>` per section. GLB loader with procedural fallback | GLBs go in `/public/models`. If a GLB is missing, render the procedural stand-in |
| Motion | `gsap` with ScrollTrigger, `lenis` | ScrollTrigger scrub writes to a ref, `useFrame` reads it |
| Forms | Client-side only. Compose WhatsApp message and `window.open('https://wa.me/201028294777?text=...')`. Optional Web3Forms email copy if `NEXT_PUBLIC_WEB3FORMS_KEY` exists | No API route |
| Analytics | Cloudflare Web Analytics script tag with `NEXT_PUBLIC_CF_BEACON_TOKEN` placeholder. Custom events on WhatsApp, Call, Book clicks via `data-event` attributes and a tiny tracker | |
| Hosting | Cloudflare Pages, static, connected to the GitHub repo. Build command `npm run build`, output `out` | |
| Domain | Bought by the user at Cloudflare Registrar after the build. See section 13 | |
| Package manager | npm | |
| Node | 20 LTS | |

Do not add: WhatsApp API, Cloudflare Workers, Resend, Google Sheets, Cal.com, R2, OpenNext, ISR, API routes, auth, databases, Payload, Webflow, Spline runtime.

---

## 5. Sitemap and routes

English at root, Arabic under `/ar`. Same structure both sides.

| Route (en) | Route (ar) | Page |
| --- | --- | --- |
| `/` | `/ar/` | Home |
| `/veneers/` | `/ar/veneers/` | Smile design and porcelain veneers |
| `/dental-implants/` | `/ar/dental-implants/` | Dental implants and full arch |
| `/clear-aligners/` | `/ar/clear-aligners/` | Clear aligners and adult orthodontics |
| `/full-mouth-restoration/` | `/ar/full-mouth-restoration/` | Full mouth restoration |
| `/whitening-bonding/` | `/ar/whitening-bonding/` | Whitening and composite bonding |
| `/general-dentistry/` | `/ar/general-dentistry/` | Gum, family and general dentistry |
| `/prof-ahmed-el-hoshy/` | `/ar/prof-ahmed-el-hoshy/` | The Professor (doctor page) |
| `/cases/` | `/ar/cases/` | Before/after gallery with filter and consent gate |
| `/cases/[slug]/` | `/ar/cases/[slug]/` | Single case page |
| `/reviews/` | `/ar/reviews/` | Reviews |
| `/pricing/` | `/ar/pricing/` | Pricing and financing |
| `/faq/` | `/ar/faq/` | FAQ |
| `/international/` | `/ar/international/` | Patients from abroad |
| `/book/` | `/ar/book/` | Contact and booking |
| `/concerns/[slug]/` | `/ar/concerns/[slug]/` | 6 symptom pages: yellow-teeth, gaps, chipped-tooth, old-crowns, missing-teeth, denture-alternative |
| `/privacy/` | `/ar/privacy/` | Privacy and consent statement |
| `/sitemap.xml`, `/robots.txt` | | Generated at build |

Arabic routes keep the same English-letter slugs under `/ar`; Arabic titles and content.

---

## 6. Page specs

### Home (Concept B, case-led)

Order top to bottom:

1. Header: wordmark "El Hoshy Dental" (serif, "Dental" in bronze), nav (Cases, Treatments, The Professor, From Abroad, EN/عربي toggle), terracotta button "Free first consultation" linking to `#book`.
2. Hero: full-width before/after viewer (component `BeforeAfterHero`) with eyebrow "Case 014 · Heliopolis · 34 years old" (placeholder data), headline "The work speaks. Quietly." Below the viewer: lead paragraph, two buttons (Book a free consultation, WhatsApp), stats row (4.9 from 141 reviews, PhD Cairo University, Since 1997).
3. Recent cases: filter pills (All, Veneers, Implants, Full mouth, Bonding), 4-up grid of case cards from `content/cases.json`, link to all cases.
4. Treatments list: 5 rows (Smile design and veneers, Implants and full arch, Full mouth restoration, Clear aligners, Whitening and bonding), each row has number, title, one line, duration label. Rows link to service pages. Each row has a small 3D poster frame on hover (desktop) showing the relevant model's poster.
5. The 3D explainer teaser (component `VeneerSequence`): pinned section, the veneer-on-tooth sequence (see section 8), with a link to the veneers page.
6. The Professor block: portrait placeholder, name, 4 to 5 line bio from section 1, awards row, link to doctor page.
7. Patients from abroad (dark section): headline "One trip to Cairo. A written plan before you fly.", paragraph, two buttons (WhatsApp video consultation, How a trip works), the Salma R. quote.
8. Reviews strip: 3 review cards from `content/reviews.json`, Google 4.9 badge linking to the Google profile.
9. Book section (`#book`): headline "Start with a free consultation.", address, hours, phone, and the `LeadForm` component.
10. Footer: clinic line, hours, links (Instagram, Facebook, Privacy, language), consent and disclaimer line: "All cases published with written patient consent. Results vary."
11. Mobile sticky bar (fixed bottom): WhatsApp, Call, Cases, Book.

### Service pages (6)

Shared template `ServicePage` fed by `content/services.json`:

1. Eyebrow with service name in the other language, h1, fear-first intro (2 to 3 sentences answering the patient's main fear), two buttons.
2. 3D sequence section (veneers, implants, aligners, full-mouth have one each; whitening and general use a video placeholder instead).
3. "How it works" numbered steps with visits and days.
4. "Who it is for, who it is not for" two columns.
5. Materials and brands: placeholders `[IMPLANT BRAND]`, `[CERAMIC SYSTEM]`, `[WARRANTY TERMS]`.
6. Cases filtered to this service (from cases.json).
7. Cost paragraph: honest range and factors, Arabic version written for the "سعر ... في مصر" query. Placeholder figures marked `[CONFIRM]`.
8. FAQ accordion (5 to 8 items from faqs.json filtered by service), with FAQPage JSON-LD.
9. Book CTA block.

### The Professor

Hero with portrait placeholder and name. Sections: In his words (first-person philosophy, 2 paragraphs, write it), Education timeline (1997, 2003, 2007, 2002 to 2009, FUE), Awards grid (4 cards), Teaching (courses for dentists, placeholder dates), The clinic and family name (Prof. Zoheir El Hoshy ENT), Languages, CTA.

### Cases

Consent gate: first visit shows a panel "These images show real patients, published with written consent. I am 18 or older." with a button; store acceptance in localStorage (wrapped in try/catch). Filter by treatment. Grid of case cards. Each card: before/after thumbnail pair, treatment, age band, visits.

### Case page

Before/after viewer, facts table (treatment, teeth count, material, visits, months post-op, age band), story (3 short paragraphs placeholder), consent line, related service link, Book CTA.

### Reviews

Google 4.9 badge, filter by treatment, review cards (author initials, text, treatment, source), "Read all on Google" link to the Google Maps place, video testimonial placeholders (3).

### Pricing and financing

Free first consultation block. Entry prices table for whitening and bonding with `[ENTRY PRICE]` placeholders. "From" per-tooth veneer figure shown ONLY on `/pricing/` (English) with `[CONFIRM]` placeholder, not on `/ar/pricing/`. "What a plan includes" list. Payment: cards, instalment plans `[PARTNERS TO CONFIRM]`. Note: no price war language.

### FAQ

Grouped by treatment, accordion, FAQPage JSON-LD, each question links to its service.

### International

Headline, 3 steps (send photos on WhatsApp, written plan within 48 hours, arrive with appointments set), days-per-treatment table (veneers 5 to 7 days, implants 2 visits 4 to 6 months apart, crowns 2 to 3 days, whitening 1 day), languages (Arabic, English, French, Italian), aftercare `[TERMS TO CONFIRM]`, hotels near Korba `[3 HOTELS TO CONFIRM]`, WhatsApp video consultation button.

### Book

Two columns: left address, hours, phones, Google Maps embed iframe (placeholder embed URL built from the coordinates, replace with the place embed after the user supplies it), WhatsApp and Call buttons. Right: LeadForm.

### Concerns (6)

Short pages: symptom headline in patient language, 2 paragraphs, which treatment solves it, 2 related cases, Book CTA.

---

## 7. Components to build

- `Header`, `Footer`, `StickyBar` (mobile), `LangSwitch`
- `Button` (variants: primary terracotta, secondary outline, dark)
- `Eyebrow`, `SectionHeading`, `StatsRow`
- `BeforeAfterHero` and `BeforeAfterCompare` (drag handle, keyboard accessible, auto-wipe once on view, image based; swaps to the 3D arch viewer when `models/arch.glb` exists)
- `CaseCard`, `CaseGrid`, `CaseFilter`, `ConsentGate`
- `TreatmentList`
- `ProfessorBlock`, `AwardsGrid`, `Timeline`
- `ReviewCard`, `GoogleBadge`
- `FAQAccordion` (native `<details>` styled, plus JSON-LD)
- `LeadForm` (composes WhatsApp message, optional Web3Forms)
- `WhatsAppLink` (builds wa.me URL with page-aware prefilled text in current language)
- `MapEmbed`
- `Scene` (root Canvas), `View` wrappers, `ScrollProgress` hook bridging GSAP to R3F
- 3D: `VeneerSequence`, `ImplantSequence`, `AlignerSequence`, `FullMouthSequence`, `ArchViewer`
- `JsonLd` helpers: Dentist, MedicalClinic, Physician, MedicalProcedure, FAQPage, BreadcrumbList, Review

---

## 8. 3D models with purpose

Rule: a model exists only to answer a fear. Nothing spins for decoration.

| # | Component | Page | Fear answered | Choreography (scroll progress 0 to 1) | GLB node names (when the artist delivers) | Procedural stand-in now |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | VeneerSequence | /veneers, home | How much tooth do you remove | 0 to 0.3 tooth whole and turning 20 degrees. 0.3 to 0.55 enamel face fades to show a 0.4 mm prep layer. 0.55 to 0.85 veneer slides in from +x and seats. 0.85 to 1 shade warms from A3 to BL2 | `tooth`, `prepLayer`, `veneer` | Tooth: LatheGeometry profile in ivory MeshStandardMaterial. Prep layer: slightly smaller clone with darker tint. Veneer: thin curved shell (sphere segment) MeshPhysicalMaterial transmission 0.6 thickness 0.4 roughness 0.15 |
| 2 | ImplantSequence | /dental-implants | What goes into my jaw | 0 to 0.25 bone block with clipping plane revealing cross section. 0.25 to 0.55 fixture screws down, rotation 4 turns bound to progress. 0.55 to 0.75 abutment seats. 0.75 to 1 crown lowers and seats. Label fades in at each pause | `bone`, `gum`, `fixture`, `abutment`, `crown` | Bone: rounded box, sand colour. Gum: thin pink-beige slab. Fixture: tapered cylinder with torus threads, brushed metal. Abutment: small cone. Crown: tooth lathe shape in ivory |
| 3 | AlignerSequence | /clear-aligners | Will people see it, does it move teeth | 0 to 0.4 tray drops onto arch and snaps (small overshoot then settle). 0.4 to 1 morph crowded to aligned, month label 0 to 12 | `arch` with morph targets `m0`, `m6`, `m12`, `tray` | Arch: 10 small lathe teeth on a curve. Crowding: jitter rotations interpolated to zero. Tray: scaled transparent shell MeshPhysicalMaterial transmission 0.9 roughness 0.05 |
| 4 | FullMouthSequence | /full-mouth-restoration | Can failed work be fixed without pulling everything | 0 to 0.6 old crowns replaced one by one left to right. 0.6 to 1 bite height restores, camera orbits to side to show the change | `arch` morph `worn` to `restored`, `crown_01` to `crown_10` | Arch of 10 teeth, 4 of them darker and shorter (old crowns), swapped to ivory full height on progress |
| 5 | ArchViewer | Home hero, case pages | Proof | Not scroll driven. Drag handle wipes between before and after states. Orbit limited to 15 degrees each way | `archBefore`, `archAfter` or one arch with two texture sets | Until GLB and case images exist, `BeforeAfterCompare` with two placeholder images is used. Do not block the hero on 3D |

Engineering:

- One `<Canvas>` at the app root with `frameloop="demand"` and `dpr={[1, 1.5]}`. Each sequence is a drei `<View>` bound to a DOM placeholder div.
- `useScrollProgress(ref)` hook: GSAP ScrollTrigger with `pin: true, scrub: 0.6` writes `progress` into a `MutableRefObject<number>`. The R3F component reads it in `useFrame` and calls `invalidate()` while scrubbing.
- Mobile and weak device fallback: if `prefers-reduced-motion`, `navigator.deviceMemory < 4`, `hardwareConcurrency < 4`, no WebGL2, or `Save-Data`, render the section's poster image and the step text only. Posters: `/public/posters/{veneer,implant,aligner,fullmouth}.webp` placeholders (generate simple placeholder WebPs at build time or commit flat colour placeholders).
- GLB loading: `useGLTF` guarded by a `fileExists` check at build time via a manifest `content/models.json` listing which GLBs are present. Missing entries render the procedural stand-in.
- Draco decoder from `/public/draco/` (copy from three examples).

Artist brief (give to the 3D artist after the deposit): Blender, GLB with Draco, under 1.5 MB and 50K triangles per model, PBR, baked AO, KTX2 1024 textures, named nodes exactly as above, morph targets not skeletons, lookdev under a neutral studio HDRI with a warm tint. Deliver a turntable render and node list per model.

---

## 9. Conversion layer

- `WhatsAppLink` builds: `https://wa.me/201028294777?text=` + encoded message. Message template per language, for example EN: "Hello El Hoshy Dental Clinic, I am interested in {service}. I found you on the website ({page})." AR: "مرحباً عيادة الهوشي للأسنان، أرغب في الاستفسار عن {service}. وصلت إليكم من الموقع ({page})."
- `LeadForm` fields: name, WhatsApp number, treatment (select), visit type (in clinic / video call from abroad), preferred day (select). On submit: validate, compose the message with all fields, `window.open` the wa.me URL, show inline thank-you state. If `NEXT_PUBLIC_WEB3FORMS_KEY` is set, also POST JSON to `https://api.web3forms.com/submit`.
- Call: `tel:+201028294777`.
- Maps: `<iframe>` Google Maps embed. Placeholder src: `https://www.google.com/maps?q=30.0943,31.3299&output=embed`. Replace with the place embed URL from the user later.
- Video consultation: WhatsApp link with a prefilled "I would like a video consultation. I am in [country]."
- Sticky bar on mobile with four actions. Hide when the form is in view.
- Track clicks: `data-event="whatsapp|call|book"` and a small `track()` that calls Cloudflare Web Analytics if present, otherwise no-op.

---

## 10. SEO and schema

- `metadata` per page: title under 60 chars, description under 155, `alternates.languages` for ar and en, canonical.
- Title pattern AR: `{الخدمة} في مصر الجديدة | أ.د. أحمد الهوشي`. EN: `{Service} in Heliopolis | Prof. Ahmed El Hoshy`.
- JSON-LD: `Dentist` + `MedicalClinic` on home and book (name, address, geo, openingHoursSpecification, telephone, sameAs Instagram/Facebook/Google, aggregateRating 4.9 / 141), `Physician` on the doctor page (alumniOf Cairo University, award list), `MedicalProcedure` on service pages, `FAQPage` on FAQ and service FAQs, `BreadcrumbList` sitewide.
- `sitemap.xml` and `robots.txt` generated at build with both language trees. x-default points to the English URL.
- OpenGraph image per language: generate a static 1200x630 PNG at build with the wordmark on alabaster (use `@vercel/og` is not allowed in static export; instead commit a designed PNG created with a small node script using `sharp` + SVG at build, or a static designed asset). Simplest: commit `/public/og-ar.png` and `/public/og-en.png` rendered once with a script in `scripts/og.mjs` using `sharp`.
- Footer includes name variants once in small text for SEO: "El Hoshy Dental Clinic (Elhoshy, El-Hoshy) · عيادة الهوشي".

---

## 11. Content files to create (typed, validated with Zod)

`content/settings.json`: clinic names ar/en, address ar/en, phones, whatsapp, hours, socials, coordinates, googleMapsUrl `[PLACEHOLDER]`, googleRating 4.9, googleReviewCount 141, licenceNumber `[PLACEHOLDER]`.

`content/services.json`: 6 entries with slug, title ar/en, eyebrow, fearIntro ar/en, steps[], visits, days, materials (placeholders), whoFor, whoNotFor, costParagraph ar/en with `[CONFIRM]`, model (veneer | implant | aligner | fullmouth | none), faqIds[].

`content/cases.json`: 8 placeholder cases with slug, treatmentSlug, ageBand, gender, teethCount, material, visits, monthsPostOp, before `[IMAGE]`, after `[IMAGE]`, story ar/en, consent true, consentNote. Mark every image path as a placeholder (`/public/placeholders/case-before.jpg` etc., generate flat stone-coloured placeholders).

`content/reviews.json`: 6 entries. One real paraphrase (Salma R.). Five with `[REAL REVIEW TEXT]` placeholders but realistic structure.

`content/faqs.json`: 30 questions across services, written for real (these can be written now, they are generic dental knowledge, no claims).

`content/awards.json`: 4 awards from section 1.

`content/team.json`: the professor, plus 2 placeholder team members.

`content/pricing.json`: free consultation, whitening `[ENTRY PRICE]`, bonding `[ENTRY PRICE]`, veneers-from `[CONFIRM]` en only.

`content/concerns.json`: 6 entries.

`content/i18n/en.json`, `content/i18n/ar.json`: UI strings.

`content/models.json`: `{ "veneer": false, "implant": false, "aligner": false, "fullmouth": false, "arch": false }` flips to true when GLBs are added.

Write all Arabic copy natively, not machine-literal. Keep sentences short.

---

## 12. PLACEHOLDERS checklist (print this after the build and wait)

Images

- [ ] Professor portrait (hero and doctor page), 3:4, daylight
- [ ] Professor at the chair, hands and loupes, 16:9
- [ ] Clinic exterior with Cleopatra Hospital landmark
- [ ] Reception, treatment room, sterilisation area (3 images)
- [ ] 8 case before/after pairs, same angle and light, with consent confirmed
- [ ] 3 video testimonials (optional)
- [ ] Logo files if any (else the serif wordmark stays)

Facts to confirm

- [ ] Entry prices: whitening, bonding
- [ ] Whether a "from" per-tooth veneer figure may appear on the English pricing page
- [ ] Implant brand(s), ceramic system, lab, warranty terms
- [ ] Instalment partners
- [ ] Final hours (directories disagree)
- [ ] Clinic licence number
- [ ] Year he became professor at FUE
- [ ] Course dates and how to apply
- [ ] 3 recommended hotels near Korba and the aftercare policy for abroad patients
- [ ] Google Maps place embed URL (Share, Embed a map)

Accounts and domain

- [ ] GitHub repo created and pushed (the session does this)
- [ ] Cloudflare account, Pages project connected to the repo
- [ ] Domain bought at Cloudflare Registrar: recommended `elhoshydental.com`. Available on 17 Oct 2026: elhoshydental.com, elhoshydentalclinic.com, drahmedelhoshy.com, ahmedelhoshy.com, hoshyclinic.com, elhoshyclinic.com, hoshydental.com, drelhoshy.com, elhoshysmile.com, elhoshydentalstudio.com. Taken: elhoshy.com
- [ ] Optional: `NEXT_PUBLIC_WEB3FORMS_KEY` for email copies of leads
- [ ] Optional: `NEXT_PUBLIC_CF_BEACON_TOKEN` for Cloudflare Web Analytics

---

## 13. Deploy steps (only after the user says placeholders are filled and the domain is bought)

1. `npm run build` passes with zero warnings that matter. `out/` contains both language trees, sitemap, robots, OG images.
2. Push to GitHub `main`.
3. Cloudflare Pages: Create project, connect repo, framework preset Next.js (Static HTML Export), build command `npm run build`, output directory `out`, Node version 20 via `NODE_VERSION` env. Deploy.
4. Custom domain: add `elhoshydental.com` and `www` in the Pages project. Since the domain is at Cloudflare Registrar, DNS records are created automatically. Set `www` to redirect to apex with a Bulk Redirect or Page Rule.
5. Verify: `https://elhoshydental.com/` serves English, `/ar/` serves Arabic in RTL, hreflang tags present, sitemap reachable, Lighthouse mobile 90 plus on home and one service page.
6. Give the user the launch-day list: change Google Business website field from instagram.com to the domain, add booking link to `/book/`, update Linktree, Instagram and Facebook bios, submit sitemap in Search Console.

---

## 14. Definition of done for the build session

- All routes in section 5 exist in both languages (English at `/`, Arabic at `/ar`) and render with real layout, real copy where facts exist, and clearly marked placeholders elsewhere.
- Four scroll-driven 3D sequences work with procedural stand-ins, degrade to posters on weak devices, and the page still scores 90 plus on Lighthouse mobile with 3D chunks lazy loaded.
- Lead form opens WhatsApp with a correctly composed message in the current language.
- Sticky bar, WhatsApp, Call, Maps work with no API keys.
- JSON-LD validates (Rich Results Test structure) for Dentist, Physician, MedicalProcedure, FAQPage.
- `npm run lint`, `npm run typecheck`, `npm run build` all pass.
- README documents: how to run, where content lives, how to add a case, how to drop in a GLB, how to swap to Sanity in phase 1, how to deploy.
- Git initialised, conventional commits, pushed to GitHub if credentials exist, otherwise ready to push.
- PLACEHOLDERS checklist printed, then the session waits.
