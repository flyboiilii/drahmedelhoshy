"""aligner.glb: node arch (morph targets m6, m12) and tray. See MODELS-BRIEF.md section 3.

Ten upper front teeth on an arch, crowns up, centrals toward the viewer (-Y in Blender,
+Z in glTF). The base shape is crowded; m6 is half corrected; m12 is aligned.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bmesh  # noqa: E402
from mathutils import Vector  # noqa: E402
from common import SITE_COLORS, export_glb, glb_report, hex_rgba, material, material_vcol, out_dir, render, reset, studio  # noqa: E402
from archlib import add_gum, add_shape_key, add_teeth, centres_for, make_object, place, teeth_row, tooth_lists  # noqa: E402

OUT = out_dir()
scene = reset()

S = 0.8   # overall scale so the arch and gum fit the site camera
ROW = teeth_row(with_molars=False)
CENTRES, ARC_HALF = centres_for(ROW)

# crowding at month 0: extra rotation about the tooth axis, labial offset (+ out), vertical offset, labial tip
CROWDING = [
    (0.10, 0.02, 0.00, 0.00),
    (-0.18, -0.03, 0.00, 0.00),
    (0.22, 0.06, 0.10, 0.08),
    (0.55, -0.12, -0.02, -0.06),
    (-0.25, 0.09, 0.00, 0.10),
    (0.15, -0.10, 0.01, -0.08),
    (-0.35, 0.04, -0.01, 0.04),
    (-0.15, 0.05, 0.04, 0.06),
    (0.20, -0.02, 0.00, 0.00),
    (-0.08, 0.02, 0.00, 0.00),
]


def mats(t):
    return [place(ROW, CENTRES, k, CROWDING[k], t, S) for k in range(len(ROW))]


ivory = hex_rgba(SITE_COLORS["ivory"])
gum_c = hex_rgba(SITE_COLORS["gum"])

bm = bmesh.new()
col = bm.loops.layers.color.new("Col")
ranges = add_teeth(bm, col, ROW, mats(0.0), lambda k, kind, co: ivory)
add_gum(bm, col, ARC_HALF, S, gum_c)
arch = make_object(scene, "arch", bm, material_vcol("arch", roughness=0.4))
add_shape_key(arch, "m6", ranges, mats(0.5))
add_shape_key(arch, "m12", ranges, mats(1.0))

# tray: a thin shell over the aligned crowns
bm = bmesh.new()
aligned = mats(1.0)
for k, (kind, w, sc) in enumerate(ROW):
    lverts, lfaces = tooth_lists(kind)
    cut = 0.14 if kind != "pm" else 0.12
    index = {i: bm.verts.new(aligned[k] @ v) for i, v in enumerate(lverts) if v.z > cut}
    for f in lfaces:
        if all(i in index for i in f):
            try:
                bm.faces.new([index[i] for i in f])
            except ValueError:
                pass
tray = make_object(scene, "tray", bm, material("aligner", "#F2F5F6", roughness=0.08, alpha=0.42, double_sided=True))
solid = tray.modifiers.new("shell", "SOLIDIFY")
solid.thickness = 0.045
solid.offset = 1.0
solid.use_even_offset = True

glb = os.path.join(OUT, "aligner.glb")
export_glb(glb, [arch, tray])
glb_report(glb)


def aim(cam, at):
    cam.rotation_euler = (Vector(at) - cam.location).to_track_quat("-Z", "Y").to_euler()


# previews from the site camera: glTF (0, 2.2, 4.0) looking at (0, -0.1, 0)
studio(scene, cam_pos=(0, -4.0, 2.2), look_at=(0, 0, -0.1), fov_deg=30)
tray.hide_render = True
render(scene, os.path.join(OUT, "aligner-preview-1-crowded.png"))
arch.data.shape_keys.key_blocks["m12"].value = 1.0
render(scene, os.path.join(OUT, "aligner-preview-2-aligned.png"))
tray.hide_render = False
tray.location.z = 0.3
render(scene, os.path.join(OUT, "aligner-preview-3-tray-above.png"))
tray.location.z = 0.0
scene.camera.location = (2.6, -3.0, 1.6)
aim(scene.camera, (0, 0, 0))
render(scene, os.path.join(OUT, "aligner-preview-4-tray-seated.png"))
