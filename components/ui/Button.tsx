import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "dark";
type Size = "md" | "sm";

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Analytics hook: whatsapp | call | book */
  event?: "whatsapp" | "call" | "book" | "video_consult";
};

type LinkProps = Common & { href: string; external?: boolean } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type ButtonProps = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  dark: "btn-dark",
};

/**
 * Button. Terracotta (primary) is the action colour and appears at most once per
 * viewport, so most calls use "dark" or "secondary".
 */
export function Button(props: LinkProps | ButtonProps) {
  const { variant = "secondary", size = "md", className = "", children, event } = props;
  const cls = ["btn", variantClass[variant], size === "sm" ? "btn-sm" : "", className].filter(Boolean).join(" ");

  if ("href" in props && typeof props.href === "string") {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, event: _e, ...rest } = props;
    void _v; void _s; void _c; void _ch; void _e;
    const isExternal = external ?? /^(https?:|tel:|mailto:)/.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={cls}
          data-event={event}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} data-event={event} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, event: _e, href: _h, ...rest } = props as ButtonProps;
  void _v; void _s; void _c; void _ch; void _e; void _h;
  return (
    <button className={cls} data-event={event} {...rest}>
      {children}
    </button>
  );
}
