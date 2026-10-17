import Image from "next/image";
import type { Metadata } from "next";
import { getDict, l, type Lang } from "@/lib/i18n";
import { settings } from "@/lib/content";
import { localize } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, physicianJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AwardsGrid } from "@/components/sections/AwardsGrid";
import { Timeline } from "@/components/sections/Timeline";
import { BookCta } from "@/components/sections/BookCta";

const PATH = "/prof-ahmed-el-hoshy/";

export function createProfessorPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.professorTitle, description: d.meta.professorDescription });

  function Page() {
    const page = localize(lang, PATH);
    return (
      <>
        <JsonLd
          data={[
            physicianJsonLd(lang),
            breadcrumbJsonLd(
              [
                { name: d.common.breadcrumbHome, path: "/" },
                { name: d.nav.professor, path: PATH },
              ],
              lang,
            ),
          ]}
        />

        <section className="container-x pt-10 md:pt-16 pb-12 md:pb-20 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="rise" >{d.professor.pageEyebrow}</Eyebrow>
            <h1 className="h1 mt-5 rise" style={{ "--i": 1 } as React.CSSProperties}>
              {l(settings.doctor, lang)}
            </h1>
            <p className="lead mt-6 max-w-2xl rise" style={{ "--i": 2 } as React.CSSProperties}>
              {d.professor.pageRole}
            </p>
            <p className="mt-4 text-muted max-w-2xl rise" style={{ "--i": 3 } as React.CSSProperties}>
              {d.professor.positioning}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] img-frame max-w-md lg:ms-auto" data-reveal>
              <Image src="/placeholders/professor-portrait.jpg" alt={d.professor.portraitAlt} fill sizes="(min-width: 1024px) 40vw, 100vw" priority className="object-cover" />
            </div>
          </div>
        </section>

        <section className="section bg-sand">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>{d.professor.inHisWords}</Eyebrow>
              <h2 className="h2 mt-4">{d.professor.inHisWords}</h2>
            </div>
            <div className="lg:col-span-8 prose-stone max-w-3xl">
              {d.professor.words.map((p) => (
                <p key={p} className="font-display text-2xl md:text-3xl leading-snug text-graphite">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-x">
            <div className="relative aspect-[16/9] img-frame" data-reveal>
              <Image src="/placeholders/professor-chair.jpg" alt={d.professor.atChairAlt} fill sizes="(min-width: 1440px) 1344px, 100vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>{d.professor.education}</Eyebrow>
              <h2 className="h2 mt-4">{d.professor.education}</h2>
            </div>
            <div className="lg:col-span-8">
              <Timeline items={d.professor.timeline} />
            </div>
          </div>
        </section>

        <section className="section bg-sand">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>{d.professor.awards}</Eyebrow>
              <h2 className="h2 mt-4">{d.professor.awards}</h2>
            </div>
            <div className="lg:col-span-8">
              <AwardsGrid lang={lang} />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-x grid gap-10 md:grid-cols-3">
            <div>
              <h2 className="h3">{d.professor.teaching}</h2>
              <p className="mt-4 text-muted">{d.professor.teachingText}</p>
              <p className="mt-3">
                <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-link text-sm">
                  {d.professor.teachingLink}
                </a>
              </p>
            </div>
            <div>
              <h2 className="h3">{d.professor.clinic}</h2>
              <p className="mt-4 text-muted">{d.professor.clinicText}</p>
            </div>
            <div>
              <h2 className="h3">{d.professor.languages}</h2>
              <p className="mt-4 text-muted">{d.professor.languagesText}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {settings.languages[lang].map((x) => (
                  <li key={x} className="pill cursor-default">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <BookCta lang={lang} page={page} />
      </>
    );
  }

  return { metadata, Page };
}
