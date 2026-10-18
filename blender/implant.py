"""implant.glb: nodes bone, gum, fixture, abutment, crown. See MODELS-BRIEF.md section 2.

Blender axes: X across, -Y toward the viewer, Z up. The site keeps glTF z < c, which is
Blender y > -c, so the cut-away half is y < 0 and the section faces sit at y = +0.005.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import bmesh  # noqa: E402
import bpy  # noqa: E402
from mathutils import Vector  # noqa: E402
from common import (  # noqa: E402
    SITE_COLORS, clip_preview, export_glb, glb_report, hash01, hex_rgba, material, material_vcol,
    out_dir, render, reset, smooth_faces, studio,
)

OUT = out_dir()
scene = reset()

BONE_W, BONE_D, BONE_TOP, BONE_BOTTOM = 1.2, 0.65, 0.75, -0.75   # half width, half depth
GUM_TOP = 0.95
SECTION_Y = 0.005
FIXTURE_TOP, FIXTURE_LEN, FIXTURE_R = BONE_TOP, 1.0, 0.20


def collar(x, y):
    """Soft rise of the gum around the implant."""
    r2 = x * x + y * y
    return 0.06 * math.exp(-r2 / 0.09)


def new_object(name, bm, smooth=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    smooth_faces(ob, smooth)
    return ob


def grid(bm, nx, ny, point, color_layer=None, color=None):
    """Add an nx by ny quad grid; point(i, j) -> Vector, color(i, j, co) -> rgba."""
    verts = [[bm.verts.new(point(i, j)) for j in range(ny + 1)] for i in range(nx + 1)]
    faces = []
    for i in range(nx):
        for j in range(ny):
            f = bm.faces.new((verts[i][j], verts[i + 1][j], verts[i + 1][j + 1], verts[i][j + 1]))
            faces.append(f)
            if color_layer is not None:
                for loop in f.loops:
                    loop[color_layer] = color(loop.vert.co)
    return faces


def box(bm, lo, hi, bevel=0.0, color_layer=None, color=None):
    verts = bmesh.ops.create_cube(bm, size=1.0)["verts"]
    for v in verts:
        v.co = Vector((lo[0] + (v.co.x + 0.5) * (hi[0] - lo[0]), lo[1] + (v.co.y + 0.5) * (hi[1] - lo[1]), lo[2] + (v.co.z + 0.5) * (hi[2] - lo[2])))
    geom = verts[:] + [e for e in bm.edges if all(v in verts for v in e.verts)]
    if bevel:
        bmesh.ops.bevel(bm, geom=geom, offset=bevel, segments=3, affect="EDGES", profile=0.5)
    if color_layer is not None:
        for f in bm.faces:
            for loop in f.loops:
                if loop[color_layer][3] == 0.0:
                    loop[color_layer] = color
    return verts


# --- bone: outer block plus a painted section face just behind the cut -------------------
bone_c = hex_rgba(SITE_COLORS["bone"])
cortical_c = hex_rgba("#E8DCC6")
core_c = hex_rgba("#CDBB9C")
core_light = hex_rgba("#E4D7C0")

bm = bmesh.new()
col = bm.loops.layers.float_color.new("Col")
box(bm, (-BONE_W, -BONE_D, BONE_BOTTOM), (BONE_W, BONE_D, BONE_TOP), bevel=0.0, color_layer=col, color=bone_c)
for f in bm.faces:
    for loop in f.loops:
        loop[col] = bone_c


def bone_section_color(co):
    x, z = co.x, co.z
    edge = min(BONE_W - abs(x), BONE_TOP - z, z - BONE_BOTTOM)
    if edge < 0.13:
        return cortical_c
    n = hash01(int((x + 2) * 37), int((z + 2) * 37))
    t = min(1.0, max(0.0, (edge - 0.13) / 0.06))
    base = [core_c[k] * (1 - 0.35 * n) + core_light[k] * 0.35 * n for k in range(3)]
    return (base[0] * t + cortical_c[0] * (1 - t), base[1] * t + cortical_c[1] * (1 - t), base[2] * t + cortical_c[2] * (1 - t), 1.0)


nx, nz = 60, 38
grid(
    bm, nx, nz,
    lambda i, j: Vector((-BONE_W + 0.01 + (2 * BONE_W - 0.02) * i / nx, SECTION_Y, BONE_BOTTOM + 0.01 + (BONE_TOP - BONE_BOTTOM - 0.02) * j / nz)),
    color_layer=col, color=bone_section_color,
)
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
bone = new_object("bone", bm, smooth=lambda p: False)
bone.data.color_attributes.active_color_index = 0
bone.data.materials.append(material_vcol("bone", roughness=0.85))

# --- gum: slab with a collar around the implant, plus its section face ------------------
bm = bmesh.new()
# sides and bottom as a box without its top
verts = box(bm, (-BONE_W, -BONE_D, BONE_TOP + 0.002), (BONE_W, BONE_D, GUM_TOP))
top = [f for f in bm.faces if f.normal.z > 0.5 and f.calc_center_median().z > GUM_TOP - 0.01]
bmesh.ops.delete(bm, geom=top, context="FACES_ONLY")
# top as a displaced grid
gx, gy = 48, 26
top_faces = grid(bm, gx, gy, lambda i, j: Vector((-BONE_W + 2 * BONE_W * i / gx, -BONE_D + 2 * BONE_D * j / gy, GUM_TOP)))
for f in top_faces:
    for v in f.verts:
        v.co.z = GUM_TOP + collar(v.co.x, v.co.y)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.001)
# section face: its top edge follows the collar along y = 0
sy = 6
grid(bm, 48, sy, lambda i, j: Vector((-BONE_W + 0.01 + (2 * BONE_W - 0.02) * i / 48, SECTION_Y, BONE_TOP - 0.004 + (GUM_TOP + collar(-BONE_W + 0.01 + (2 * BONE_W - 0.02) * i / 48, 0.0) - BONE_TOP + 0.002) * j / sy)))
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
gum = new_object("gum", bm, smooth=lambda p: p.normal.z > 0.3 and p.center.z > GUM_TOP - 0.02)
gum.data.materials.append(material("gum", SITE_COLORS["gum"], roughness=0.6))


# --- fixture: tapered titanium screw with a helical thread -------------------------------
def fixture_radius(z, theta):
    """z measured down from the platform (0 at top, FIXTURE_LEN at apex)."""
    t = z / FIXTURE_LEN
    base = FIXTURE_R * (1.0 - 0.45 * t * t)
    if z > FIXTURE_LEN - 0.08:                       # rounded apex
        k = (FIXTURE_LEN - z) / 0.08
        base *= math.sqrt(max(0.0, 1 - (1 - k) ** 2))
    if 0.1 < z < FIXTURE_LEN - 0.1:                  # thread
        pitch = 0.085
        phase = (z / pitch - theta / (2 * math.pi)) % 1.0
        tri = 1.0 - abs(2 * phase - 1)               # 0..1..0
        depth = 0.028 * min(1.0, (z - 0.1) / 0.1) * min(1.0, (FIXTURE_LEN - 0.1 - z) / 0.1)
        base += depth * (tri - 0.5)
    return max(0.004, base)


bm = bmesh.new()
seg, rows = 48, 72
rings = []
for r in range(rows + 1):
    z = FIXTURE_LEN * r / rows
    ring = []
    for s in range(seg):
        th = 2 * math.pi * s / seg
        rad = fixture_radius(z, th)
        ring.append(bm.verts.new((rad * math.cos(th), rad * math.sin(th), FIXTURE_TOP - z)))
    rings.append(ring)
for a, b in zip(rings, rings[1:]):
    for s in range(seg):
        bm.faces.new((a[s], a[(s + 1) % seg], b[(s + 1) % seg], b[s]))
cap = bm.faces.new(rings[0])                          # platform
bmesh.ops.inset_region(bm, faces=[cap], thickness=0.05, depth=0.0)
bmesh.ops.remove_doubles(bm, verts=rings[-1], dist=0.01)
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
fixture = new_object("fixture", bm, smooth=lambda p: abs(p.normal.z) < 0.9)
fixture.data.materials.append(material("titanium", SITE_COLORS["metal"], roughness=0.35, metallic=0.9))

# --- abutment: small cone on the platform -----------------------------------------------
ABUT_PROFILE = [(0.001, 0.0), (0.17, 0.0), (0.17, 0.03), (0.13, 0.08), (0.11, 0.2), (0.105, 0.33), (0.08, 0.37), (0.001, 0.37)]
bm = bmesh.new()
rings = []
for rad, z in ABUT_PROFILE:
    rings.append([bm.verts.new((rad * math.cos(2 * math.pi * s / 32), rad * math.sin(2 * math.pi * s / 32), FIXTURE_TOP + z)) for s in range(32)])
for a, b in zip(rings, rings[1:]):
    for s in range(32):
        try:
            bm.faces.new((a[s], a[(s + 1) % 32], b[(s + 1) % 32], b[s]))
        except ValueError:
            pass
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.004)
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
abutment = new_object("abutment", bm, smooth=lambda p: abs(p.normal.z) < 0.9)
abutment.data.materials.append(material("titanium_abutment", SITE_COLORS["metal"], roughness=0.3, metallic=0.9))

# --- crown: lower first molar, four cusps, central groove ---------------------------------
CROWN_BASE = 1.0
CROWN_W, CROWN_D = 0.52, 0.46       # half width (mesio-distal, X), half depth (bucco-lingual, Y)
CROWN_TOP, CROWN_BOTTOM = 0.27, -0.40
N_SUPER = 3.2


def crown_point(x, y, z):
    """Map a point of a unit sphere (radius 0.5) onto the molar."""
    th = math.atan2(y, x)
    s = (abs(math.cos(th)) ** N_SUPER + abs(math.sin(th)) ** N_SUPER) ** (-1.0 / N_SUPER)
    if z >= 0:
        k = z / 0.5
        zz = CROWN_TOP * (1 - (1 - k) ** 3.0)
    else:
        zz = max(CROWN_BOTTOM, 0.95 * z)
    waist = 1.0 if zz >= 0 else 1.0 - 0.2 * (-zz / 0.40) ** 1.8
    xx = x * 2 * CROWN_W * s * waist
    yy = y * 2 * CROWN_D * s * waist
    if zz > 0.12:
        w = min(1.0, (zz - 0.12) / 0.15)
        bumps = 0.0
        for cx, cy in ((-0.25, -0.2), (0.25, -0.2), (-0.25, 0.2), (0.25, 0.2)):
            bumps += 0.07 * math.exp(-((xx - cx) ** 2 + (yy - cy) ** 2) / 0.035)
        bumps -= 0.045 * math.exp(-(yy ** 2) / 0.006) * math.exp(-(xx ** 2) / 0.4)
        bumps -= 0.012 * math.exp(-(xx ** 2) / 0.01) * math.exp(-(yy ** 2) / 0.3)
        zz += w * bumps
    return Vector((xx, yy, zz + CROWN_BASE - CROWN_BOTTOM))


bm = bmesh.new()
bmesh.ops.create_uvsphere(bm, u_segments=56, v_segments=36, radius=0.5)
for v in bm.verts:
    v.co = crown_point(v.co.x, v.co.y, v.co.z)
bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.002)
bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
crown = new_object("crown", bm)
crown.data.materials.append(material("ceramic", SITE_COLORS["ivory"], roughness=0.3))

parts = [bone, gum, fixture, abutment, crown]
# The block alone was 2.6 units tall with the crown; scale everything to sit inside the site camera.
bpy.ops.object.select_all(action="DESELECT")
for ob in parts:
    ob.scale = (0.72, 0.72, 0.72)
    ob.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
glb = os.path.join(OUT, "implant.glb")
export_glb(glb, parts)
glb_report(glb)


# --- previews from the site camera: glTF (0.3, 1.2, 4.6) looking at (0, 0.3, 0) ---------
def aim(cam, at):
    cam.rotation_euler = (Vector(at) - cam.location).to_track_quat("-Z", "Y").to_euler()


studio(scene, cam_pos=(0.3, -4.6, 1.2), look_at=(0, 0, 0.3), fov_deg=30)
render(scene, os.path.join(OUT, "implant-preview-1-whole.png"))

clip_preview(bone.data.materials[0])
clip_preview(gum.data.materials[0])
render(scene, os.path.join(OUT, "implant-preview-2-cutaway.png"))

fixture.location.z = 0.9
fixture.rotation_euler.z = 2.0
abutment.hide_render = True
crown.hide_render = True
render(scene, os.path.join(OUT, "implant-preview-3-fixture-descending.png"))

# Crown alone, three-quarter from above, to judge the cusps.
fixture.hide_render = True
bone.hide_render = True
gum.hide_render = True
crown.hide_render = True
abutment.hide_render = True
crown.hide_render = False
scene.camera.location = (1.6, -2.2, 2.4)
aim(scene.camera, (0, 0, 1.0))
render(scene, os.path.join(OUT, "implant-preview-4-crown.png"))
