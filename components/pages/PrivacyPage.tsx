import type { Metadata } from "next";
import { getDict, type Lang } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PATH = "/privacy/";

export function createPrivacyPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.privacyTitle, description: d.meta.privacyDescription });

  function Page() {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: d.common.breadcrumbHome, path: "/" },
              { name: d.nav.privacy, path: PATH },
            ],
            lang,
          )}
        />
        <section className="container-x pt-10 md:pt-16 pb-20">
          <SectionHeading level="h1" eyebrow={d.privacy.eyebrow} title={d.privacy.title} />
          <div className="mt-12 max-w-3xl flex flex-col gap-10">
            {d.privacy.sections.map((s) => (
              <section key={s.title}>
                <h2 className="h3">{s.title}</h2>
                <p className="mt-3 text-muted">{s.text}</p>
              </section>
            ))}
          </div>
        </section>
      </>
    );
  }

  return { metadata, Page };
}
