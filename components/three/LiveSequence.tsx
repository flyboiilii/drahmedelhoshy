"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { sceneStore } from "@/lib/scene-store";
import { SEQUENCE_SCROLL, type SequenceKind } from "@/lib/sequences";
import { SequenceView } from "./SequenceView";

type Props = {
  kind: SequenceKind;
  sectionRef: RefObject<HTMLElement | null>;
  onProgress: (p: number) => void;
};

/**
 * Client-only half of a live sequence: GSAP pin + scrub on the section, and
 * the drei View portalled into the server-rendered poster box
 * ([data-sequence-host]) so the shared canvas draws over exactly that box.
 */
export default function LiveSequence({ kind, sectionRef, onProgress }: Props) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  // Once the view draws, the poster underneath fades out (CSS on data-live).
  const onReady = useCallback(() => {
    if (host) host.dataset.live = "true";
  }, [host]);
  useEffect(
    () => () => {
      if (host) delete host.dataset.live;
    },
    [host],
  );
  const progress = useScrollProgress(sectionRef, {
    end: SEQUENCE_SCROLL,
    onUpdate: (p) => {
      onProgress(p);
      sceneStore.invalidate();
    },
  });

  useEffect(() => {
    setHost(sectionRef.current?.querySelector<HTMLElement>("[data-sequence-host]") ?? null);
    sceneStore.enable();
    onProgress(0);
    const t = window.setTimeout(() => sceneStore.invalidate(), 300);
    return () => window.clearTimeout(t);
  }, [onProgress, sectionRef]);

  // While the pinned section is on screen the canvas renders every frame (see sceneStore.setActive).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let on = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry.isIntersecting;
        if (next !== on) {
          on = next;
          sceneStore.setActive(on);
        }
      },
      { rootMargin: "120px 0px 120px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (on) sceneStore.setActive(false);
    };
  }, [sectionRef]);

  if (!host) return null;
  return createPortal(<SequenceView kind={kind} progress={progress} onReady={onReady} />, host);
}
