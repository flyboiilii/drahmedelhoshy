"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";

type Options = {
  /** ScrollTrigger end, e.g. "+=220%" */
  end?: string;
  pin?: boolean;
  onUpdate?: (progress: number) => void;
};

/**
 * GSAP ScrollTrigger (pin + scrub) that writes progress into a ref. The 3D
 * component reads the ref in useFrame; the DOM layer reads it in onUpdate.
 * useLayoutEffect so the pin spacer is removed before React detaches the node.
 */
export function useScrollProgress(target: RefObject<HTMLElement | null>, { end = "+=220%", pin = true, onUpdate }: Options = {}) {
  const progress = useRef(0);
  const cb = useRef(onUpdate);
  cb.current = onUpdate;

  useLayoutEffect(() => {
    const el = target.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end,
        pin,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.current = self.progress;
          cb.current?.(self.progress);
        },
      });
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [target, end, pin]);

  return progress;
}
