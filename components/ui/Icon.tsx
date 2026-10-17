import type { SVGProps } from "react";

type Name =
  | "arrow"
  | "arrow-up-right"
  | "phone"
  | "message"
  | "video"
  | "menu"
  | "close"
  | "plus"
  | "star"
  | "pin"
  | "clock"
  | "compare"
  | "play"
  | "check";

const paths: Record<Name, React.ReactNode> = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17L17 7M9 7h8v8" />,
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  message: <path d="M4 5h16v11H9l-5 4V5z" />,
  video: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="1.5" />
      <path d="M16 11l5-3v8l-5-3" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 16.8l-5.3 2.8 1.1-5.8-4.3-4.1 5.9-.8z" />,
  pin: (
    <>
      <path d="M12 21s-6-5.3-6-10.5a6 6 0 1 1 12 0C18 15.7 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  compare: <path d="M8 7l-4 5 4 5M16 7l4 5-4 5M12 4v16" />,
  play: <path d="M8 6v12l10-6z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};

type Props = SVGProps<SVGSVGElement> & { name: Name; size?: number };

/** Inline stroke icons. No icon font, no emoji. */
export function Icon({ name, size = 18, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
