/**
 * Runs a callback after the first real user interaction (scroll, wheel, touch,
 * key or pointer). Used to defer smooth scrolling and the 3D preload so that
 * neither loads on a page nobody has touched yet, including audit robots.
 */
const EVENTS: (keyof WindowEventMap)[] = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"];

let interacted = false;
const queue: (() => void)[] = [];
let bound = false;

function fire() {
  if (interacted) return;
  interacted = true;
  EVENTS.forEach((e) => window.removeEventListener(e, fire));
  queue.splice(0).forEach((cb) => cb());
}

export function onFirstInteraction(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (interacted || window.scrollY > 0) {
    interacted = true;
    cb();
    return () => {};
  }
  queue.push(cb);
  if (!bound) {
    bound = true;
    EVENTS.forEach((e) => window.addEventListener(e, fire, { passive: true, once: false }));
  }
  return () => {
    const i = queue.indexOf(cb);
    if (i >= 0) queue.splice(i, 1);
  };
}
