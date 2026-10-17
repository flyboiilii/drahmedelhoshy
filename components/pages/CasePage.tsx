import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fmt, getDict, l, type Lang } from "@/lib/i18n";
import { cases, getCase, getService, isPlaceholder } from "@/lib/content";
import { casePath, localize, servicePath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { BeforeAfterCompare } from "@/components/sections/BeforeAfterCompare";
import { BookCta } from "@/components/sections/BookCta";

type Params = { slug: string };

export function caseStaticParams(): Params[] {
  return cases.map((c) => ({ slug: c.slug }));
}

export function createCasePage(lang: Lang) {
  const d = getDict(lang);

  async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug } = await params;
    const c = getCase(slug);
    if (!c) return {};
    const service = getService(c.treatmentSlug);
    return buildMetadata({
      lang,
      path: casePath(slug),
      title: fmt(d.meta.caseTitle, { number: c.caseNumber, treatment: l(service.shortTitle, lang) }),
      description: fmt(d.meta.caseDescription, { number: c.caseNumber, treatment: l(service.shortTitle, lang) }),
    });
  }

  async function Page({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const c = getCase(slug);
    if (!c) notFound();
    const service = getService(c.treatmentSlug);
    const path = casePath(slug);
    const page = localize(lang, path);
    const facts: { label: string; value: string }[] = [
      { label: d.cases.factTreatment, value: l(service.shortTitle, lang) },
      { label: d.cases.factTeeth, value: String(c.teethCount) },
      { label: d.cases.factMaterial, value: c.material },
      { label: d.cases.factVisits, value: String(c.visits) },
      { label: d.cases.factMonths, value: String(c.monthsPostOp) },
      { label: d.cases.factAge, value: l(c.ageBand, lang) },
    ];

    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: d.common.breadcrumbHome, path: "/" },
              { name: d.nav.cases, path: "/cases/" },
              { name: `${d.cases.case} ${c.caseNumber}`, path },
            ],
            lang,
          )}
        />
        <section className="container-x pt-10 md:pt-16">
          <Link href={localize(lang, "/cases/")} className="text-link inline-flex items-center gap-2 text-sm">
            <Icon name="arrow" size={14} className="rotate-180 rtl:rotate-0" /> {d.cases.backToCases}
          </Link>
          <Eyebrow className="mt-8">
            {d.cases.case} {c.caseNumber} · {l(c.ageLabel, lang)}
          </Eyebrow>
          <h1 className="h1 mt-4 max-w-4xl">{l(service.title, lang)}</h1>
          <div className="mt-10">
            <BeforeAfterCompare
              before={{ src: c.before, alt: `${d.cases.case} ${c.caseNumber}, ${d.compare.before}` }}
              after={{ src: c.after, alt: `${d.cases.case} ${c.caseNumber}, ${d.compare.after}` }}
              labels={d.compare}
              className="aspect-[4/3] md:aspect-[16/8]"
              priority
              mirrored={lang === "ar"}
              sizes="(min-width: 1440px) 1344px, 100vw"
            />
            <p className="caption mt-3 flex flex-wrap gap-x-3">
              <span>{d.cases.consentShort}</span>
              <span className="placeholder-tag">{d.compare.placeholderNote}</span>
            </p>
          </div>
        </section>

        <section className="section">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <dl className="hairline">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-2 gap-4 py-4 border-b border-line">
                    <dt className="text-muted">{f.label}</dt>
                    <dd>{isPlaceholder(f.value) ? <span className="placeholder-tag">{f.value}</span> : f.value}</dd>
                  </div>
                ))}
              </dl>
              {c.placeholder && (
                <p className="caption mt-4">
                  <span className="placeholder-tag">{d.cases.placeholderNote}</span>
                </p>
              )}
            </div>
            <div className="lg:col-span-7">
              <h2 className="h3">{d.cases.story}</h2>
              <div className="prose-stone mt-6 max-w-2xl">
                {c.story[lang].map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <p className="mt-8 caption">{d.cases.consentShort} {d.common.resultsVary}</p>
              <div className="mt-8">
                <p className="eyebrow mb-3">{d.cases.related}</p>
                <Button href={localize(lang, servicePath(service.slug))} variant="secondary">
                  {l(service.shortTitle, lang)}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <BookCta lang={lang} page={page} service={l(service.shortTitle, lang)} />
      </>
    );
  }

  return { generateMetadata, Page };
}
