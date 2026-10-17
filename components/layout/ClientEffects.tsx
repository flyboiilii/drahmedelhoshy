"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { bindClickTracking } from "@/lib/track";
import { prefersReducedMotion } from "@/lib/device";
import { onFirstInteraction } from "@/lib/interaction";

/**
 * Small client-side glue that needs no React state:
 * - delegated click tracking for data-event elements
 * - the soft image wipe for [data-reveal] elements
 * - Lenis smooth scroll, loaded after the first user interaction and skipped
 *   under prefers-reduced-motion
 */
export function ClientEffects() {
  const pathname = usePathname();

  useEffect(() => bindClickTracking(), []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (els.length === 0) return;
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const off = onFirstInteraction(() => {
      import("@/lib/smooth-scroll").then(({ startSmoothScroll }) => {
        if (cancelled) return;
        cleanup = startSmoothScroll();
      });
    });
    return () => {
      cancelled = true;
      off();
      cleanup?.();
    };
  }, []);

  return null;
}
