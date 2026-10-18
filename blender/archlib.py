"""Shared arch builder: teeth placed on a parabolic arch with a gum band under them.

Blender axes: X across (viewer's right is +X), -Y toward the viewer, Z up. Crowns point up.
Local tooth space: cervical centre at the origin, labial face toward -Y, crown along +Z.
"""
import math

import bmesh
import bpy
from mathutils import Matrix, Vector

from common import INCISOR_RINGS, bmesh_lists, cusped_crown_bmesh, incisor_shape, loft_bmesh, smooth_faces

ARCH_A = 0.52          # arch curve y = ARCH_A * x^2 - ARCH_Y0
ARCH_Y0 = 0.48
GUM_TOP = 0.02
TOOTH_SINK = -0.08     # the cervical line sits this far below the gum top
SEG = 36
GAP = 0.025

CANINE_RINGS = INCISOR_RINGS[:11] + [(0.70, 0.40, 0.235, 0.135), (0.85, 0.355, 0.19, 0.12), (0.95, 0.26, 0.13, 0.09), (1.03, 0.12, 0.07, 0.06), (1.08, 0.001, 0.001, 0.001)]

# (kind, mesio-distal width, local scale)
FRONT_TEN = [
    ("pm", 0.33, (1.0, 1.0, 1.0)),
    ("pm", 0.34, (1.0, 1.0, 1.0)),
    ("c", 0.38, (0.45, 0.52, 0.64)),
    ("i2", 0.34, (0.40, 0.44, 0.56)),
    ("i1", 0.42, (0.50, 0.50, 0.64)),
    ("i1", 0.42, (0.50, 0.50, 0.64)),
    ("i2", 0.34, (0.40, 0.44, 0.56)),
    ("c", 0.38, (0.45, 0.52, 0.64)),
    ("pm", 0.34, (1.0, 1.0, 1.0)),
    ("pm", 0.33, (1.0, 1.0, 1.0)),
]
MOLARS = [("m", 0.46, (1.0, 1.0, 1.0)), ("m", 0.44, (1.0, 1.0, 1.0))]


def teeth_row(with_molars=False):
    if not with_molars:
        return list(FRONT_TEN)
    return [MOLARS[0], MOLARS[1]] + FRONT_TEN + [MOLARS[1], MOLARS[0]]


_cache = {}


def tooth_lists(kind):
    """(verts, faces) of one tooth in local space."""
    if kind in _cache:
        return _cache[kind]
    if kind in ("i1", "i2"):
        out = bmesh_lists(loft_bmesh(INCISOR_RINGS, segments=SEG, flat_top=1.0, shape=incisor_shape), min_z=-0.3)
    elif kind == "c":
        out = bmesh_lists(loft_bmesh(CANINE_RINGS, segments=SEG, flat_top=None, shape=None), min_z=-0.3)
    elif kind == "pm":
        out = bmesh_lists(cusped_crown_bmesh(0.165, 0.21, 0.42, -0.22, cusps=[(0, -0.09, 0.06, 0.012), (0, 0.09, 0.04, 0.012)], groove_x=0.03, n_super=2.6, u=SEG, v=22))
    else:
        out = bmesh_lists(cusped_crown_bmesh(0.23, 0.25, 0.40, -0.22, cusps=[(-0.11, -0.1, 0.055, 0.012), (0.11, -0.1, 0.055, 0.012), (-0.11, 0.1, 0.045, 0.012), (0.11, 0.1, 0.045, 0.012)], groove_x=0.03, groove_y=0.012, n_super=3.0, u=SEG, v=22))
    _cache[kind] = out
    return out


def arch_point(s):
    """Point, outward normal and tangent angle at arc length s from the midline (s < 0 is the viewer's left)."""
    x, length, step = 0.0, 0.0, 0.002
    target = abs(s)
    while length < target:
        dx = step
        dy = 2 * ARCH_A * x * dx
        length += math.hypot(dx, dy)
        x += dx
    if s < 0:
        x = -x
    y = ARCH_A * x * x - ARCH_Y0
    phi = math.atan(2 * ARCH_A * x)
    normal = Vector((math.sin(phi), -math.cos(phi), 0.0))
    return Vector((x, y, 0.0)), normal, phi


