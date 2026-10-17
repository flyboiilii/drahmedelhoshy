import { getDict, type Lang } from "@/lib/i18n";
import { localize } from "@/lib/routes";
import { whatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Props = { lang: Lang; page: string; service?: string; title?: string; text?: string };

/**
 * Compact booking block used at the foot of inner pages. Carries id="book" so
 * the header button (#book) lands here on every page.
 */
export function BookCta({ lang, page, service, title, text }: Props) {
  const d = getDict(lang);
  return (
    <section id="book" className="section bg-sand scroll-mt-4">
      <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow>{d.book.eyebrow}</Eyebrow>
          <h2 className="h2 mt-4">{title ?? d.service.bookTitle}</h2>
          <p className="lead mt-4 max-w-2xl">{text ?? d.service.bookText}</p>
        </div>
        <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
          <Button href={localize(lang, "/book/")} variant="primary" event="book">
            {d.common.book}
          </Button>
          <Button href={whatsAppUrl(lang, { service, page })} variant="secondary" event="whatsapp">
            {d.common.whatsapp}
          </Button>
        </div>
      </div>
    </section>
  );
}
