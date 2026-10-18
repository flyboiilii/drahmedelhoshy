"""Shared helpers for the headless Blender model builds.

Blender is Z up with -Y as "front"; the glTF exporter converts that to the
site's Y up, +Z front. Everything here is modelled in Blender coordinates.
Run a build with:  blender --background --python blender/<model>.py -- <out_dir>
"""
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

SITE_COLORS = {
    "alabaster": "#F4F0E9",
    "sand": "#EDE6DC",
    "limestone": "#D9CFC2",
    "ivory": "#F0E9DC",
    "ivory_bright": "#F6F3EC",
    "shade_a3": "#D9C4A2",
    "shade_bl2": "#F5F2EA",
    "dentine": "#CFB38C",
    "enamel": "#E6D6BA",
    "old_crown": "#B9AA92",
    "bone": "#E6DCCB",
    "bone_core": "#D8C9B0",
    "gum": "#D8B3A4",
    "metal": "#C4C3BF",
}


def out_dir():
    if "--" in sys.argv:
        d = sys.argv[sys.argv.index("--") + 1]
    else:
        d = os.getcwd()
    os.makedirs(d, exist_ok=True)
    return d


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "NONE"
    return scene


def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_rgba(h):
    h = h.lstrip("#")
    return (srgb_to_linear(int(h[0:2], 16)), srgb_to_linear(int(h[2:4], 16)), srgb_to_linear(int(h[4:6], 16)), 1.0)


def material(name, color, roughness=0.35, metallic=0.0, coat=0.0, transmission=0.0, ior=1.5, alpha=1.0, double_sided=False):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = hex_rgba(color)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["IOR"].default_value = ior
    if coat:
        bsdf.inputs["Coat Weight"].default_value = coat
        bsdf.inputs["Coat Roughness"].default_value = 0.35
    if transmission:
        bsdf.inputs["Transmission Weight"].default_value = transmission
    if alpha < 1.0:
        bsdf.inputs["Alpha"].default_value = alpha
        mat.surface_render_method = "BLENDED"
    mat.use_backface_culling = not double_sided
    return mat


def lathe(name, profile, segments=48, flatten=None, flat_top=None, shape=None):
    """Revolve a (radius, z) profile around Z.

    flatten: callable z -> scale applied to Y (labio-lingual thickness), or None.
    flat_top: clamp z at this value to make a flat incisal edge.
    shape: optional callable (x, y, z) -> (x, y, z) for final sculpting.
    """
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        ring = []
        fy = flatten(z) if flatten else 1.0
        for i in range(segments):
            a = 2 * math.pi * i / segments
            ring.append(bm.verts.new((r * math.cos(a), r * math.sin(a) * fy, z)))
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            try:
                bm.faces.new((a[i], a[j], b[j], b[i]))
            except ValueError:
                pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.004)
    if flat_top is not None:
        for v in bm.verts:
            if v.co.z > flat_top:
                v.co.z = flat_top
    if shape:
        for v in bm.verts:
            v.co = Vector(shape(v.co.x, v.co.y, v.co.z))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def subsurf(ob, levels=1):
    mod = ob.modifiers.new("subsurf", "SUBSURF")
    mod.levels = levels
    mod.render_levels = levels
    return mod


# ---------------------------------------------------------------------------
# Upper central incisor, about 2 units tall: crown z 0.0 to 1.0, root z 0.0 to -1.0.
# Each ring is (z, half_width, labial_depth, lingual_depth). The cross-section is
# an ellipse whose labial half (-Y) and lingual half (+Y) have different depths,
# which gives the convex labial face, the cingulum at the neck and the lingual fossa.
# ---------------------------------------------------------------------------

INCISOR_RINGS = [
    (-1.00, 0.001, 0.001, 0.001),
    (-0.96, 0.06, 0.055, 0.055),
    (-0.85, 0.13, 0.12, 0.12),
    (-0.65, 0.19, 0.17, 0.17),
    (-0.40, 0.235, 0.21, 0.21),
    (-0.15, 0.265, 0.235, 0.235),
    (-0.02, 0.275, 0.245, 0.245),
    (0.02, 0.295, 0.265, 0.25),
    (0.12, 0.325, 0.31, 0.29),
    (0.25, 0.35, 0.325, 0.23),
    (0.40, 0.375, 0.30, 0.17),
    (0.55, 0.395, 0.27, 0.15),
    (0.70, 0.41, 0.235, 0.135),
    (0.85, 0.42, 0.185, 0.115),
    (0.95, 0.42, 0.13, 0.09),
    (1.00, 0.41, 0.085, 0.065),
    (1.03, 0.30, 0.03, 0.03),
    (1.04, 0.001, 0.001, 0.001),
]


