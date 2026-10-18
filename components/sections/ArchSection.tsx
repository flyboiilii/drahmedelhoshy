import { getDict, type Lang } from "@/lib/i18n";
import { models } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArchViewerSlot } from "@/components/three/ArchViewerSlot";

/** The scripted 3D arch, before and after, in its own section. Rendered only when arch.glb exists. */
export function ArchSection({ lang }: { lang: Lang }) {
  if (!models.arch) return null;
  const d = getDict(lang);
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow={d.archSection.eyebrow} title={d.archSection.title} />
        <div className="mt-10">
          <ArchViewerSlot lang={lang} labels={d.compare} />
          <p className="caption mt-3">{d.archSection.note}</p>
        </div>
      </div>
    </section>
  );
}
