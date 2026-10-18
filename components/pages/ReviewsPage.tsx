import type { Metadata } from "next";
import { getDict, l, type Lang } from "@/lib/i18n";
import { googleMapsLink, reviews, settings, videos } from "@/lib/content";
import { localize } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { GoogleBadge } from "@/components/sections/ReviewCard";
import { ReviewsGrid } from "@/components/sections/ReviewsGrid";
import { InstagramReel } from "@/components/sections/InstagramReel";
import { toReviewCard } from "@/components/sections/ReviewsStrip";
import { caseFilters } from "@/components/cases/caseView";
import { BookCta } from "@/components/sections/BookCta";

const PATH = "/reviews/";

export function createReviewsPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.reviewsTitle, description: d.meta.reviewsDescription });

  function Page() {
    const items = reviews.map((r) => ({ ...toReviewCard(r, lang), treatmentSlug: r.treatmentSlug }));
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: d.common.breadcrumbHome, path: "/" },
              { name: d.nav.reviews, path: PATH },
            ],
            lang,
          )}
        />
        <section className="container-x pt-10 md:pt-16 pb-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionHeading level="h1" eyebrow={d.reviews.eyebrow} title={d.reviews.title} lead={d.reviews.pageLead} />
          </div>
          <div className="lg:col-span-4">
            <GoogleBadge href={googleMapsLink()} rating={lang === "ar" ? "٤٫٩" : String(settings.googleRating)} count={d.reviews.badgeSub} labels={d.reviews} />
          </div>
        </section>

        <section className="container-x pb-10">
          <p className="eyebrow mb-3">{d.reviews.keywordsTitle}</p>
          <ul className="flex flex-wrap gap-2">
            {settings.googleReviewKeywords.map((k) => (
              <li key={k} className="pill cursor-default" lang="en" dir="ltr">
                {k}
              </li>
            ))}
          </ul>
        </section>

        <section className="container-x pb-16">
          <ReviewsGrid items={items} filters={caseFilters(lang)} labels={{ all: d.reviews.all, filter: d.reviews.filter, none: d.reviews.none }} />
        </section>

        <section className="section bg-sand">
          <div className="container-x">
            <SectionHeading eyebrow={d.reviews.videoSub} title={d.reviews.videoTitle} />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 max-w-4xl">
              {videos.map((v) => (
                <li key={v.id}>
                  <InstagramReel id={v.id} url={v.url} poster={v.poster} title={l(v.title, lang)} playLabel={d.reviews.videoPlay} openLabel={d.reviews.videoOpen} />
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <a href={googleMapsLink()} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-2">
                {d.reviews.readAll} <Icon name="arrow-up-right" size={14} />
              </a>
            </p>
          </div>
        </section>

        <BookCta lang={lang} page={localize(lang, PATH)} />
      </>
    );
  }

  return { metadata, Page };
}
