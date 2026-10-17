import type { Metadata } from "next";
import { getDict, type Lang } from "@/lib/i18n";
import { cases } from "@/lib/content";
import { localize } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseGrid } from "@/components/cases/CaseGrid";
import { ConsentGate } from "@/components/cases/ConsentGate";
import { caseCardLabels, caseFilters, toCaseCard } from "@/components/cases/caseView";
import { BookCta } from "@/components/sections/BookCta";

const PATH = "/cases/";

export function createCasesPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.casesTitle, description: d.meta.casesDescription });

  function Page() {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: d.common.breadcrumbHome, path: "/" },
              { name: d.nav.cases, path: PATH },
            ],
            lang,
          )}
        />
        <section className="container-x pt-10 md:pt-16 pb-12">
          <SectionHeading level="h1" eyebrow={d.cases.eyebrow} title={d.cases.pageTitle} lead={d.cases.pageLead} />
        </section>
        <section className="container-x pb-20">
          <ConsentGate title={d.cases.gateTitle} text={d.cases.gateText} button={d.cases.gateButton}>
            <CaseGrid
              id="all-cases"
              cases={cases.map((c) => toCaseCard(c, lang))}
              filters={caseFilters(lang)}
              labels={{ ...caseCardLabels(lang), filterLabel: d.cases.filterLabel, all: d.cases.all, noCases: d.cases.noCases }}
              columns={3}
            />
          </ConsentGate>
        </section>
        <BookCta lang={lang} page={localize(lang, PATH)} />
      </>
    );
  }

  return { metadata, Page };
}
