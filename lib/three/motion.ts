/** Small easing and range helpers shared by the procedural and GLB sequences. */
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Normalised 0..1 position of p inside [a, b]. */
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeOutBack = (t: number, s = 1.4) => {
  const c = s + 1;
  const x = t - 1;
  return 1 + c * x * x * x + s * x * x;
};
export const TWO_PI = Math.PI * 2;
