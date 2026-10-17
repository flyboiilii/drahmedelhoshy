import { CaseCard, type CaseCardData, type CaseCardLabels } from "./CaseCard";
import { CaseFilterBar, type CaseFilterOption } from "./CaseFilterBar";
import { SERVICE_SLUGS } from "@/lib/routes";

type Props = {
  id: string;
  cases: CaseCardData[];
  filters: CaseFilterOption[];
  labels: CaseCardLabels & { filterLabel: string; all: string; noCases: string };
  /** Cards shown under "All" (CSS nth-child); a specific filter shows all its matches. */
  limit?: 4;
  columns?: 3 | 4;
  priorityFirst?: boolean;
};

/**
 * Server-rendered cards; the filter bar (client, tiny) sets data-filter on
 * this root and the rules in globals.css hide non-matching cards. Nothing
 * about the cards themselves is hydrated.
 */
export function CaseGrid({ id, cases, filters, labels, limit, columns = 4, priorityFirst = false }: Props) {
  const cols = columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  const emptyFor = SERVICE_SLUGS.filter((slug) => filters.some((f) => f.key === slug) && !cases.some((c) => c.treatmentSlug === slug));

  return (
    <div id={id} data-case-grid data-filter="all" data-limit={limit}>
      <CaseFilterBar targetId={id} filters={filters} labels={{ all: labels.all, filterLabel: labels.filterLabel }} />
      <ul className={`mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 ${cols}`}>
        {cases.map((c, i) => (
          <li key={c.slug} data-treatment={c.treatmentSlug}>
            <CaseCard data={c} labels={labels} priority={priorityFirst && i < 2} />
          </li>
        ))}
      </ul>
      {emptyFor.map((slug) => (
        <p key={slug} className="mt-10 text-muted hidden" data-empty-for={slug}>
          {labels.noCases}
        </p>
      ))}
    </div>
  );
}
