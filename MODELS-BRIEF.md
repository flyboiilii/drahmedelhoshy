# 3D models brief

Five GLB files replace the procedural stand-ins. Each one exists to answer one patient fear, as section 8 of the build brief says, and the site already contains the choreography; the model only has to deliver the named parts in the right place. Drop a finished file in `public/models/` under the exact name, flip its flag in `content/models.json` to `true`, rebuild, and the animated version appears.

## Rules for all five

- Format: glTF binary (`.glb`), Draco-compressed geometry, PBR metal-rough materials, baked ambient occlusion, textures as KTX2 at 1024 px (PNG or JPEG also load). Under 1.5 MB and 50,000 triangles per file.
- Node names exactly as listed, case-sensitive. Every animated part is its own mesh with its own material (the site animates opacity, position and rotation per node).
- Y is up, the front of the model faces +Z (toward the camera), the model is centred on the world origin, and the whole thing fits inside a 3 x 3 x 3 unit box. Scale is not real-world; 1 unit is roughly one centimetre in feel. All parts exported in their final, seated position; the site lifts and lowers them itself.
- Morph targets, never bones or baked animation. No lights, no cameras, no animations in the file.
- Look: a neutral studio, warm-tinted lighting in the look-dev, matte to satin enamel in warm ivory (around #F0E9DC), dentine a shade warmer, gum a muted pink-beige, titanium a brushed light grey. Nothing glossy white, nothing blue, no cartoon proportions, no text.
- Deliver with each file: a 6-second turntable render (1080 square) and a node list with triangle counts.

If a generative 3D tool is used for the base shapes, plan a Blender pass afterwards: the tool will not name nodes, split parts, or build morph targets, and those three things are what the site depends on.

---

## 1. Veneer. `public/models/veneer.glb`

Fear answered: how much tooth is removed. Shown on the home page and the veneers page.

- Nodes: `tooth`, `prepLayer`, `veneer`.
- Description: A single upper central incisor, standing upright with its root, about 2 units tall, labial face toward +Z. `tooth` is the complete natural tooth in a warm A3-type ivory. `prepLayer` is a copy of the same tooth with the labial face set back by a visible 0.4 to 0.6 units of "enamel" removed, in a slightly warmer dentine tone, so that when the outer tooth fades the prepared shape is seen underneath. `veneer` is a thin porcelain shell, 0.3 to 0.4 units thick, that sits exactly on the prepared face in its seated position, with a translucent satin material (transmission around 0.6, roughness 0.15). Anatomy credible but calm: mamelons faint, incisal edge slightly translucent, no cracks or stains.

## 2. Implant. `public/models/implant.glb`

Fear answered: what goes into my jaw. Shown on the implants page.

- Nodes: `bone`, `gum`, `fixture`, `abutment`, `crown`.
- Description: A cross-sectional block of lower jaw, about 2.4 units wide, 1.5 tall and 1.3 deep, front face toward +Z; the site cuts the front half away with a clipping plane, so the bone needs a believable interior: a cortical shell and a lighter cancellous core, sand-coloured, with back faces modelled. `gum` is a soft pink-beige slab 0.2 units thick on top of the bone with a smooth round collar where the implant emerges. `fixture` is a tapered titanium screw with visible threads, about 1 unit long, axis vertical, pivot on its own axis, seated inside the bone. `abutment` is a small titanium cone above it. `crown` is a lower molar in warm ivory seated on the abutment. No blood, no instruments, no labels.

## 3. Aligner. `public/models/aligner.glb`

Fear answered: will people see it, does it move teeth. Shown on the aligners page.

- Nodes: `arch` (one mesh, with morph targets named `m6` and `m12`), `tray`.
- Description: An upper dental arch of ten front teeth, canine to canine plus premolars, about 2.5 units across, incisal edges facing +Z and the arch seen from slightly above. The base shape of `arch` is month 0: visibly crowded, two incisors overlapping, one lateral rotated, a canine slightly high. Morph target `m6` is the same arch half corrected; `m12` is fully aligned with a smooth arch form. Same vertex count throughout, only positions change. Gum included as part of the arch in muted pink-beige. `tray` is a clear aligner shell that fits the aligned arch, 0.05 units thick, modelled hovering nowhere in particular: export it seated on the aligned teeth, glass-like material (transmission 0.9, roughness 0.05, slight tint), no attachments.

## 4. Full mouth. `public/models/fullmouth.glb`

Fear answered: can failed work be fixed without pulling everything. Shown on the full mouth page.

- Nodes: `arch` (one mesh, with morph target named `restored`), `crown_01` to `crown_10`.
- Description: An arch of ten teeth like the aligner arch, about 2.5 units across, but worn: the base shape of `arch` is the "worn" state, teeth shortened by a quarter, flat chipped edges, and four of the ten (positions 2, 4, 7, 9 counting from the left) are old crowns in a darker greyish ivory with a thin dark line at the gum. Morph target `restored` lifts the whole arch back to full height with intact edges, same vertex count. `crown_01` to `crown_10` are ten separate new ceramic crowns, warm ivory, each exported exactly in its finished position over the corresponding tooth of the restored arch, each with its own material; the site fades them in one by one from left to right, so their numbering runs left to right as seen from the front.

## 5. Arch viewer. `public/models/arch.glb`

Purpose: proof. Replaces the photographic before/after in the home hero and on case pages once it exists.

- Nodes: `archBefore`, `archAfter`.
- Description: Two full upper arches, fourteen teeth each with gum, about 3 units across, superimposed on the same origin so a vertical wipe between them lines up tooth for tooth. `archBefore` is the untreated state: mild crowding, uneven edges, a warmer and slightly mottled shade. `archAfter` is the finished state: the same arch with even edges, closed spaces and a calm uniform ivory. Each is one mesh with its own material and modelled back faces, because the site clips each one at the wipe line. No lower arch, no tongue.

---

## Optional posters from the same models

Once the models exist, render four still posters from them for phones and weak devices, 5:4 at 1200 x 960, alabaster background, soft shadow, warm light, no text: `public/posters/veneer.webp` (the veneer lifted off the prepared face), `implant.webp` (the cut-away block with all parts seated), `aligner.webp` (the tray above the aligned arch), `fullmouth.webp` (the arch mid-way through replacement). The flat stone posters stay in place until then.
