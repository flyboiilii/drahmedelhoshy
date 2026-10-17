import type { Case } from "@/lib/content";
import { services } from "@/lib/content";
import { getDict, l, type Lang } from "@/lib/i18n";
import { casePath, localize } from "@/lib/routes";
import type { CaseCardData, CaseCardLabels } from "./CaseCard";

/** Serialisable card data for a case (what the client grid needs, nothing more). */
export function toCaseCard(c: Case, lang: Lang): CaseCardData {
  const service = services.find((s) => s.slug === c.treatmentSlug);
  return {
    slug: c.slug,
    href: localize(lang, casePath(c.slug)),
    caseNumber: c.caseNumber,
    before: c.before,
    after: c.after,
    treatmentSlug: c.treatmentSlug,
    treatmentLabel: service ? l(service.shortTitle, lang) : c.treatmentSlug,
    ageBand: l(c.ageBand, lang),
    visits: c.visits,
    placeholder: c.placeholder,
  };
}

export function caseCardLabels(lang: Lang): CaseCardLabels {
  const d = getDict(lang);
  return {
    case: d.cases.case,
    before: d.compare.before,
    after: d.compare.after,
    visits: d.cases.visits,
    visit: d.cases.visit,
    consentShort: d.cases.consentShort,
  };
}

/** Filter options for a given set of service slugs. */
export function caseFilters(lang: Lang, slugs?: string[]) {
  return services
    .filter((s) => !slugs || slugs.includes(s.slug))
    .map((s) => ({ key: s.slug, label: l(s.shortTitle, lang) }));
}
