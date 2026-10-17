import { awards } from "@/lib/content";
import { l, type Lang } from "@/lib/i18n";

export function AwardsGrid({ lang }: { lang: Lang }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {awards.map((a) => (
        <li key={a.id} className="card p-6">
          <p className="font-display text-xl leading-snug">{l(a.title, lang)}</p>
          <p className="mt-3 text-sm text-muted">{l(a.issuer, lang)}</p>
          <p className="mt-1 caption">{a.year}</p>
        </li>
      ))}
    </ul>
  );
}
