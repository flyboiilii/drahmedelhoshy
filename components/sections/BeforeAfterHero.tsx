import { getDict, l, type Lang } from "@/lib/i18n";
import { models, type Case } from "@/lib/content";
import { whatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { StatsRow } from "@/components/ui/StatsRow";
import { BeforeAfterCompare } from "./BeforeAfterCompare";
import { ArchViewerSlot } from "@/components/three/ArchViewerSlot";

/**
 * Concept B hero: the case is the headline. Terracotta is reserved for the
 * header button in this viewport, so the two hero buttons are dark and outline.
 */
export function BeforeAfterHero({ lang, featured }: { lang: Lang; featured: Case }) {
  const d = getDict(lang);
  const beforeAlt = l({ en: `Case ${featured.caseNumber} before treatment`, ar: `الحالة ${featured.caseNumber} قبل العلاج` }, lang);
  const afterAlt = l({ en: `Case ${featured.caseNumber} after treatment`, ar: `الحالة ${featured.caseNumber} بعد العلاج` }, lang);

  return (
    <section className="container-x pt-8 md:pt-14 pb-10 md:pb-16">
      <div className="max-w-4xl">
        <p className="eyebrow rise flex flex-wrap items-center gap-x-3 gap-y-1" style={{ "--i": 0 } as React.CSSProperties}>
          <span>{d.hero.eyebrow}</span>
          <span className="placeholder-tag normal-case tracking-normal">{d.hero.eyebrowNote}</span>
        </p>
        <h1 className="h1 mt-5 rise" style={{ "--i": 1 } as React.CSSProperties}>
          {d.hero.title} <em>{d.hero.titleEm}</em>
        </h1>
      </div>

      <div className="mt-10 md:mt-14">
        {models.arch ? (
          <ArchViewerSlot lang={lang} labels={d.compare} />
        ) : (
          <BeforeAfterCompare
            before={{ src: featured.before, alt: beforeAlt }}
            after={{ src: featured.after, alt: afterAlt }}
            labels={d.compare}
            className="aspect-[4/3] md:aspect-[16/8]"
            priority
            mirrored={lang === "ar"}
            sizes="(min-width: 1440px) 1344px, 100vw"
          />
        )}
        <p className="caption mt-3 flex flex-wrap gap-x-3">
          <span>{d.cases.consentShort}</span>
          <span className="placeholder-tag">{d.compare.placeholderNote}</span>
        </p>
      </div>

      <div className="mt-10 md:mt-14 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7 rise" style={{ "--i": 2 } as React.CSSProperties}>
          <p className="lead max-w-2xl">{d.hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#book" variant="dark" event="book">
              {d.hero.book}
            </Button>
            <Button href={whatsAppUrl(lang, { page: lang === "ar" ? "/ar/" : "/" })} variant="secondary" event="whatsapp">
              {d.hero.whatsapp}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-5 rise" style={{ "--i": 3 } as React.CSSProperties}>
          <StatsRow stats={d.hero.stats} />
        </div>
      </div>
    </section>
  );
}
