import { getDict, type Lang } from "@/lib/i18n";
import { localize } from "@/lib/routes";
import { reviews } from "@/lib/content";
import { videoConsultUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";

export function AbroadBlock({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const salma = reviews.find((r) => r.id === "salma-r")!;
  return (
    <section className="section section-dark on-dark">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>{d.abroad.eyebrow}</Eyebrow>
          <h2 className="h2 mt-4">{d.abroad.title}</h2>
          <p className="lead mt-6 max-w-2xl">{d.abroad.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={videoConsultUrl(lang)} variant="dark" event="video_consult">
              <Icon name="video" size={16} /> {d.abroad.video}
            </Button>
            <Button href={localize(lang, "/international/")} variant="secondary">
              {d.abroad.how}
            </Button>
          </div>
        </div>
        <figure className="lg:col-span-5 lg:ps-10 lg:border-s lg:border-line-dark">
          <blockquote className="font-display text-2xl md:text-3xl leading-snug">
            <span aria-hidden="true">“</span>
            {salma.text[lang]}
            <span aria-hidden="true">”</span>
          </blockquote>
          <figcaption className="mt-5 caption">{d.abroad.quoteNote}</figcaption>
        </figure>
      </div>
    </section>
  );
}
