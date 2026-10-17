import Image from "next/image";
import Link from "next/link";
import { getDict, l, type Lang } from "@/lib/i18n";
import { awards, settings } from "@/lib/content";
import { localize } from "@/lib/routes";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ProfessorBlock({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  return (
    <section className="section">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <div className="relative aspect-[3/4] img-frame max-w-md" data-reveal>
            <Image src="/placeholders/professor-portrait.jpg" alt={d.professor.portraitAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <span className="placeholder-tag absolute bottom-3 start-3">[IMAGE]</span>
          </div>
        </div>
        <div className="lg:col-span-7 lg:ps-8">
          <Eyebrow>{d.professor.eyebrow}</Eyebrow>
          <h2 className="h2 mt-4">{l(settings.doctor, lang)}</h2>
          <p className="lead mt-4">{d.professor.positioning}</p>
          <p className="mt-6 text-muted max-w-2xl">{d.professor.bio}</p>
          <AwardsRow lang={lang} />
          <Link href={localize(lang, "/prof-ahmed-el-hoshy/")} className="btn btn-secondary mt-8">
            {d.professor.link}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AwardsRow({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  return (
    <div className="mt-8">
      <p className="eyebrow mb-3">{d.professor.awardsLabel}</p>
      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {awards.map((a) => (
          <li key={a.id} className="flex gap-3 text-sm text-muted">
            <span className="mt-2 h-px w-5 flex-none bg-bronze" aria-hidden="true" />
            <span>
              {l(a.title, lang)}
              <span className="block text-xs text-muted mt-0.5">{l(a.issuer, lang)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
