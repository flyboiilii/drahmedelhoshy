"""veneer.glb: nodes tooth, prepLayer, veneer. See MODELS-BRIEF.md section 1."""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bmesh  # noqa: E402
from mathutils import Vector  # noqa: E402
from common import SITE_COLORS, export_glb, glb_report, incisor, material, out_dir, render, reset, studio, subsurf  # noqa: E402

OUT = out_dir()
scene = reset()

PREP_DEPTH = 0.09   # labial reduction, in model units (the crown is 1 unit tall)
INCISAL_CUT = 0.08  # incisal reduction
MARGIN = 0.16       # the reduction feathers to nothing over this height above the gum line


def smoothstep(a, b, x):
    t = min(1.0, max(0.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def prepare(co):
    """Move a point on the natural tooth surface onto the prepared tooth surface."""
    x, y, z = co.x * 0.992, co.y * 0.992, co.z
    if z > 0.0 and y < 0.0:
        facing = -y / max(1e-6, math.hypot(x, y))
        y += PREP_DEPTH * smoothstep(0.0, MARGIN, z) * facing
    if z > 0.8:
        z -= INCISAL_CUT * smoothstep(0.8, 1.0, z)
    return Vector((x, y, z))


# 1. The whole natural tooth.
tooth = incisor("tooth")
subsurf(tooth, 1)
tooth.data.materials.append(material("enamel", SITE_COLORS["enamel"], roughness=0.3, coat=0.35))

# 2. The prepared tooth: the same surface with the labial face and incisal edge reduced.
prep = incisor("prepLayer")
bm = bmesh.new()
bm.from_mesh(prep.data)
for v in bm.verts:
    v.co = prepare(v.co)
bm.to_mesh(prep.data)
bm.free()
subsurf(prep, 1)
prep.data.materials.append(material("dentine", SITE_COLORS["dentine"], roughness=0.55))

# 3. The veneer is the removed layer itself: outer surface = natural tooth,
#    inner surface = prepared tooth, so it seats exactly.
veneer = incisor("veneer")
bm = bmesh.new()
bm.from_mesh(veneer.data)
keep = set()
for f in bm.faces:
    c = f.calc_center_median()
    if (f.normal.y < -0.2 and c.z > 0.005) or (f.normal.z > 0.6 and c.z > 0.9):
        keep.add(f)
bmesh.ops.delete(bm, geom=[f for f in bm.faces if f not in keep], context="FACES")
dup = bmesh.ops.duplicate(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:])
inner_faces = [g for g in dup["geom"] if isinstance(g, bmesh.types.BMFace)]
inner_verts = [g for g in dup["geom"] if isinstance(g, bmesh.types.BMVert)]
for v in inner_verts:
    v.co = prepare(v.co)
bmesh.ops.reverse_faces(bm, faces=inner_faces)
bmesh.ops.bridge_loops(bm, edges=[e for e in bm.edges if e.is_boundary])
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
print("veneer open edges:", sum(1 for e in bm.edges if e.is_boundary))
bm.to_mesh(veneer.data)
bm.free()
for p in veneer.data.polygons:
    p.use_smooth = True
subsurf(veneer, 1)
veneer.data.materials.append(material("porcelain", SITE_COLORS["shade_bl2"], roughness=0.15, alpha=0.9, double_sided=True))

for ob in (tooth, prep, veneer):
    ob.location = (0, 0, 0)

glb = os.path.join(OUT, "veneer.glb")
export_glb(glb, [tooth, prep, veneer])
glb_report(glb)


def aim(cam, at):
    cam.rotation_euler = (Vector(at) - cam.location).to_track_quat("-Z", "Y").to_euler()


# Preview 1: the natural tooth from the site camera. glTF (0.6, 0.5, 4.4) is Blender (0.6, -4.4, 0.5).
studio(scene, cam_pos=(0.6, -4.4, 0.5), look_at=(0, 0, 0.05), fov_deg=28)
prep.hide_render = True
veneer.hide_render = True
render(scene, os.path.join(OUT, "veneer-preview-1-tooth.png"))

# Preview 2: the prepared tooth, and the veneer beside it turned to show its shell.
tooth.hide_render = True
prep.hide_render = False
veneer.hide_render = False
veneer.location = (1.05, 0, 0)
veneer.rotation_euler = (0, 0, math.radians(-50))
scene.camera.data.angle = 2 * math.atan(math.tan(math.radians(36) / 2) * 1.25)
render(scene, os.path.join(OUT, "veneer-preview-2-prep-and-veneer.png"))

# Preview 3: the poster composition, veneer lifted off the prepared face, three-quarter view.
veneer.location = (0, -0.45, 0)
veneer.rotation_euler = (0, 0, 0)
scene.camera.location = (2.4, -3.6, 1.1)
aim(scene.camera, (0, -0.1, 0.05))
render(scene, os.path.join(OUT, "veneer-preview-3-lifted.png"))
