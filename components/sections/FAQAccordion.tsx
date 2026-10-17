import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export type FaqItem = { id: string; q: string; a: string; href?: string; hrefLabel?: string };

/** Native details/summary, styled. JSON-LD is emitted by the page that renders this. */
export function FAQAccordion({ items, className = "" }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((it) => (
        <details key={it.id} className="faq-item" id={`faq-${it.id}`}>
          <summary>
            <span>{it.q}</span>
            <Icon name="plus" size={18} className="faq-icon" />
          </summary>
          <div className="faq-body">
            <p>{it.a}</p>
            {it.href && it.hrefLabel && (
              <p className="mt-3 text-sm">
                <Link href={it.href} className="text-link">
                  {it.hrefLabel}
                </Link>
              </p>
            )}
          </div>
        </details>
      ))}
      <div className="hairline" />
    </div>
  );
}
