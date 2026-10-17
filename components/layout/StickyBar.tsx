"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Props = {
  whatsappHref: string;
  telHref: string;
  casesHref: string;
  labels: { whatsapp: string; call: string; cases: string; book: string };
};

/** Mobile-only fixed bottom bar. Hides while the book section (which holds the form) is in view. */
export function StickyBar({ whatsappHref, telHref, casesHref, labels }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const book = document.getElementById("book");
    if (!book || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.2 });
    io.observe(book);
    return () => io.disconnect();
  }, []);

  const item = "flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold tracking-[0.08em] uppercase";

  return (
    <nav
      aria-label="Quick actions"
      className={`md:hidden fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 bg-paper border-t border-line transition-transform duration-500 ease-stone ${hidden ? "translate-y-full" : ""}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${item} text-graphite`} data-event="whatsapp">
        <Icon name="message" size={18} />
        {labels.whatsapp}
      </a>
      <a href={telHref} className={`${item} text-graphite`} data-event="call">
        <Icon name="phone" size={18} />
        {labels.call}
      </a>
      <Link href={casesHref} className={`${item} text-graphite`}>
        <Icon name="compare" size={18} />
        {labels.cases}
      </Link>
      <Link href="#book" className={`${item} bg-terracotta text-alabaster`} data-event="book">
        <Icon name="arrow" size={18} />
        {labels.book}
      </Link>
    </nav>
  );
}
