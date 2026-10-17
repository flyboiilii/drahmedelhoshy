import Image from "next/image";
import { getDict, l, type Lang } from "@/lib/i18n";
import { googleMapsLink, services, settings } from "@/lib/content";
import { whatsAppUrl } from "@/lib/whatsapp";
import { LeadForm } from "@/components/forms/LeadForm";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { MapEmbed } from "./MapEmbed";

type Props = { lang: Lang; page: string; withMap?: boolean; level?: "h1" | "h2" };

/** The #book block: clinic details on one side, the lead form on the other. */
export function BookSection({ lang, page, withMap = false, level = "h2" }: Props) {
  const d = getDict(lang);
  const Heading = level;
  const treatments = services.map((s) => ({ value: s.slug, label: l(s.shortTitle, lang) }));

  return (
    <section id="book" className="section bg-sand scroll-mt-4">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow>{d.book.eyebrow}</Eyebrow>
          <Heading className={level === "h1" ? "h1 mt-4" : "h2 mt-4"}>{d.book.title}</Heading>
          <p className="lead mt-5">{d.book.lead}</p>

          <dl className="mt-10 grid gap-6 text-graphite">
            <div>
              <dt className="eyebrow mb-1 flex items-center gap-3">
                <Icon name="pin" size={18} className="flex-none text-bronze-deep" /> {d.book.address}
              </dt>
              <dd className="ps-8">{l(settings.address, lang)}</dd>
              <dd className="ps-8 mt-1">
                <a href={googleMapsLink()} target="_blank" rel="noopener noreferrer" className="text-link text-sm">
                  {d.book.directions}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 flex items-center gap-3">
                <Icon name="clock" size={18} className="flex-none text-bronze-deep" /> {d.book.hours}
              </dt>
              <dd className="ps-8">{d.book.hoursValue}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-1 flex items-center gap-3">
                <Icon name="phone" size={18} className="flex-none text-bronze-deep" /> {d.book.phone}
              </dt>
              <dd className="ps-8">
                  <a href={`tel:${settings.phones.primaryE164}`} className="text-link" data-event="call" dir="ltr">
                    {settings.phones.primary}
                  </a>
                </dd>
                <dd className="caption mt-1 ps-8">
                  {d.book.otherPhones}{" "}
                  {settings.phones.others.map((p, i) => (
                    <span key={p}>
                      <a href={`tel:${settings.phones.othersE164[i]}`} className="text-link" data-event="call" dir="ltr">
                        {p}
                      </a>
                      {i < settings.phones.others.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={whatsAppUrl(lang, { page })} variant="dark" event="whatsapp">
              <Icon name="message" size={16} /> {d.common.whatsapp}
            </Button>
            <Button href={`tel:${settings.phones.primaryE164}`} variant="secondary" event="call">
              <Icon name="phone" size={16} /> {d.common.call}
            </Button>
          </div>

          {withMap && (
            <div className="mt-10">
              <p className="eyebrow mb-3">{d.book.photosTitle}</p>
              <ul className="grid grid-cols-4 gap-2 mb-6">
                {["clinic-exterior", "reception", "treatment-room", "sterilisation"].map((name, i) => (
                  <li key={name} className="relative aspect-[3/2] img-frame" data-reveal>
                    <Image src={`/placeholders/${name}.jpg`} alt={d.book.photos[i]} fill sizes="(min-width: 1024px) 10vw, 22vw" className="object-cover" />
                  </li>
                ))}
              </ul>
              <MapEmbed title={d.book.mapTitle} />
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <LeadForm lang={lang} page={page} t={d.form} treatments={treatments} />
        </div>
      </div>
    </section>
  );
}
