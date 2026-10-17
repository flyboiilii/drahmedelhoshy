"use client";

import { useEffect, useState, type RefObject } from "react";
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

  if (!host) return null;
  return createPortal(<SequenceView kind={kind} progress={progress} />, host);
}
