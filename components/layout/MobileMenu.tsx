"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Item = { href: string; label: string };

type Props = {
  menuLabel: string;
  closeLabel: string;
  primary: Item[];
  treatments: Item[];
  treatmentsLabel: string;
  secondary: Item[];
  cta: Item;
  lang: Item & { ariaLabel: string };
};

export function MobileMenu({ menuLabel, closeLabel, primary, treatments, treatmentsLabel, secondary, cta, lang }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex items-center gap-2 p-2 -me-2 text-graphite"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-xs font-semibold tracking-[0.14em] uppercase">{open ? closeLabel : menuLabel}</span>
        <Icon name={open ? "close" : "menu"} size={20} />
      </button>

      {open && (
        <div id={id} className="fixed inset-0 top-[72px] z-50 bg-alabaster overflow-y-auto">
          <nav className="container-x py-8 flex flex-col gap-8" aria-label={menuLabel}>
            <ul className="flex flex-col gap-4">
              {primary.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} onClick={() => setOpen(false)} className="font-display text-3xl">
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <p className="eyebrow mb-3">{treatmentsLabel}</p>
              <ul className="flex flex-col gap-2">
                {treatments.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href} onClick={() => setOpen(false)} className="text-lg text-muted hover:text-graphite">
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {secondary.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} onClick={() => setOpen(false)} className="hover:text-graphite">
                    {it.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={lang.href} aria-label={`${lang.label}. ${lang.ariaLabel}`} onClick={() => setOpen(false)} className="hover:text-graphite">
                  {lang.label}
                </Link>
              </li>
            </ul>
            <Link href={cta.href} onClick={() => setOpen(false)} className="btn btn-primary self-start" data-event="book">
              {cta.label}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
