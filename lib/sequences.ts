import type { ModelKind } from "./content";

export type SequenceKind = "veneer" | "implant" | "aligner" | "fullmouth";

/** Scroll progress at which each step becomes the active one (section 8 choreography). */
export const SEQUENCE_THRESHOLDS: Record<SequenceKind, [number, number, number, number]> = {
  veneer: [0, 0.3, 0.55, 0.85],
  implant: [0, 0.25, 0.55, 0.75],
  aligner: [0, 0.4, 0.7, 0.95],
  fullmouth: [0, 0.08, 0.6, 0.82],
};

export const SEQUENCE_POSTERS: Record<SequenceKind, string> = {
  veneer: "/posters/veneer.webp",
  implant: "/posters/implant.webp",
  aligner: "/posters/aligner.webp",
  fullmouth: "/posters/fullmouth.webp",
};

/** Pinned scroll distance for a sequence. */
export const SEQUENCE_SCROLL = "+=220%";

export function activeStep(kind: SequenceKind, p: number): number {
  const t = SEQUENCE_THRESHOLDS[kind];
  let i = 0;
  for (let k = 0; k < t.length; k++) if (p >= t[k]) i = k;
  return i;
}

/** Poster path for a service row. Services without a model use a flat poster named after the slug. */
export function posterFor(model: ModelKind, slug: string): string {
  return model === "none" ? `/posters/${slug}.webp` : SEQUENCE_POSTERS[model];
}
