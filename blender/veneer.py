"""veneer.glb: nodes tooth, prepLayer, veneer. See MODELS-BRIEF.md section 1.

All three nodes are cut from one subdivided incisor mesh, so the veneer's outer surface is the
tooth's labial face exactly and its fitting surface is the prepared face, GAP above it.
Colours are vertex colours: enamel over a slightly warmer root, dentine only where enamel was cut.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bmesh  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402
from common import SITE_COLORS, export_glb, glb_report, hex_rgba, incisor, material, material_vcol, out_dir, render, reset, studio, subsurf  # noqa: E402

OUT = out_dir()
scene = reset()

PREP_MIN = 0.02     # the finish line: a shallow chamfer all round the prepared face
PREP_DEPTH = 0.09   # full labial reduction, in model units (the crown is 1 unit tall)
INCISAL_CUT = 0.08  # incisal reduction
MARGIN = 0.16       # the reduction deepens from PREP_MIN to PREP_DEPTH over this height above the gum line
GAP = 0.004         # the prepared tooth sits this far inside the veneer's fitting surface (no z-fighting)


def smoothstep(a, b, x):
    t = min(1.0, max(0.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def facing(co):
    return -co.y / max(1e-6, math.hypot(co.x, co.y))


def reduction(co):
    """How far the labial surface is cut in at this point of the natural tooth (0 where untouched)."""
    if co.z <= 0.0 or co.y >= 0.0:
        return 0.0
    return (PREP_MIN + (PREP_DEPTH - PREP_MIN) * smoothstep(0.0, MARGIN, co.z)) * facing(co)


def incisal(co):
    return INCISAL_CUT * smoothstep(0.8, 1.0, co.z) if co.z > 0.8 else 0.0


def prepare(co, extra=0.0):
    """Move a point on the natural tooth surface onto the prepared tooth surface."""
    x, y, z = co.x * 0.992, co.y * 0.992, co.z
    r = reduction(co)
    if r:
        y += r + extra * facing(co)
    c = incisal(co)
    if c:
        z -= c + extra
    return Vector((x, y, z))


enamel_c = hex_rgba(SITE_COLORS["enamel"])
root_c = hex_rgba("#DCC6A1")
dentine_c = hex_rgba(SITE_COLORS["dentine"])


def natural_color(co):
    t = smoothstep(-0.08, 0.02, co.z)
    return (root_c[0] * (1 - t) + enamel_c[0] * t, root_c[1] * (1 - t) + enamel_c[1] * t, root_c[2] * (1 - t) + enamel_c[2] * t, 1.0)


def prep_color(co):
    return dentine_c if (reduction(co) > 0.012 or incisal(co) > 0.012) else natural_color(co)


# One smooth base mesh: the lofted incisor with one level of subdivision applied.
base = incisor("base", segments=64)
subsurf(base, 1)
bpy.ops.object.select_all(action="DESELECT")
base.select_set(True)
bpy.context.view_layer.objects.active = base
bpy.ops.object.modifier_apply(modifier="subsurf")


def copy_of_base(name, color_fn, displace=None):
    bm = bmesh.new()
    bm.from_mesh(base.data)
    col = bm.loops.layers.float_color.new("Col")
    for f in bm.faces:
        for loop in f.loops:
            loop[col] = color_fn(loop.vert.co)
    if displace:
        for v in bm.verts:
            v.co = displace(v.co)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    me.color_attributes.active_color_index = 0
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    return ob


# 1. The whole natural tooth.
tooth = copy_of_base("tooth", natural_color)
tooth.data.materials.append(material_vcol("enamel", roughness=0.3))

# 2. The prepared tooth: labial face and incisal edge reduced, GAP deeper than the veneer's fitting surface.
prep = copy_of_base("prepLayer", prep_color, lambda co: prepare(co, GAP))
prep.data.materials.append(material_vcol("prep", roughness=0.5))

# 3. The veneer is the removed layer itself: outer surface = natural tooth, inner surface = prepared tooth.
bm = bmesh.new()
bm.from_mesh(base.data)
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
me = bpy.data.meshes.new("veneer")
bm.to_mesh(me)
bm.free()
for p in me.polygons:
    p.use_smooth = True
veneer = bpy.data.objects.new("veneer", me)
scene.collection.objects.link(veneer)
veneer.data.materials.append(material("porcelain", SITE_COLORS["shade_bl2"], roughness=0.15, double_sided=True))

bpy.data.objects.remove(base, do_unlink=True)

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

# Preview 4: seated, as the sequence ends (checks the layering from the site camera).
veneer.location = (0, 0, 0)
scene.camera.location = (0.6, -4.4, 0.5)
aim(scene.camera, (0, 0, 0.05))
scene.camera.data.angle = 2 * math.atan(math.tan(math.radians(28) / 2) * 1.25)
render(scene, os.path.join(OUT, "veneer-preview-4-seated.png"))
