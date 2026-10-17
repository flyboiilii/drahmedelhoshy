import type { Metadata } from "next";
import { getDict, type Lang } from "@/lib/i18n";
import { settings } from "@/lib/content";
import { localize } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { videoConsultUrl } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookCta } from "@/components/sections/BookCta";

const PATH = "/international/";

export function createInternationalPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.internationalTitle, description: d.meta.internationalDescription });

  function Page() {
    const page = localize(lang, PATH);
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: d.common.breadcrumbHome, path: "/" },
              { name: d.nav.abroad, path: PATH },
            ],
            lang,
          )}
        />
        <section className="container-x pt-10 md:pt-16 pb-12 md:pb-20">
          <div className="max-w-4xl">
            <Eyebrow className="rise">{d.abroad.eyebrow}</Eyebrow>
            <h1 className="h1 mt-5 rise" style={{ "--i": 1 } as React.CSSProperties}>
              {d.abroad.title}
            </h1>
            <p className="lead mt-8 max-w-3xl rise" style={{ "--i": 2 } as React.CSSProperties}>
              {d.abroad.pageLead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 rise" style={{ "--i": 3 } as React.CSSProperties}>
              <Button href={videoConsultUrl(lang)} variant="dark" event="video_consult">
                <Icon name="video" size={16} /> {d.abroad.video}
              </Button>
              <Button href="#book" variant="secondary" event="book">
                {d.common.book}
              </Button>
            </div>
          </div>
        </section>

        <section className="section bg-sand">
          <div className="container-x">
            <SectionHeading eyebrow={d.abroad.stepsTitle} title={d.abroad.stepsTitle} />
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {d.abroad.steps.map((s, i) => (
                <li key={s.title} className="card p-7">
                  <p className="font-display text-4xl text-bronze-deep">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-display text-2xl mt-4 leading-tight">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="h3">{d.abroad.daysTitle}</h2>
              <table className="mt-6 w-full">
                <thead>
                  <tr>
                    <th scope="col" className="eyebrow text-start py-3 border-b border-line font-medium">
                      {d.abroad.daysHead.treatment}
                    </th>
                    <th scope="col" className="eyebrow text-end py-3 border-b border-line font-medium">
                      {d.abroad.daysHead.days}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {d.abroad.days.map((row) => (
                    <tr key={row.treatment} className="border-b border-line">
                      <td className="py-4 font-display text-xl">{row.treatment}</td>
                      <td className="py-4 text-end text-muted">{row.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="lg:col-span-5 flex flex-col gap-10">
              <div>
                <h2 className="h3">{d.abroad.languagesTitle}</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {settings.languages[lang].map((x) => (
                    <li key={x} className="pill cursor-default">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="h3">{d.abroad.aftercareTitle}</h2>
                <p className="mt-4 text-muted">{d.abroad.aftercareText}</p>
              </div>
              <div>
                <h2 className="h3">{d.abroad.hotelsTitle}</h2>
                <p className="mt-4 text-muted">{d.abroad.hotelsText}</p>
              </div>
            </div>
          </div>
        </section>

        <BookCta lang={lang} page={page} title={d.abroad.ctaTitle} />
      </>
    );
  }

  return { metadata, Page };
}
