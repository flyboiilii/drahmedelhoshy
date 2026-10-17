"use client";

import { useSyncExternalStore } from "react";

/**
 * Minimal store shared between the root <Canvas> (mounted once per layout,
 * lazily) and the scroll-driven sections that draw into it through drei Views.
 */
type Listener = () => void;

let enabled = false;
let invalidateFn: (() => void) | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => fn());
}

export const sceneStore = {
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  isEnabled: () => enabled,
  /** Ask for the root canvas. Called by the first capable sequence approaching the viewport. */
  enable() {
    if (enabled) return;
    enabled = true;
    emit();
  },
  setInvalidate(fn: (() => void) | null) {
    invalidateFn = fn;
  },
  /** Request a frame from the demand-driven canvas. No-op until the canvas exists. */
  invalidate() {
    invalidateFn?.();
  },
};

export function useSceneEnabled(): boolean {
  return useSyncExternalStore(sceneStore.subscribe, sceneStore.isEnabled, () => false);
}