def centres_for(row):
    """Arc-length centre of each tooth, and the half arc length."""
    n = len(row)
    right = row[n // 2:]
    acc, half = 0.0, []
    for kind, w, _ in right:
        half.append(acc + w / 2)
        acc += w + GAP
    left = [-half[len(half) - 1 - i] for i in range(len(half))]
    return left + half, acc


def place(row, centres, k, offsets, t, scale):
    """World matrix for tooth k. offsets = (rotation, labial out, up, labial tip) at t = 0, gone at t = 1."""
    kind, w, sc = row[k]
    rot, out, up, tip = offsets
    f = 1.0 - t
    pos, n, phi = arch_point(centres[k])
    pos = pos * (1.0 - 0.03 * f) + n * (out * f) + Vector((0, 0, TOOTH_SINK + up * f))
    return (
        Matrix.Scale(scale, 4)
        @ Matrix.Translation(pos)
        @ Matrix.Rotation(phi + rot * f, 4, "Z")
        @ Matrix.Rotation(tip * f, 4, "X")
        @ Matrix.Diagonal((sc[0], sc[1], sc[2], 1.0))
    )


def add_teeth(bm, col, row, matrices, color_fn, reshape=None):
    """Add every tooth of the row to bm. Returns [(start index, local verts)] in vertex order.

    color_fn(k, kind, local_co) -> rgba.  reshape(k, kind, local_co) -> local_co (worn edges etc.).
    """
    ranges = []
    count = len(bm.verts)
    for k, (kind, w, sc) in enumerate(row):
        lverts, lfaces = tooth_lists(kind)
        if reshape:
            lverts = [reshape(k, kind, v) for v in lverts]
        m = matrices[k]
        bverts = [bm.verts.new(m @ v) for v in lverts]
        for f in lfaces:
            fverts = [bverts[i] for i in f]
            try:
                face = bm.faces.new(fverts)
            except ValueError:
                continue
            for loop in face.loops:
                loop[col] = color_fn(k, kind, lverts[f[fverts.index(loop.vert)]])
        ranges.append((count, lverts))
        count += len(lverts)
    return ranges


def add_gum(bm, col, arc_half, scale, color, n_sec=96, n_pts=20, extra=0.22):
    """A rounded horseshoe band under the teeth."""
    s_end = arc_half + extra
    sections = []
    for i in range(n_sec + 1):
        s = -s_end + 2 * s_end * i / n_sec
        pos, n, phi = arch_point(s)
        ring = []
        for j in range(n_pts):
            a = 2 * math.pi * j / n_pts
            c, sn = math.cos(a), math.sin(a)
            rx = math.copysign(abs(c) ** (2 / 2.6), c) * 0.30
            rz = math.copysign(abs(sn) ** (2 / 2.6), sn) * 0.17
            ring.append(bm.verts.new((pos + n * rx + Vector((0, 0, GUM_TOP - 0.17 + rz))) * scale))
        sections.append(ring)
    faces = []
    for a, b in zip(sections, sections[1:]):
        for j in range(n_pts):
            faces.append(bm.faces.new((a[j], a[(j + 1) % n_pts], b[(j + 1) % n_pts], b[j])))
    faces.append(bm.faces.new(list(reversed(sections[0]))))
    faces.append(bm.faces.new(sections[-1]))
    for f in faces:
        for loop in f.loops:
            loop[col] = color
    return faces


def make_object(scene, name, bm, mat):
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    smooth_faces(ob)
    if me.color_attributes:
        me.color_attributes.active_color_index = 0
    ob.data.materials.append(mat)
    return ob


def add_shape_key(ob, name, ranges, matrices, reshape=None, row=None):
    """A morph target that moves each tooth's vertices by its own matrix (gum untouched)."""
    if not ob.data.shape_keys:
        ob.shape_key_add(name="Basis", from_mix=False)
    key = ob.shape_key_add(name=name, from_mix=False)
    for k, (start, lverts) in enumerate(ranges):
        m = matrices[k]
        for i, v in enumerate(lverts):
            co = reshape(k, row[k][0], v) if reshape else v
            key.data[start + i].co = m @ co
    return key
