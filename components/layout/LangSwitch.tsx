"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternatePath } from "@/lib/routes";

type Props = { label: string; ariaLabel: string; className?: string };

/** Links to the same page in the other language tree. */
export function LangSwitch({ label, ariaLabel, className = "" }: Props) {
  const pathname = usePathname() || "/";
  const href = alternatePath(pathname);
  const targetLang = href.startsWith("/ar") ? "ar" : "en";
  return (
    <Link
      href={href}
      hrefLang={targetLang}
      lang={targetLang}
      aria-label={`${label}. ${ariaLabel}`}
      className={`text-sm font-medium tracking-wide text-muted hover:text-graphite transition-colors ${className}`}
    >
      {label}
    </Link>
  );
}
