import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, l, type Lang } from "@/lib/i18n";
import { concerns, getCase, getConcern, getService } from "@/lib/content";
import { concernPath, localize, servicePath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { CaseCard } from "@/components/cases/CaseCard";
import { caseCardLabels, toCaseCard } from "@/components/cases/caseView";
import { BookCta } from "@/components/sections/BookCta";

type Params = { slug: string };

export function concernStaticParams(): Params[] {
  return concerns.map((c) => ({ slug: c.slug }));
}

export function createConcernPage(lang: Lang) {
  const d = getDict(lang);

  async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug } = await params;
    const c = getConcern(slug);
    if (!c) return {};
    return buildMetadata({ lang, path: concernPath(slug), title: l(c.seoTitle, lang), description: l(c.description, lang) });
  }

  async function Page({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const c = getConcern(slug);
    if (!c) notFound();
    const service = getService(c.serviceSlug);
    const path = concernPath(slug);
    const page = localize(lang, path);
    const related = c.caseSlugs.map((s) => getCase(s)).filter((k): k is NonNullable<typeof k> => Boolean(k));
    const others = concerns.filter((o) => o.slug !== slug);

    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: d.common.breadcrumbHome, path: "/" },
              { name: l(c.title, lang), path },
            ],
            lang,
          )}
        />
        <section className="container-x pt-10 md:pt-16 pb-12 md:pb-16">
          <div className="max-w-4xl">
            <Eyebrow className="rise">{d.concerns.eyebrow}</Eyebrow>
            <h1 className="h1 mt-5 rise" style={{ "--i": 1 } as React.CSSProperties}>
              {l(c.title, lang)}
            </h1>
            <div className="prose-stone mt-8 max-w-3xl rise" style={{ "--i": 2 } as React.CSSProperties}>
              {c.paragraphs[lang].map((p, i) => (
                <p key={i} className="text-lg">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="section bg-sand">
          <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Eyebrow>{d.concerns.treatment}</Eyebrow>
              <h2 className="h2 mt-4">{l(service.title, lang)}</h2>
              <p className="lead mt-4">{l(service.oneLine, lang)}</p>
            </div>
            <div className="lg:col-span-5 lg:text-end">
              <Button href={localize(lang, servicePath(service.slug))} variant="dark">
                {d.concerns.readMore} {l(service.shortTitle, lang)}
              </Button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-x">
            <h2 className="h3">{d.concerns.cases}</h2>
            <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 max-w-4xl">
              {related.map((k) => (
                <li key={k.slug}>
                  <CaseCard data={toCaseCard(k, lang)} labels={caseCardLabels(lang)} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-x">
            <h2 className="h3">{d.concerns.listTitle}</h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={localize(lang, concernPath(o.slug))} className="text-link">
                    {l(o.title, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <BookCta lang={lang} page={page} service={l(service.shortTitle, lang)} />
      </>
    );
  }

  return { generateMetadata, Page };
}
