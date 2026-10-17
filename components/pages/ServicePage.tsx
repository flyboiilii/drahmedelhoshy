import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getDict, l, otherLang, type Lang } from "@/lib/i18n";
import { casesFor, concerns, faqsFor, getService, isPlaceholder, materialValue, services } from "@/lib/content";
import { concernPath, localize, servicePath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, procedureJsonLd } from "@/lib/jsonld";
import { whatsAppUrl } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BookCta } from "@/components/sections/BookCta";
import { CaseCard } from "@/components/cases/CaseCard";
import { caseCardLabels, toCaseCard } from "@/components/cases/caseView";
import { SequenceSection } from "@/components/three/SequenceSection";
import { sequenceProps } from "@/components/three/sequenceProps";

export function createServicePage(lang: Lang, slug: string): { metadata: Metadata; Page: () => React.JSX.Element } {
  const service = getService(slug);
  const path = servicePath(slug);
  const metadata = buildMetadata({ lang, path, title: l(service.seoTitle, lang), description: l(service.description, lang) });

  function Page() {
    const d = getDict(lang);
    const page = localize(lang, path);
    const serviceCases = casesFor(slug);
    const faqs = faqsFor(service.faqIds);
    const related = concerns.filter((c) => c.serviceSlug === slug);
    const others = services.filter((s) => s.slug !== slug);
    const labels = caseCardLabels(lang);

    return (
      <>
        <JsonLd
          data={[
            procedureJsonLd(service, lang),
            faqJsonLd(faqs, lang),
            breadcrumbJsonLd(
              [
                { name: d.common.breadcrumbHome, path: "/" },
                { name: l(service.shortTitle, lang), path },
              ],
              lang,
            ),
          ]}
        />

        {/* 1. Fear-first intro */}
        <section className="container-x pt-10 md:pt-16 pb-12 md:pb-20">
          <div className="max-w-4xl">
            <p className="eyebrow rise" style={{ "--i": 0 } as React.CSSProperties} lang={otherLang(lang)} dir={otherLang(lang) === "ar" ? "rtl" : "ltr"}>
              {l(service.title, otherLang(lang))}
            </p>
            <h1 className="h1 mt-5 rise" style={{ "--i": 1 } as React.CSSProperties}>
              {l(service.title, lang)}
            </h1>
            <p className="lead mt-8 max-w-3xl rise" style={{ "--i": 2 } as React.CSSProperties}>
              {l(service.fearIntro, lang)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 rise" style={{ "--i": 3 } as React.CSSProperties}>
              <Button href="#book" variant="dark" event="book">
                {d.common.book}
              </Button>
              <Button href={whatsAppUrl(lang, { service: l(service.shortTitle, lang), page })} variant="secondary" event="whatsapp">
                {d.common.whatsapp}
              </Button>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-6 max-w-md">
              <div className="border-s border-line ps-4">
                <dt className="caption">{d.service.visitsLabel}</dt>
                <dd className="font-display text-2xl">{l(service.visits, lang)}</dd>
              </div>
              <div className="border-s border-line ps-4">
                <dt className="caption">{d.service.timeLabel}</dt>
                <dd className="font-display text-2xl">{l(service.days, lang)}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 2. Sequence or video placeholder */}
        <Suspense>
        {service.model !== "none" ? (
          <SequenceSection {...sequenceProps(service.model, lang)} />
        ) : (
          <section className="section pt-0">
            <div className="container-x">
              <div className="relative aspect-[16/9] img-frame" data-reveal>
                <Image
                  src={slug === "whitening-bonding" ? "/placeholders/treatment-room.jpg" : "/placeholders/sterilisation.jpg"}
                  alt={slug === "whitening-bonding" ? d.book.photos[2] : d.book.photos[3]}
                  fill
                  sizes="(min-width: 1440px) 1344px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* 3. How it works */}
        <section className="section bg-sand">
          <div className="container-x">
            <SectionHeading eyebrow={d.service.how} title={d.service.how} />
            <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((s, i) => (
                <li key={i} className="card p-6">
                  <p className="eyebrow">
                    {d.service.step} {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-display text-2xl mt-3 leading-tight">{l(s.title, lang)}</h3>
                  <p className="mt-3 text-muted">{l(s.text, lang)}</p>
                  <p className="mt-4 caption">{l(s.when, lang)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. Who it is for, who it is not for */}
        <section className="section">
          <div className="container-x grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="h3">{d.service.whoFor}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {service.whoFor.map((w, i) => (
                  <li key={i} className="flex gap-3 text-graphite">
                    <Icon name="check" size={18} className="mt-1 flex-none text-bronze-deep" />
                    {l(w, lang)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h3">{d.service.whoNotFor}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {service.whoNotFor.map((w, i) => (
                  <li key={i} className="flex gap-3 text-muted">
                    <span className="mt-3 h-px w-4 flex-none bg-bronze" aria-hidden="true" />
                    {l(w, lang)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Materials and brands */}
        <section className="section pt-0">
          <div className="container-x">
            <h2 className="h3">{d.service.materials}</h2>
            <dl className="mt-6 hairline">
              {service.materials.map((m) => {
                const value = materialValue(m.value, lang);
                return (
                  <div key={l(m.label, lang)} className="grid grid-cols-[10rem_1fr] md:grid-cols-[16rem_1fr] gap-4 py-4 border-b border-line">
                    <dt className="text-muted">{l(m.label, lang)}</dt>
                    <dd>{isPlaceholder(value) ? <span className="placeholder-tag">{value}</span> : value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>

        {/* 6. Cases */}
        <section className="section bg-sand">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow={d.service.cases} title={d.cases.title} />
              <Link href={localize(lang, "/cases/")} className="text-link inline-flex items-center gap-2">
                {d.cases.viewAll} <Icon name="arrow" size={16} className="rtl:-scale-x-100" />
              </Link>
            </div>
            {serviceCases.length === 0 ? (
              <p className="mt-8 text-muted">{d.cases.noCases}</p>
            ) : (
              <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {serviceCases.slice(0, 3).map((c) => (
                  <li key={c.slug}>
                    <CaseCard data={toCaseCard(c, lang)} labels={labels} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* 7. Cost */}
        <section className="section">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>{d.service.cost}</Eyebrow>
              <h2 className="h2 mt-4">{d.service.cost}</h2>
            </div>
            <div className="lg:col-span-8 prose-stone max-w-3xl">
              <p className="text-lg">{l(service.costParagraph, lang)}</p>
              <p>
                <Link href={localize(lang, "/pricing/")} className="text-link">
                  {d.nav.pricing}
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section className="section pt-0">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>{d.service.faq}</Eyebrow>
              <h2 className="h2 mt-4">{d.faqPage.title}</h2>
            </div>
            <div className="lg:col-span-8">
              <FAQAccordion items={faqs.map((f) => ({ id: f.id, q: l(f.q, lang), a: l(f.a, lang) }))} />
            </div>
          </div>
        </section>

        {/* Related concerns and other treatments */}
        {(related.length > 0 || others.length > 0) && (
          <section className="section pt-0">
            <div className="container-x grid gap-12 md:grid-cols-2">
              {related.length > 0 && (
                <div>
                  <h2 className="h3">{d.service.concernsTitle}</h2>
                  <ul className="mt-6 flex flex-col gap-3">
                    {related.map((c) => (
                      <li key={c.slug}>
                        <Link href={localize(lang, concernPath(c.slug))} className="text-link text-lg">
                          {l(c.title, lang)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h2 className="h3">{d.service.otherTreatments}</h2>
                <ul className="mt-6 flex flex-col gap-3">
                  {others.map((s) => (
                    <li key={s.slug}>
                      <Link href={localize(lang, servicePath(s.slug))} className="text-link text-lg">
                        {l(s.shortTitle, lang)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 9. Book */}
        <BookCta lang={lang} page={page} service={l(service.shortTitle, lang)} />
        </Suspense>
      </>
    );
  }

  return { metadata, Page };
}
