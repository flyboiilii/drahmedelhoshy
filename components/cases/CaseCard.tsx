import Image from "next/image";
import Link from "next/link";

export type CaseCardData = {
  slug: string;
  href: string;
  caseNumber: string;
  before: string;
  after: string;
  treatmentSlug: string;
  treatmentLabel: string;
  ageBand: string;
  visits: number;
  placeholder: boolean;
};

export type CaseCardLabels = {
  case: string;
  before: string;
  after: string;
  visits: string;
  visit: string;
  consentShort: string;
};

export function CaseCard({ data, labels, priority = false }: { data: CaseCardData; labels: CaseCardLabels; priority?: boolean }) {
  const visitsLabel = data.visits === 1 ? labels.visit : labels.visits;
  return (
    <article className="group">
      <Link href={data.href} className="block hover-lift">
        <div className="grid grid-cols-2 gap-1 img-frame">
          <div className="relative aspect-[4/3] overflow-hidden img-zoom" data-reveal>
            <Image src={data.before} alt={`${labels.case} ${data.caseNumber}, ${labels.before}`} fill sizes="(min-width: 1024px) 20vw, 45vw" priority={priority} className="object-cover" />
            <span className="absolute top-2 start-2 text-[10px] font-semibold tracking-[0.14em] uppercase px-2 py-1 rounded bg-graphite/70 text-alabaster">{labels.before}</span>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden img-zoom" data-reveal>
            <Image src={data.after} alt={`${labels.case} ${data.caseNumber}, ${labels.after}`} fill sizes="(min-width: 1024px) 20vw, 45vw" priority={priority} className="object-cover" />
            <span className="absolute top-2 start-2 text-[10px] font-semibold tracking-[0.14em] uppercase px-2 py-1 rounded bg-graphite/70 text-alabaster">{labels.after}</span>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl leading-tight text-graphite">
            {data.treatmentLabel}
          </h3>
          <span className="eyebrow whitespace-nowrap">{labels.case} {data.caseNumber}</span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {data.ageBand} · {data.visits} {visitsLabel}
        </p>
      </Link>
      <p className="caption mt-2">{labels.consentShort}</p>
    </article>
  );
}
