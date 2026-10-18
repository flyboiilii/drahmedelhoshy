"""fullmouth.glb: node arch (morph target restored) and crown_01 to crown_10. See MODELS-BRIEF.md section 4.

The base shape is worn: every tooth a quarter shorter with a flat chipped edge, and four old
crowns (positions 2, 4, 7, 9 from the left) in a greyer ivory with a dark line at the gum.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bmesh  # noqa: E402
from mathutils import Matrix, Vector  # noqa: E402
from common import SITE_COLORS, export_glb, glb_report, hex_rgba, material, material_vcol, out_dir, render, reset, studio  # noqa: E402
from archlib import TOOTH_SINK, add_gum, add_shape_key, add_teeth, centres_for, make_object, place, teeth_row, tooth_lists  # noqa: E402

OUT = out_dir()
scene = reset()

S = 0.8
ROW = teeth_row(with_molars=False)
CENTRES, ARC_HALF = centres_for(ROW)
STILL = (0.0, 0.0, 0.0, 0.0)
M = [place(ROW, CENTRES, k, STILL, 1.0, S) for k in range(len(ROW))]
OLD = {1, 3, 6, 8}
CHIP = [0.05, -0.04, 0.05, -0.07, 0.08, -0.06, 0.05, -0.05, 0.04, -0.06]
TOP = {"i1": 1.0, "i2": 1.0, "c": 1.08, "pm": 0.42, "m": 0.40}
SCALE_Z = {r[0]: r[2][2] for r in ROW}


def gumline(kind):
    """Local z of the gum top for this tooth kind (the cervix sits TOOTH_SINK below it)."""
    return -TOOTH_SINK / SCALE_Z[kind]


def worn(k, kind, co):
    if co.z <= 0:
        return co
    cut = 0.74 * TOP[kind] + CHIP[k] * co.x
    return Vector((co.x, co.y, min(co.z, cut)))


ivory = hex_rgba(SITE_COLORS["ivory"])
old_c = hex_rgba("#CFC2AC")
line_c = hex_rgba("#7A6657")
gum_c = hex_rgba(SITE_COLORS["gum"])


def color(k, kind, co):
    if k in OLD:
        lo = gumline(kind) - 0.02
        hi = lo + 0.05 / SCALE_Z[kind]
        return line_c if lo < co.z < hi else old_c
    return ivory


bm = bmesh.new()
col = bm.loops.layers.color.new("Col")
ranges = add_teeth(bm, col, ROW, M, color, reshape=worn)
add_gum(bm, col, ARC_HALF, S, gum_c)
arch = make_object(scene, "arch", bm, material_vcol("arch", roughness=0.45))
add_shape_key(arch, "restored", ranges, M, reshape=None, row=ROW)

# ten new crowns, each its own node and material, seated over the restored teeth
crowns = []
for k, (kind, w, sc) in enumerate(ROW):
    lverts, lfaces = tooth_lists(kind)
    gl = gumline(kind)
    grow = Matrix.Translation((0, 0, gl)) @ Matrix.Diagonal((1.07, 1.07, 1.025, 1.0)) @ Matrix.Translation((0, 0, -gl))
    bm = bmesh.new()
    index = {i: bm.verts.new(M[k] @ (grow @ v)) for i, v in enumerate(lverts) if v.z > gl - 0.16}
    for f in lfaces:
        if all(i in index for i in f):
            try:
                bm.faces.new([index[i] for i in f])
            except ValueError:
                pass
    name = f"crown_{k + 1:02d}"
    crowns.append(make_object(scene, name, bm, material(f"ceramic_{k + 1:02d}", SITE_COLORS["ivory_bright"], roughness=0.3, coat=0.25)))

glb = os.path.join(OUT, "fullmouth.glb")
export_glb(glb, [arch] + crowns)
glb_report(glb)


def aim(cam, at):
    cam.rotation_euler = (Vector(at) - cam.location).to_track_quat("-Z", "Y").to_euler()


# previews from the site camera: glTF (0, 1.6, 4.2) looking at the origin
studio(scene, cam_pos=(0, -4.2, 1.6), look_at=(0, 0, 0), fov_deg=30)
for c in crowns:
    c.hide_render = True
render(scene, os.path.join(OUT, "fullmouth-preview-1-worn.png"))
for c in crowns[:5]:
    c.hide_render = False
render(scene, os.path.join(OUT, "fullmouth-preview-2-halfway.png"))
for c in crowns:
    c.hide_render = False
arch.data.shape_keys.key_blocks["restored"].value = 1.0
scene.camera.location = (2.8, -3.2, 1.6)
aim(scene.camera, (0, 0, 0))
render(scene, os.path.join(OUT, "fullmouth-preview-3-restored.png"))