def loft(name, rings, segments=64, flat_top=None, shape=None):
    """Build a closed surface from (z, half_width, labial_depth, lingual_depth) rings."""
    bm = bmesh.new()
    loops = []
    for z, w, a, b in rings:
        loop = []
        for i in range(segments):
            t = 2 * math.pi * i / segments
            s = math.sin(t)
            depth = a if s < 0 else b
            loop.append(bm.verts.new((w * math.cos(t), depth * s, z)))
        loops.append(loop)
    for p, q in zip(loops, loops[1:]):
        for i in range(segments):
            j = (i + 1) % segments
            try:
                bm.faces.new((p[i], p[j], q[j], q[i]))
            except ValueError:
                pass
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.004)
    if flat_top is not None:
        for v in bm.verts:
            if v.co.z > flat_top:
                v.co.z = flat_top
    if shape:
        for v in bm.verts:
            v.co = Vector(shape(v.co.x, v.co.y, v.co.z))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def incisor_shape(x, y, z):
    """Round the incisal corners, the distal one (+X) more than the mesial."""
    if z > 0.55:
        k = (z - 0.55) / 0.45
        k = k * k
        x *= (1.0 - 0.14 * k) if x > 0 else (1.0 - 0.06 * k)
    return (x, y, z)


def incisor(name, segments=64):
    return loft(name, INCISOR_RINGS, segments=segments, flat_top=1.0, shape=incisor_shape)


CROWN_PROFILE = [(0.001, -0.3), (0.26, -0.28), (0.34, 0.1), (0.37, 0.5), (0.33, 0.82), (0.18, 0.98), (0.001, 1.0)]


def studio(scene, cam_pos, look_at=(0, 0, 0), fov_deg=28, size=(1200, 960)):
    """Warm neutral studio for preview renders only. Not exported."""
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = hex_rgba(SITE_COLORS["alabaster"])
    bg.inputs["Strength"].default_value = 1.0
    scene.world = world

    cam_data = bpy.data.cameras.new("cam")
    cam_data.lens_unit = "FOV"
    aspect = size[0] / size[1]
    cam_data.angle = 2 * math.atan(math.tan(math.radians(fov_deg) / 2) * aspect)
    cam = bpy.data.objects.new("cam", cam_data)
    scene.collection.objects.link(cam)
    cam.location = Vector(cam_pos)
    direction = Vector(look_at) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam

    def light(name, kind, loc, energy, color=(1, 1, 1), size=2.0):
        ld = bpy.data.lights.new(name, kind)
        ld.energy = energy
        ld.color = color
        if kind == "AREA":
            ld.size = size
        lo = bpy.data.objects.new(name, ld)
        scene.collection.objects.link(lo)
        lo.location = Vector(loc)
        d = Vector(look_at) - lo.location
        lo.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()
        return lo

    light("key", "AREA", (3, -4, 5), 140, (1.0, 0.96, 0.9), 3.0)
    light("fill", "AREA", (-4, -2, 2), 45, (1.0, 0.97, 0.93), 4.0)
    light("rim", "AREA", (0, 4, 3), 40, (1.0, 1.0, 1.0), 3.0)

    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.eevee.taa_render_samples = 96
    scene.eevee.use_raytracing = True
    scene.render.resolution_x, scene.render.resolution_y = size
    scene.render.film_transparent = False
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    return cam


def render(scene, path):
    scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print("rendered", path)


def export_glb(path, objects):
    """Export only the given objects, applying modifiers, Draco compressed, Y up."""
    bpy.ops.object.select_all(action="DESELECT")
    for ob in objects:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_cameras=False,
        export_lights=False,
        export_animations=False,
        export_morph=True,
        export_morph_normal=False,
        export_extras=False,
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
    )
    print("exported", path, os.path.getsize(path), "bytes")


def glb_report(path):
    """Print the node list with triangle counts, the delivery note the brief asks for."""
    import json
    import struct

    with open(path, "rb") as fh:
        data = fh.read()
    length = struct.unpack_from("<I", data, 12)[0]
    doc = json.loads(data[20:20 + length])
    acc = doc["accessors"]
    total = 0
    for node in doc.get("nodes", []):
        if "mesh" not in node:
            continue
        tris = 0
        for prim in doc["meshes"][node["mesh"]]["primitives"]:
            tris += acc[prim["indices"]]["count"] // 3 if "indices" in prim else acc[prim["attributes"]["POSITION"]]["count"] // 3
        targets = doc["meshes"][node["mesh"]].get("extras", {}).get("targetNames", [])
        total += tris
        print(f"node {node['name']}: {tris} triangles" + (f", morph targets {targets}" if targets else ""))
    print(f"total {total} triangles, {len(data)} bytes")
