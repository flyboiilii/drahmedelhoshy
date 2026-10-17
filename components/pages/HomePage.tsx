import Link from "next/link";
import { Suspense } from "react";
import { getDict, type Lang } from "@/lib/i18n";
import { cases } from "@/lib/content";
import { localize } from "@/lib/routes";
import { breadcrumbJsonLd, clinicJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { BeforeAfterHero } from "@/components/sections/BeforeAfterHero";
import { TreatmentList } from "@/components/sections/TreatmentList";
import { ProfessorBlock } from "@/components/sections/ProfessorBlock";
import { AbroadBlock } from "@/components/sections/AbroadBlock";
import { ReviewsStrip } from "@/components/sections/ReviewsStrip";
import { BookSection } from "@/components/sections/BookSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseGrid } from "@/components/cases/CaseGrid";
import { caseCardLabels, caseFilters, toCaseCard } from "@/components/cases/caseView";
import { SequenceSection } from "@/components/three/SequenceSection";
import { sequenceProps } from "@/components/three/sequenceProps";
import { Icon } from "@/components/ui/Icon";

export function HomePage({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const featured = cases.find((c) => c.slug === "case-014") ?? cases[0];
  const page = localize(lang, "/");

  return (
    <>
      <JsonLd data={[clinicJsonLd(lang), breadcrumbJsonLd([{ name: d.common.breadcrumbHome, path: "/" }], lang)]} />

      <BeforeAfterHero lang={lang} featured={featured} />

      <Suspense>
      <section className="section pt-4 md:pt-8">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={d.cases.eyebrow} title={d.cases.title} />
            <Link href={localize(lang, "/cases/")} className="text-link inline-flex items-center gap-2">
              {d.cases.viewAll} <Icon name="arrow" size={16} className="rtl:-scale-x-100" />
            </Link>
          </div>
          <div className="mt-10">
            <CaseGrid
              id="recent-cases"
              cases={cases.map((c) => toCaseCard(c, lang))}
              filters={caseFilters(lang, ["veneers", "dental-implants", "full-mouth-restoration", "whitening-bonding"])}
              labels={{ ...caseCardLabels(lang), filterLabel: d.cases.filterLabel, all: d.cases.all, noCases: d.cases.noCases }}
              limit={4}
              columns={4}
            />
          </div>
        </div>
      </section>
      </Suspense>

      <Suspense>
        <TreatmentList lang={lang} />
      </Suspense>

      <Suspense>
        <SequenceSection {...sequenceProps("veneer", lang, true)} />
      </Suspense>

      <Suspense>
        <ProfessorBlock lang={lang} />
        <AbroadBlock lang={lang} />
      </Suspense>

      <Suspense>
        <ReviewsStrip lang={lang} />
      </Suspense>

      <Suspense>
        <BookSection lang={lang} page={page} />
      </Suspense>
    </>
  );
}
