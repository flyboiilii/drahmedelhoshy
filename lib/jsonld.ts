import { settings, awards, googleMapsLink, type Service, type Faq, type Review } from "./content";
import { l, type Lang } from "./i18n";
import { absolute, SITE_URL } from "./routes";

type JsonLd = Record<string, unknown>;

const DAY_MAP: Record<string, string> = {
  Monday: "https://schema.org/Monday",
  Tuesday: "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday: "https://schema.org/Thursday",
  Friday: "https://schema.org/Friday",
  Saturday: "https://schema.org/Saturday",
  Sunday: "https://schema.org/Sunday",
};

function sameAs(): string[] {
  const links = [settings.socials.instagram, settings.socials.facebook, settings.socials.linktree];
  if (!settings.googleMapsUrl.startsWith("[")) links.push(settings.googleMapsUrl);
  return links;
}

function postalAddress(lang: Lang): JsonLd {
  return {
    "@type": "PostalAddress",
    streetAddress: settings.addressParts.street,
    addressLocality: settings.addressParts.locality,
    addressRegion: settings.addressParts.region,
    postalCode: settings.addressParts.postalCode,
    addressCountry: settings.addressParts.country,
    description: l(settings.address, lang),
  };
}

/** Dentist + MedicalClinic for the home and book pages. */
export function clinicJsonLd(lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalClinic"],
    "@id": `${SITE_URL}/#clinic`,
    name: l(settings.name, lang),
    alternateName: [l(settings.name, lang === "en" ? "ar" : "en"), ...settings.nameVariants],
    url: absolute(lang, "/"),
    image: `${SITE_URL}/og-${lang}.png`,
    telephone: settings.phones.primaryE164,
    address: postalAddress(lang),
    geo: { "@type": "GeoCoordinates", latitude: settings.coordinates.lat, longitude: settings.coordinates.lng },
    hasMap: googleMapsLink(),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: settings.hours.schemaDays.map((d) => DAY_MAP[d]),
        opens: settings.hours.open,
        closes: settings.hours.close,
      },
    ],
    sameAs: sameAs(),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.googleRating,
      reviewCount: settings.googleReviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    availableLanguage: settings.languages.en,
    medicalSpecialty: "Dentistry",
    paymentAccepted: "Cash, Credit Card",
    founder: { "@id": `${SITE_URL}/#physician` },
  };
}

/** Physician for the doctor page. */
export function physicianJsonLd(lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${SITE_URL}/#physician`,
    name: l(settings.doctor, lang),
    alternateName: [l(settings.doctor, lang === "en" ? "ar" : "en"), "Ahmed Zohier El Hoshy"],
    url: absolute(lang, "/prof-ahmed-el-hoshy/"),
    image: `${SITE_URL}/placeholders/professor-portrait.jpg`,
    medicalSpecialty: "Dentistry",
    jobTitle: lang === "ar" ? "أستاذ طب الأسنان الترميمي" : "Professor of Restorative Dentistry",
    alumniOf: { "@type": "CollegeOrUniversity", name: "Cairo University" },
    affiliation: { "@type": "CollegeOrUniversity", name: "Future University in Egypt" },
    award: awards.map((a) => `${l(a.title, lang)} (${l(a.issuer, lang)})`),
    knowsLanguage: settings.languages.en,
    worksFor: { "@id": `${SITE_URL}/#clinic` },
    sameAs: sameAs(),
  };
}

/** MedicalProcedure for a service page. */
export function procedureJsonLd(service: Service, lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: l(service.title, lang),
    description: l(service.description, lang),
    url: absolute(lang, `/${service.slug}/`),
    bodyLocation: lang === "ar" ? "الأسنان" : "Teeth",
    howPerformed: service.steps.map((s, i) => `${i + 1}. ${l(s.title, lang)}: ${l(s.text, lang)}`).join(" "),
    procedureType: "https://schema.org/NoninvasiveProcedure",
    provider: { "@id": `${SITE_URL}/#clinic` },
  };
}

/** FAQPage for a list of questions. */
export function faqJsonLd(items: Faq[], lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: l(f.q, lang),
      acceptedAnswer: { "@type": "Answer", text: l(f.a, lang) },
    })),
  };
}

/** BreadcrumbList. Items are [{ name, path }] with language-neutral paths. */
export function breadcrumbJsonLd(items: { name: string; path: string }[], lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(lang, it.path),
    })),
  };
}

/**
 * Review schema helper. Built but not emitted by default: the only real review
 * on the site is a paraphrase, and review markup should carry verbatim text.
 */
export function reviewJsonLd(review: Review, lang: Lang): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": `${SITE_URL}/#clinic` },
    author: { "@type": "Person", name: review.author },
    reviewBody: l(review.text, lang),
    publisher: { "@type": "Organization", name: "Google" },
  };
}
