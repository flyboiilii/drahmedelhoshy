import type { Metadata } from "next";
import type { Lang } from "./i18n";
import { SITE_URL, absolute, localize } from "./routes";

type Args = {
  lang: Lang;
  /** Language-neutral path such as "/veneers/" */
  path: string;
  title: string;
  description: string;
  image?: string;
};

/**
 * Metadata for one page: canonical, hreflang (en, ar, x-default to English),
 * Open Graph and Twitter cards with the per-language OG image.
 */
export function buildMetadata({ lang, path, title, description, image }: Args): Metadata {
  const canonical = absolute(lang, path);
  const og = image ?? `/og-${lang}.png`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: absolute("en", path),
        ar: absolute("ar", path),
        "x-default": absolute("en", path),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: lang === "ar" ? "عيادة الهوشي للأسنان" : "El Hoshy Dental Clinic",
      locale: lang === "ar" ? "ar_EG" : "en_GB",
      alternateLocale: lang === "ar" ? "en_GB" : "ar_EG",
      type: "website",
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

export const metadataBase = new URL(SITE_URL);

export function pageUrl(lang: Lang, path: string): string {
  return `${SITE_URL}${localize(lang, path)}`;
}
