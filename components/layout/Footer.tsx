import Link from "next/link";
import { getDict, l, otherLang, type Lang } from "@/lib/i18n";
import { concernPath, localize, servicePath } from "@/lib/routes";
import { concerns, services, settings } from "@/lib/content";
import { Icon } from "@/components/ui/Icon";

export function Footer({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  return (
    <footer className="section-dark on-dark mt-16" role="contentinfo">
      <div className="container-x py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="wordmark text-alabaster">
              El Hoshy <span className="text-brass">Dental</span>
            </p>
            <p className="mt-5 max-w-sm text-limestone">{l(settings.address, lang)}</p>
            <p className="mt-4 text-limestone">
              <span className="eyebrow block mb-1">{d.footer.hoursLabel}</span>
              {l(settings.hours.days, lang)}, {settings.hours.open} to {settings.hours.close}. {l(settings.hours.closed, lang)}
            </p>
            <p className="mt-4">
              <a href={`tel:${settings.phones.primaryE164}`} className="text-link" data-event="call">
                {settings.phones.primary}
              </a>
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">{d.footer.treatments}</p>
            <ul className="flex flex-col gap-2 text-limestone">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={localize(lang, servicePath(s.slug))} className="hover:text-alabaster transition-colors">
                    {l(s.shortTitle, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-4">{d.footer.concerns}</p>
            <ul className="flex flex-col gap-2 text-limestone text-sm">
              {concerns.map((c) => (
                <li key={c.slug}>
                  <Link href={localize(lang, concernPath(c.slug))} className="hover:text-alabaster transition-colors">
                    {l(c.title, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow mb-4">{d.footer.links}</p>
            <ul className="flex flex-col gap-2 text-limestone">
              <li>
                <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-alabaster transition-colors inline-flex items-center gap-1">
                  Instagram <Icon name="arrow-up-right" size={14} />
                </a>
              </li>
              <li>
                <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-alabaster transition-colors inline-flex items-center gap-1">
                  Facebook <Icon name="arrow-up-right" size={14} />
                </a>
              </li>
              <li>
                <Link href={localize(lang, "/reviews/")} className="hover:text-alabaster transition-colors">
                  {d.nav.reviews}
                </Link>
              </li>
              <li>
                <Link href={localize(lang, "/pricing/")} className="hover:text-alabaster transition-colors">
                  {d.nav.pricing}
                </Link>
              </li>
              <li>
                <Link href={localize(lang, "/faq/")} className="hover:text-alabaster transition-colors">
                  {d.nav.faq}
                </Link>
              </li>
              <li>
                <Link href={localize(lang, "/privacy/")} className="hover:text-alabaster transition-colors">
                  {d.nav.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={localize(otherLang(lang), "/")}
                  hrefLang={otherLang(lang)}
                  lang={otherLang(lang)}
                  aria-label={`${d.footer.language}. ${d.footer.languageAria}`}
                  className={`hover:text-alabaster transition-colors ${lang === "en" ? "font-[family-name:var(--ff-arabic)]" : ""}`}
                >
                  {d.footer.language}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-14 pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm text-limestone">
          <p>{d.footer.consent}</p>
          <p className="text-xs opacity-80">{d.footer.variants}</p>
        </div>
        <p className="mt-3 text-xs text-limestone opacity-70">
          {d.footer.licence}
        </p>
      </div>
    </footer>
  );
}
