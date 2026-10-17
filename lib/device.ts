/**
 * Decide on the client whether a device should get the WebGL sequences or the
 * poster-and-text fallback. Conservative by design: any doubt means posters.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canRun3D(): boolean {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;
  if (nav.connection?.saveData) return false;

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}
