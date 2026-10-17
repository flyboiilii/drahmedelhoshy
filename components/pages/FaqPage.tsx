import Link from "next/link";
import type { Metadata } from "next";
import { getDict, l, type Lang } from "@/lib/i18n";
import { faqs, faqsByService, services } from "@/lib/content";
import { localize, servicePath } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { BookCta } from "@/components/sections/BookCta";

const PATH = "/faq/";

export function createFaqPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.faqTitle, description: d.meta.faqDescription });

  function Page() {
    return (
      <>
        <JsonLd
          data={[
            faqJsonLd(faqs, lang),
            breadcrumbJsonLd(
              [
                { name: d.common.breadcrumbHome, path: "/" },
                { name: d.nav.faq, path: PATH },
              ],
              lang,
            ),
          ]}
        />
        <section className="container-x pt-10 md:pt-16 pb-6">
          <SectionHeading level="h1" eyebrow={d.faqPage.eyebrow} title={d.faqPage.title} lead={d.faqPage.lead} />
        </section>

        {services.map((s) => {
          const items = faqsByService(s.slug);
          if (items.length === 0) return null;
          const href = localize(lang, servicePath(s.slug));
          return (
            <section key={s.slug} className="container-x py-10 md:py-14 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="h3">
                  <Link href={href} className="hover:text-bronze-deep transition-colors">
                    {l(s.shortTitle, lang)}
                  </Link>
                </h2>
                <p className="mt-3">
                  <Link href={href} className="text-link text-sm">
                    {d.faqPage.goTo}
                  </Link>
                </p>
              </div>
              <div className="lg:col-span-8">
                <FAQAccordion items={items.map((f) => ({ id: f.id, q: l(f.q, lang), a: l(f.a, lang), href, hrefLabel: d.faqPage.goTo }))} />
              </div>
            </section>
          );
        })}

        <BookCta lang={lang} page={localize(lang, PATH)} />
      </>
    );
  }

  return { metadata, Page };
}
