"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { canRun3D } from "@/lib/device";
import { onFirstInteraction } from "@/lib/interaction";
import { activeStep, type SequenceKind } from "@/lib/sequences";

const LiveSequence = dynamic(() => import("./LiveSequence"), { ssr: false });

type Props = { kind: SequenceKind; id?: string; children: ReactNode };

/**
 * Client half of a sequence section. Renders the poster-and-text fallback as
 * is; on a capable device, after the first user interaction and within ~1200px
 * of the section, it upgrades to the pinned WebGL sequence (which is also when
 * three.js first loads).
 */
export function SequenceShell({ kind, id, children }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !canRun3D() || !("IntersectionObserver" in window)) return;
    let io: IntersectionObserver | null = null;
    const off = onFirstInteraction(() => {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setLive(true);
            io?.disconnect();
          }
        },
        { rootMargin: "1200px 0px 1200px 0px" },
      );
      io.observe(el);
    });
    return () => {
      off();
      io?.disconnect();
    };
  }, []);

  // DOM side of the choreography: the active step.
  const onProgress = useCallback(
    (p: number) => {
      const root = sectionRef.current;
      if (!root) return;
      const active = activeStep(kind, p);
      root.querySelectorAll<HTMLElement>("[data-step]").forEach((el) => {
        el.dataset.active = String(Number(el.dataset.step) === active);
      });
    },
    [kind],
  );

  return (
    <section ref={sectionRef} id={id} className={`section ${live ? "seq-live min-h-[100svh] flex items-center" : "seq-static"}`} data-sequence={kind}>
      {children}
      {live && <LiveSequence kind={kind} sectionRef={sectionRef} onProgress={onProgress} />}
    </section>
  );
}
