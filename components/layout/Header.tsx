import Link from "next/link";
import { getDict, l, otherLang, type Lang } from "@/lib/i18n";
import { localize, servicePath } from "@/lib/routes";
import { services } from "@/lib/content";
import { LangSwitch } from "./LangSwitch";
import { MobileMenu } from "./MobileMenu";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * Static header (not sticky) so the terracotta button never shares a viewport
 * with another terracotta action. The mobile sticky bar carries the CTA instead.
 */
export function Header({ lang }: { lang: Lang }) {
  const d = getDict(lang);
  const primary = [
    { href: localize(lang, "/cases/"), label: d.nav.cases },
    { href: localize(lang, "/#treatments"), label: d.nav.treatments },
    { href: localize(lang, "/prof-ahmed-el-hoshy/"), label: d.nav.professor },
    { href: localize(lang, "/international/"), label: d.nav.abroad },
  ];
  const treatments = services.map((s) => ({ href: localize(lang, servicePath(s.slug)), label: l(s.shortTitle, lang) }));
  const secondary = [
    { href: localize(lang, "/reviews/"), label: d.nav.reviews },
    { href: localize(lang, "/pricing/"), label: d.nav.pricing },
    { href: localize(lang, "/faq/"), label: d.nav.faq },
    { href: localize(lang, "/book/"), label: d.nav.book },
  ];

  return (
    <header className="relative z-40 bg-alabaster">
      <div className="container-x h-[72px] flex items-center justify-between gap-6">
        <Link href={localize(lang, "/")} className="flex items-center gap-3 text-graphite" title={l({ en: "El Hoshy Dental, home", ar: "الحوشى للأسنان، الرئيسية" }, lang)}>
          <LogoMark size={30} className="text-bronze-deep" />
          <span className="wordmark">
            El Hoshy <span className="text-bronze-deep">Dental</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label={d.nav.menu}>
          {primary.map((it) => (
            <Link key={it.href} href={it.href} className="text-sm font-medium tracking-wide text-muted hover:text-graphite transition-colors">
              {it.label}
            </Link>
          ))}
          <LangSwitch label={d.nav.langToggle} ariaLabel={d.nav.langToggleAria} className={lang === "en" ? "font-[family-name:var(--ff-arabic)]" : ""} />
          <Link href="#book" className="btn btn-primary btn-sm" data-event="book">
            {d.nav.cta}
          </Link>
        </nav>

        <MobileMenu
          menuLabel={d.nav.menu}
          closeLabel={d.nav.close}
          primary={primary}
          treatments={treatments}
          treatmentsLabel={d.nav.treatments}
          secondary={secondary}
          cta={{ href: "#book", label: d.nav.cta }}
          lang={{ href: localize(otherLang(lang), "/"), label: d.footer.language, ariaLabel: d.nav.langToggleAria }}
        />
      </div>
    </header>
  );
}
