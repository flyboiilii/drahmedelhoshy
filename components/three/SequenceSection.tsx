import Image from "next/image";
import Link from "next/link";
import { SEQUENCE_POSTERS, type SequenceKind } from "@/lib/sequences";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SequenceShell } from "./SequenceShell";

export type SequenceStep = { title: string; text: string };
export type SequenceLabel = { id: string; text: string; at: number; until?: number };

type Props = {
  kind: SequenceKind;
  eyebrow: string;
  title: string;
  steps: SequenceStep[];
  labels: SequenceLabel[];
  /** Template with {n}, used by the aligner month counter. */
  monthTemplate?: string;
  link?: { href: string; label: string };
  hints: { scroll: string; static: string };
  id?: string;
};

/**
 * One scroll-driven explainer. All copy is server-rendered; SequenceShell is
 * the small client part that pins the section, drives the step highlighting
 * and, on capable devices, mounts the WebGL view into the poster box.
 */
export function SequenceSection({ kind, eyebrow, title, steps, labels, monthTemplate, link, hints, id }: Props) {
  return (
    <SequenceShell kind={kind} monthTemplate={monthTemplate} id={id}>
      <div className="container-x w-full grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="h2 mt-4">{title}</h2>
          <ol className="mt-6 lg:mt-8 flex flex-col gap-3 lg:gap-5">
            {steps.map((s, i) => (
              <li key={s.title} className="seq-step grid grid-cols-[2rem_1fr] gap-3" data-step={i} data-active={i === 0}>
                <span className="font-display text-lg text-bronze-deep">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-display text-xl md:text-2xl leading-tight text-graphite">{s.title}</span>
                  <span className="seq-step-text block mt-1 text-muted">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="caption mt-6 seq-hint-scroll">{hints.scroll}</p>
          <p className="caption mt-6 seq-hint-static">{hints.static}</p>
          {link && (
            <Link href={link.href} className="btn btn-secondary mt-6">
              {link.label}
            </Link>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] lg:aspect-[5/4] img-frame" aria-hidden="true" data-sequence-host>
            <Image src={SEQUENCE_POSTERS[kind]} alt="" fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 min-h-[2rem]">
            {labels.map((lb) => (
              <span key={lb.id} className="seq-label placeholder-tag border-solid" data-label-at={lb.at} data-label-until={lb.until} data-on="true">
                {lb.text}
              </span>
            ))}
            {monthTemplate && (
              <span className="seq-label placeholder-tag border-solid" data-month data-on="true">
                {monthTemplate.replace("{n}", "12")}
              </span>
            )}
          </div>
        </div>
      </div>
    </SequenceShell>
  );
}
