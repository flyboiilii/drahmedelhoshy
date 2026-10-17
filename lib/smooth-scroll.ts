import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let instance: Lenis | null = null;

/** Start Lenis and bridge it to GSAP's ticker and ScrollTrigger. Returns a stop function. */
export function startSmoothScroll(): () => void {
  if (instance) return () => {};
  const lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  instance = lenis;

  const onScroll = () => ScrollTrigger.update();
  lenis.on("scroll", onScroll);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // In-page anchors (#book) go through Lenis so the pinned sections stay in sync.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -16 });
    history.pushState(null, "", `#${id}`);
  };
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(tick);
    lenis.off("scroll", onScroll);
    lenis.destroy();
    instance = null;
  };
}

export function getLenis(): Lenis | null {
  return instance;
}
