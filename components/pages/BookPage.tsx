import type { Metadata } from "next";
import { getDict, type Lang } from "@/lib/i18n";
import { localize } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, clinicJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { BookSection } from "@/components/sections/BookSection";

const PATH = "/book/";

export function createBookPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.bookTitle, description: d.meta.bookDescription });

  function Page() {
    return (
      <>
        <JsonLd
          data={[
            clinicJsonLd(lang),
            breadcrumbJsonLd(
              [
                { name: d.common.breadcrumbHome, path: "/" },
                { name: d.nav.book, path: PATH },
              ],
              lang,
            ),
          ]}
        />
        <BookSection lang={lang} page={localize(lang, PATH)} withMap level="h1" />
      </>
    );
  }

  return { metadata, Page };
}
