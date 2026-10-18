import { getDict, type Lang } from "@/lib/i18n";
import { localize, servicePath } from "@/lib/routes";
import type { SequenceKind } from "@/lib/sequences";

const SERVICE_FOR: Record<SequenceKind, string> = {
  veneer: "veneers",
  implant: "dental-implants",
  aligner: "clear-aligners",
  fullmouth: "full-mouth-restoration",
};

/** Copy for a sequence, from the dictionary. */
export function sequenceProps(kind: SequenceKind, lang: Lang, withLink = false) {
  const d = getDict(lang);
  const s = d.sequences[kind];
  return {
    kind,
    eyebrow: s.eyebrow,
    title: s.title,
    steps: s.steps,
    hints: { scroll: d.sequences.scrollHint, static: d.sequences.staticHint },
    link: withLink ? { href: localize(lang, servicePath(SERVICE_FOR[kind])), label: s.link } : undefined,
  };
}
