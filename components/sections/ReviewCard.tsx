import { Icon } from "@/components/ui/Icon";

export type ReviewCardData = {
  id: string;
  author: string;
  initials: string;
  descriptor: string;
  text: string;
  treatmentLabel: string;
  note: string;
};

export function ReviewCard({ data }: { data: ReviewCardData }) {
  return (
    <figure className="card p-6 md:p-7 flex flex-col h-full">
      <blockquote className="font-display text-xl md:text-2xl leading-snug text-graphite">
        <span aria-hidden="true">“</span>
        {data.text}
        <span aria-hidden="true">”</span>
      </blockquote>
      <figcaption className="mt-6 pt-5 hairline flex items-center gap-3">
        <span className="h-10 w-10 flex-none rounded-full bg-sand text-graphite grid place-items-center text-xs font-semibold tracking-wider" aria-hidden="true">
          {data.initials}
        </span>
        <span className="text-sm">
          <span className="block font-medium text-graphite">{data.author}</span>
          <span className="block text-muted">{data.descriptor} · {data.treatmentLabel}</span>
          <span className="block caption mt-0.5">{data.note}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function GoogleBadge({ href, rating, count, labels }: { href: string; rating: string; count: string; labels: { badge: string; readAll: string } }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="card p-6 md:p-7 flex flex-col justify-between hover-lift">
      <div>
        <p className="eyebrow">Google</p>
        <p className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-5xl leading-none text-graphite">{rating}</span>
          <span className="text-muted">{count}</span>
        </p>
        <p className="mt-3 flex gap-1 text-bronze" aria-label={labels.badge}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" size={16} fill="currentColor" stroke="none" />
          ))}
        </p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 text-link">
        {labels.readAll} <Icon name="arrow-up-right" size={14} />
      </span>
    </a>
  );
}
