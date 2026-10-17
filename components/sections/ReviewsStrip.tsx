import { getDict, l, type Lang } from "@/lib/i18n";
import { googleMapsLink, reviews, services, settings } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GoogleBadge, ReviewCard } from "./ReviewCard";

export function toReviewCard(r: (typeof reviews)[number], lang: Lang) {
  const service = services.find((s) => s.slug === r.treatmentSlug);
  return {
    id: r.id,
    author: r.author,
    initials: r.initials,
    descriptor: l(r.descriptor, lang),
    text: l(r.text, lang),
    treatmentLabel: service ? l(service.shortTitle, lang) : "",
    paraphrased: r.paraphrased,
  };
}

export function ReviewsStrip({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const three = [...reviews].sort((a, b) => Number(b.real) - Number(a.real)).slice(0, 3);
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow={d.reviews.eyebrow} title={d.reviews.title} />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {three.map((r) => (
            <ReviewCard key={r.id} data={toReviewCard(r, lang)} labels={d.reviews} />
          ))}
          <GoogleBadge
            href={googleMapsLink()}
            rating={lang === "ar" ? "٤٫٩" : String(settings.googleRating)}
            count={d.reviews.badgeSub}
            labels={d.reviews}
          />
        </div>
      </div>
    </section>
  );
}
