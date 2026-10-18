import { LatheGeometry, Vector2 } from "three";

/**
 * Procedural tooth: a lathe profile from root tip to incisal edge. Flatten on z
 * (scale z 0.6) for an incisor, leave round for a molar-ish crown.
 */
export function toothGeometry(segments = 40): LatheGeometry {
  const pts = [
    new Vector2(0.001, -0.8),
    new Vector2(0.08, -0.72),
    new Vector2(0.19, -0.42),
    new Vector2(0.29, -0.12),
    new Vector2(0.35, 0.22),
    new Vector2(0.37, 0.58),
    new Vector2(0.34, 0.86),
    new Vector2(0.2, 1.0),
    new Vector2(0.001, 1.02),
  ];
  const g = new LatheGeometry(pts, segments);
  g.computeVertexNormals();
  return g;
}

/** Crown only (no root), used for the implant crown and arch teeth. */
export function crownGeometry(segments = 36): LatheGeometry {
  const pts = [
    new Vector2(0.001, -0.3),
    new Vector2(0.26, -0.28),
    new Vector2(0.34, 0.1),
    new Vector2(0.37, 0.5),
    new Vector2(0.33, 0.82),
    new Vector2(0.18, 0.98),
    new Vector2(0.001, 1.0),
  ];
  const g = new LatheGeometry(pts, segments);
  g.computeVertexNormals();
  return g;
}

export const COLORS = {
  ivory: "#f0e9dc",
  ivoryBright: "#f6f3ec",
  shadeA3: "#e6d6ba",
  shadeBL2: "#f5f2ea",
  dentine: "#cfb38c",
  oldCrown: "#b9aa92",
  bone: "#e6dccb",
  gum: "#d8b3a4",
  metal: "#c4c3bf",
} as const;

/** Positions and facing angles for ten teeth on a dental arch. */
export function archSlots(count = 10, radius = 1.25) {
  const slots: { x: number; z: number; angle: number }[] = [];
  const span = 1.9;
  for (let i = 0; i < count; i++) {
    const a = -span / 2 + (span / (count - 1)) * i;
    slots.push({ x: Math.sin(a) * radius, z: Math.cos(a) * radius - 0.85, angle: a });
  }
  return slots;
}
