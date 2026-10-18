"""arch.glb: nodes archBefore and archAfter. See MODELS-BRIEF.md section 5.

Two full upper arches of fourteen teeth on the same origin. Before: mild crowding, uneven
edges, warmer mottled shade. After: aligned, even edges, uniform ivory.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bmesh  # noqa: E402
from mathutils import Vector  # noqa: E402
from common import SITE_COLORS, clip_preview, export_glb, glb_report, hash01, hex_rgba, material_vcol, out_dir, render, reset, studio  # noqa: E402
from archlib import add_gum, add_teeth, centres_for, make_object, place, teeth_row  # noqa: E402

OUT = out_dir()
scene = reset()

S = 0.72
ROW = teeth_row(with_molars=True)
CENTRES, ARC_HALF = centres_for(ROW)
STILL = (0.0, 0.0, 0.0, 0.0)
# mild crowding before: rotation, labial out, up, tip
BEFORE = [
    (0.04, 0.0, 0.0, 0.0), (-0.05, 0.01, 0.0, 0.0),
    (0.08, 0.02, 0.0, 0.0), (-0.12, -0.02, 0.0, 0.0),
    (0.16, 0.04, 0.05, 0.05), (0.32, -0.07, -0.01, -0.04), (-0.14, 0.06, 0.0, 0.07),
    (0.10, -0.06, 0.02, -0.05), (-0.22, 0.03, -0.01, 0.03), (-0.10, 0.04, 0.03, 0.04),
    (0.12, -0.02, 0.0, 0.0), (-0.06, 0.01, 0.0, 0.0),
    (0.05, 0.0, 0.0, 0.0), (-0.04, 0.0, 0.0, 0.0),
]
HEIGHT = [1.0, 1.0, 0.98, 1.02, 0.95, 1.04, 0.97, 1.0, 0.93, 1.03, 0.98, 1.0, 1.0, 1.0]
CHIP = [0, 0, 0, 0.02, 0.05, -0.04, 0.06, -0.05, 0.03, -0.04, 0, 0, 0, 0]

base_c = hex_rgba("#E3D2B0")
dark_c = hex_rgba("#D2BC97")
neck_c = hex_rgba("#D8C39C")
after_c = hex_rgba(SITE_COLORS["ivory"])
gum_c = hex_rgba(SITE_COLORS["gum"])


def uneven(k, kind, co):
    if co.z <= 0:
        return co
    z = co.z * HEIGHT[k]
    if kind in ("i1", "i2") and CHIP[k]:
        z = min(z, HEIGHT[k] - 0.02 + CHIP[k] * co.x * 4)
    return Vector((co.x, co.y, z))


def color_before(k, kind, co):
    n = hash01(int(co.x * 61 + 100), int(co.z * 61 + 100), k)
    t = 0.18 * n
    c = [base_c[i] * (1 - t) + dark_c[i] * t for i in range(3)]
    if co.z < 0.25:
        w = (0.25 - max(co.z, 0.0)) / 0.25 * 0.5
        c = [c[i] * (1 - w) + neck_c[i] * w for i in range(3)]
    return (c[0], c[1], c[2], 1.0)


def build(name, offsets, t, color_fn, reshape):
    mats = [place(ROW, CENTRES, k, offsets[k], t, S) for k in range(len(ROW))]
    bm = bmesh.new()
    col = bm.loops.layers.color.new("Col")
    add_teeth(bm, col, ROW, mats, color_fn, reshape=reshape)
    add_gum(bm, col, ARC_HALF, S, gum_c)
    return make_object(scene, name, bm, material_vcol(name, roughness=0.4))


before = build("archBefore", BEFORE, 0.0, color_before, uneven)
after = build("archAfter", [STILL] * len(ROW), 1.0, lambda k, kind, co: after_c, None)

glb = os.path.join(OUT, "arch.glb")
export_glb(glb, [before, after])
glb_report(glb)

# previews from the hero camera: glTF (0, 1.2, 5) looking at the origin, fov 26
studio(scene, cam_pos=(0, -5.0, 1.2), look_at=(0, 0, 0), fov_deg=26)
after.hide_render = True
render(scene, os.path.join(OUT, "arch-preview-1-before.png"))
after.hide_render = False
before.hide_render = True
render(scene, os.path.join(OUT, "arch-preview-2-after.png"))
before.hide_render = False
clip_preview(before.data.materials[0], axis="X", keep_positive=False)
clip_preview(after.data.materials[0], axis="X", keep_positive=True)
render(scene, os.path.join(OUT, "arch-preview-3-wipe.png"))
