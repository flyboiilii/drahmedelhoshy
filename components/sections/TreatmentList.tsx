import Image from "next/image";
import Link from "next/link";
import { getDict, fmt, l, type Lang } from "@/lib/i18n";
import { services } from "@/lib/content";
import { localize, servicePath } from "@/lib/routes";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { posterFor } from "@/lib/sequences";

/** Five rows. Each links to its service page and shows the model poster on hover (desktop). */
export function TreatmentList({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const rows = services.filter((s) => s.slug !== "general-dentistry");
  return (
    <section id="treatments" className="section bg-sand">
      <div className="container-x">
        <SectionHeading eyebrow={d.treatments.eyebrow} title={d.treatments.title} />
        <ol className="mt-12 hairline">
          {rows.map((s, i) => (
            <li key={s.slug} className="treatment-row relative border-b border-line">
              <Link href={localize(lang, servicePath(s.slug))} className="grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1fr_14rem_2rem] items-center gap-4 py-6 md:py-8 group">
                <span className="font-display text-xl text-bronze-deep">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-2xl md:text-3xl leading-tight text-graphite group-hover:text-bronze-deep transition-colors duration-500">
                    {l(s.shortTitle, lang)}
                  </span>
                  <span className="block mt-1 text-muted">{l(s.oneLine, lang)}</span>
                </span>
                <span className="hidden md:block caption">
                  <span className="eyebrow block mb-1">{d.treatments.duration}</span>
                  {l(s.durationLabel, lang)}
                </span>
                <span className="text-graphite justify-self-end rtl:-scale-x-100">
                  <Icon name="arrow" size={20} />
                </span>
              </Link>
              <div className="row-poster hidden lg:block absolute end-[3rem] top-1/2 -translate-y-1/2 w-56 aspect-[4/3] img-frame pointer-events-none shadow-[0_18px_40px_rgba(31,28,26,0.14)]" aria-hidden="true">
                <Image src={posterFor(s.model, s.slug)} alt={fmt(d.treatments.posterAlt, { title: l(s.shortTitle, lang) })} fill sizes="224px" className="object-cover" />
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6">
          <Link href={localize(lang, servicePath("general-dentistry"))} className="text-link">
            {l(services.find((s) => s.slug === "general-dentistry")!.shortTitle, lang)}
          </Link>
        </p>
      </div>
    </section>
  );
}
