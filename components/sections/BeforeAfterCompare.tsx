"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { prefersReducedMotion } from "@/lib/device";

type Img = { src: string; alt: string };

type Props = {
  before: Img;
  after: Img;
  labels: { before: string; after: string; handle: string };
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Wipe from "before" to the midpoint once when first scrolled into view. */
  autoWipe?: boolean;
  /** Arabic: before on the right, after on the left, so the wipe reads right to left. */
  mirrored?: boolean;
};

const clamp = (v: number) => Math.max(0, Math.min(100, v));
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Image-based before/after viewer. Drag anywhere, or use the keyboard on the
 * handle (arrow keys, Home, End). Physical left/right is kept in both languages.
 */
export function BeforeAfterCompare({ before, after, labels, className = "", priority = false, sizes = "100vw", autoWipe = true, mirrored = false }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const start = mirrored ? 0 : 100;
  const pos = useRef(start);
  const dragging = useRef(false);
  const raf = useRef<number | null>(null);
  const interacted = useRef(false);
  const [ariaPos, setAriaPos] = useState(start);

  const apply = useCallback((next: number) => {
    const v = clamp(next);
    pos.current = v;
    root.current?.style.setProperty("--pos", v.toFixed(2));
    const rounded = Math.round(v);
    setAriaPos((prev) => (prev === rounded ? prev : rounded));
  }, []);

  const stopAnimation = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
    root.current?.classList.remove("is-animating");
  }, []);

  // Auto wipe once on first view (or jump to the midpoint under reduced motion).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!autoWipe || prefersReducedMotion() || !("IntersectionObserver" in window)) {
      apply(50);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || interacted.current) return;
        io.disconnect();
        const from = pos.current;
        const to = 50;
        const duration = 1600;
        const start = performance.now();
        el.classList.add("is-animating");
        const frame = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          apply(from + (to - from) * easeOutExpo(t));
          if (t < 1 && !interacted.current) raf.current = requestAnimationFrame(frame);
          else stopAnimation();
        };
        raf.current = requestAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stopAnimation();
    };
  }, [apply, autoWipe, stopAnimation]);

  const fromEvent = (clientX: number) => {
    const rect = root.current!.getBoundingClientRect();
    apply(((clientX - rect.left) / rect.width) * 100);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    interacted.current = true;
    stopAnimation();
    dragging.current = true;
    root.current?.setPointerCapture(e.pointerId);
    fromEvent(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    fromEvent(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    try {
      root.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = pos.current - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = pos.current + step;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = 100;
        break;
      case "PageDown":
        next = pos.current - 10;
        break;
      case "PageUp":
        next = pos.current + 10;
        break;
    }
    if (next !== null) {
      e.preventDefault();
      interacted.current = true;
      stopAnimation();
      apply(next);
    }
  };

  return (
    <div
      ref={root}
      className={`compare ${mirrored ? "compare-mirrored" : ""} ${className}`}
      style={{ "--pos": start } as React.CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Image
        src={before.src}
        alt={before.alt}
        fill
        sizes={sizes}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
        className="compare-before"
        draggable={false}
      />
      <Image src={after.src} alt={after.alt} fill sizes={sizes} loading="lazy" className="compare-after" draggable={false} />
      <span className="compare-tag" style={mirrored ? { right: 14 } : { left: 14 }}>
        {labels.before}
      </span>
      <span className="compare-tag" style={mirrored ? { left: 14 } : { right: 14 }}>
        {labels.after}
      </span>
      <div className="compare-handle">
        <div
          className="compare-knob"
          role="slider"
          tabIndex={0}
          aria-label={labels.handle}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ariaPos}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
        >
          <Icon name="compare" size={20} />
        </div>
      </div>
    </div>
  );
}
