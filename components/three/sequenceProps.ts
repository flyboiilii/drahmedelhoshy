import { getDict, type Lang } from "@/lib/i18n";
import { localize, servicePath } from "@/lib/routes";
import type { SequenceKind } from "@/lib/sequences";
import type { SequenceLabel } from "./SequenceSection";

const SERVICE_FOR: Record<SequenceKind, string> = {
  veneer: "veneers",
  implant: "dental-implants",
  aligner: "clear-aligners",
  fullmouth: "full-mouth-restoration",
};

/** Copy and pause labels for a sequence, from the dictionary. */
export function sequenceProps(kind: SequenceKind, lang: Lang, withLink = false) {
  const d = getDict(lang);
  const s = d.sequences[kind];
  let labels: SequenceLabel[] = [];
  let monthTemplate: string | undefined;

  if (kind === "veneer") {
    const lb = d.sequences.veneer.labels;
    labels = [
      { id: "prep", text: lb.prep, at: 0.3, until: 0.55 },
      { id: "a3", text: lb.a3, at: 0.55, until: 0.85 },
      { id: "bl2", text: lb.bl2, at: 0.85 },
    ];
  } else if (kind === "implant") {
    const lb = d.sequences.implant.labels;
    labels = [
      { id: "bone", text: lb.bone, at: 0.04 },
      { id: "fixture", text: lb.fixture, at: 0.3 },
      { id: "abutment", text: lb.abutment, at: 0.58 },
      { id: "crown", text: lb.crown, at: 0.78 },
    ];
  } else if (kind === "aligner") {
    monthTemplate = d.sequences.aligner.labels.month;
  } else {
    const lb = d.sequences.fullmouth.labels;
    labels = [
      { id: "replacing", text: lb.replacing, at: 0.04, until: 0.6 },
      { id: "restored", text: lb.restored, at: 0.6 },
    ];
  }

  return {
    kind,
    eyebrow: s.eyebrow,
    title: s.title,
    steps: s.steps,
    labels,
    monthTemplate,
    hints: { scroll: d.sequences.scrollHint, static: d.sequences.staticHint },
    link: withLink ? { href: localize(lang, servicePath(SERVICE_FOR[kind])), label: s.link } : undefined,
  };
}
