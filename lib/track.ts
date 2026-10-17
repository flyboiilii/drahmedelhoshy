export type TrackEvent = "whatsapp" | "call" | "book" | "lead_submit" | "video_consult";

type Zaraz = { track?: (name: string, data?: Record<string, unknown>) => void };

/**
 * Tiny tracker. Cloudflare Web Analytics counts page views on its own; custom
 * events are forwarded to Cloudflare Zaraz when it is present on the page and
 * otherwise become a DOM CustomEvent so any future tool can listen. Never throws.
 */
export function track(event: TrackEvent, data: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    const zaraz = (window as unknown as { zaraz?: Zaraz }).zaraz;
    if (zaraz?.track) zaraz.track(event, data);
    window.dispatchEvent(new CustomEvent("elhoshy:track", { detail: { event, ...data } }));
  } catch {
    // analytics must never break the page
  }
}

/** Delegated click tracking for any element carrying data-event. Call once per page tree. */
export function bindClickTracking(): () => void {
  if (typeof document === "undefined") return () => {};
  const onClick = (e: MouseEvent) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-event]");
    if (!el) return;
    const ev = el.dataset.event as TrackEvent | undefined;
    if (!ev) return;
    track(ev, { href: el.getAttribute("href") ?? undefined, label: el.dataset.label ?? el.textContent?.trim() });
  };
  document.addEventListener("click", onClick, { capture: true, passive: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}
