"use client";

import { useEffect, useState, type ReactNode } from "react";

const KEY = "elhoshy-cases-consent";

type Props = { title: string; text: string; button: string; children: ReactNode };

/**
 * First-visit consent panel for the case gallery. The grid is rendered
 * underneath (blurred) so the page keeps its layout and crawlable content;
 * acceptance is remembered in localStorage inside try/catch.
 */
export function ConsentGate({ title, text, button, children }: Props) {
  const [state, setState] = useState<"unknown" | "yes" | "no">("unknown");

  useEffect(() => {
    try {
      setState(window.localStorage.getItem(KEY) === "1" ? "yes" : "no");
    } catch {
      setState("no");
    }
  }, []);

  const accept = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* private mode: still show the cases for this visit */
    }
    setState("yes");
  };

  const gated = state !== "yes";

  return (
    <div className="relative">
      <div className={gated ? "blur-md pointer-events-none select-none transition-[filter] duration-700" : "transition-[filter] duration-700"} aria-hidden={gated}>
        {children}
      </div>
      {gated && (
        <div className="absolute inset-0 z-30 flex items-start justify-center pt-10 md:pt-20">
          <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="card max-w-md mx-5 p-7 md:p-9 shadow-[0_20px_60px_rgba(31,28,26,0.12)]">
            <p className="eyebrow mb-3">{title}</p>
            <p id="consent-title" className="font-display text-2xl leading-snug">
              {text}
            </p>
            <button type="button" className="btn btn-dark mt-7" onClick={accept} autoFocus={state === "no"}>
              {button}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
