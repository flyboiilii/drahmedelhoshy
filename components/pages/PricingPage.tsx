import type { Metadata } from "next";
import { getDict, l, type Lang } from "@/lib/i18n";
import { isPlaceholder, pricing, settings } from "@/lib/content";
import { localize } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { BookCta } from "@/components/sections/BookCta";

const PATH = "/pricing/";

const Tag = ({ value }: { value: string }) => (isPlaceholder(value) ? <span className="placeholder-tag">{value}</span> : <>{value}</>);

export function createPricingPage(lang: Lang): { metadata: Metadata; Page: () => React.JSX.Element } {
  const d = getDict(lang);
  const metadata = buildMetadata({ lang, path: PATH, title: d.meta.pricingTitle, description: d.meta.pricingDescription });

  function Page() {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd(
            [
              { name: d.common.breadcrumbHome, path: "/" },
              { name: d.nav.pricing, path: PATH },
            ],
            lang,
          )}
        />
        <section className="container-x pt-10 md:pt-16 pb-12">
          <SectionHeading level="h1" eyebrow={d.pricing.eyebrow} title={d.pricing.title} lead={d.pricing.lead} />
        </section>

        <section className="container-x pb-16">
          <div className="card p-8 md:p-10 grid gap-6 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <h2 className="h2">{l(pricing.consultation.title, lang)}</h2>
              <p className="mt-4 text-muted max-w-2xl">{l(pricing.consultation.text, lang)}</p>
              <p className="mt-3 caption">
                <span className="placeholder-tag">{pricing.consultation.durationConfirm}</span>
              </p>
            </div>
            <div className="md:col-span-4 md:text-end">
              <span className="font-display text-5xl text-bronze-deep">0</span>
              <span className="block caption">{lang === "ar" ? "جنيه" : "EGP"}</span>
            </div>
          </div>
        </section>

        <section className="section bg-sand">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow={d.pricing.entryTitle} title={d.pricing.entryTitle} />
              <p className="mt-6 text-muted">{d.pricing.note}</p>
            </div>
            <div className="lg:col-span-8">
              <table className="w-full text-start">
                <thead>
                  <tr className="text-start">
                    <th scope="col" className="eyebrow text-start py-3 border-b border-line font-medium">
                      {d.pricing.entryHead.item}
                    </th>
                    <th scope="col" className="eyebrow text-end py-3 border-b border-line font-medium">
                      {d.pricing.entryHead.price}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.entries.map((e) => (
                    <tr key={e.id} className="border-b border-line align-top">
                      <td className="py-5 pe-4">
                        <span className="font-display text-xl">{l(e.label, lang)}</span>
                        <span className="block caption mt-1">{l(e.note, lang)}</span>
                      </td>
                      <td className="py-5 text-end whitespace-nowrap">
                        <Tag value={l(e.price, lang)} />
                      </td>
                    </tr>
                  ))}
                  {lang === "en" && (
                    <tr className="border-b border-line align-top">
                      <td className="py-5 pe-4">
                        <span className="font-display text-xl">{pricing.veneersFrom.label}</span>
                        <span className="block caption mt-1">{pricing.veneersFrom.note}</span>
                      </td>
                      <td className="py-5 text-end whitespace-nowrap">
                        <Tag value={pricing.veneersFrom.price} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-x grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="h3">{d.pricing.includesTitle}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {pricing.includes.map((it, i) => (
                  <li key={i} className="flex gap-3">
                    <Icon name="check" size={18} className="mt-1 flex-none text-bronze-deep" />
                    {l(it, lang)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h3">{d.pricing.paymentTitle}</h2>
              <ul className="mt-6 flex flex-col gap-3 text-graphite">
                <li>{l(pricing.payment.cards, lang)}</li>
                <li>
                  <Tag value={l(pricing.payment.instalments, lang)} />
                </li>
                <li className="text-muted">{l(settings.payment, lang)}</li>
              </ul>
            </div>
          </div>
        </section>

        <BookCta lang={lang} page={localize(lang, PATH)} />
      </>
    );
  }

  return { metadata, Page };
}
