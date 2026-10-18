"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { canRun3D } from "@/lib/device";
import { sceneStore } from "@/lib/scene-store";
import type { Lang } from "@/lib/i18n";

const ArchViewer = dynamic(() => import("./ArchViewer"), { ssr: false });

type Props = { lang: Lang; labels: { before: string; after: string; handle: string } };

/**
 * Hero slot used only when content/models.json says arch.glb exists. Mounts the
 * 3D proof viewer on capable devices (poster otherwise). Drag on the box or use
 * the slider; both write into the same ref the 3D view reads.
 */
export function ArchViewerSlot({ labels }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const split = useRef(0.5);
  const yaw = useRef(0);
  const [live, setLive] = useState(false);
  const [value, setValue] = useState(50);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const id = useId();

  useEffect(() => {
    if (canRun3D()) setLive(true);
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el || !live) return;
    let dragging = false;
    const update = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      split.current = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      yaw.current = ((e.clientY - r.top) / r.height - 0.5) * 2 * ((15 * Math.PI) / 180);
      setValue(Math.round(split.current * 100));
      sceneStore.invalidate();
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      update(e);
    };
    const onMove = (e: PointerEvent) => dragging && update(e);
    const onUp = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [live]);

  return (
    <div>
      <div
        ref={host}
        className="relative aspect-[4/3] md:aspect-[16/8] img-frame touch-pan-y"
        style={ready ? undefined : { backgroundImage: "url(/posters/arch.webp)", backgroundSize: "cover" }}
        aria-hidden="true"
      >
        {live && <ArchViewer split={split} yaw={yaw} onReady={onReady} />}
      </div>
      {live && (
        <div className="mt-3 flex items-center gap-3">
          <span className="caption">{labels.before}</span>
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            value={value}
            aria-label={labels.handle}
            dir="ltr"
            className="flex-1 accent-graphite"
            onChange={(e) => {
              split.current = Number(e.target.value) / 100;
              setValue(Number(e.target.value));
              sceneStore.invalidate();
            }}
          />
          <span className="caption">{labels.after}</span>
        </div>
      )}
    </div>
  );
}
