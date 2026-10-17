import Link from "next/link";
import { getDict, type Lang } from "@/lib/i18n";
import { localize } from "@/lib/routes";

export function NotFoundPage({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  return (
    <section className="container-x pt-16 pb-24 max-w-2xl">
      <p className="eyebrow">404</p>
      <h1 className="h1 mt-5">{d.common.notFoundTitle}</h1>
      <p className="lead mt-6">{d.common.notFoundText}</p>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <Link href={localize(lang, "/")} className="text-link">
            {d.common.notFoundHome}
          </Link>
        </li>
        <li>
          <Link href={localize(lang, "/cases/")} className="text-link">
            {d.nav.cases}
          </Link>
        </li>
        <li>
          <Link href={localize(lang, "/book/")} className="text-link">
            {d.nav.book}
          </Link>
        </li>
      </ul>
    </section>
  );
}
