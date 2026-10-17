import type { SVGProps } from "react";

/**
 * The clinic's mark: six tooth crowns arranged as a flower, redrawn as a
 * single-colour vector (the original artwork is blue; the site uses it in
 * graphite or brass so it sits inside the Alabaster and Light palette).
 * Inherits currentColor.
 */
export function LogoMark({ size = 28, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  const petal = "M50 38C42 34 32 26 34 18C36 12 44 11 50 15C56 11 64 12 66 18C68 26 58 34 50 38Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 50 50)`}>
          <path d={petal} />
          <path d={petal} strokeWidth={1.2} transform="translate(50 26) scale(0.62) translate(-50 -26)" />
        </g>
      ))}
    </svg>
  );
}

/** Raw SVG markup of the mark, for files rendered outside React (favicon, OG images). */
export function logoMarkSvg(color: string, size: number): string {
  const petal = "M50 38C42 34 32 26 34 18C36 12 44 11 50 15C56 11 64 12 66 18C68 26 58 34 50 38Z";
  const groups = [0, 60, 120, 180, 240, 300]
    .map((deg) => `<g transform="rotate(${deg} 50 50)"><path d="${petal}"/><path d="${petal}" stroke-width="1.2" transform="translate(50 26) scale(0.62) translate(-50 -26)"/></g>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round">${groups}</svg>`;
}
