import type { Lang } from "./i18n";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://elhoshydentalclinic.com").replace(/\/$/, "");

export const SERVICE_SLUGS = [
  "veneers",
  "dental-implants",
  "clear-aligners",
  "full-mouth-restoration",
  "whitening-bonding",
  "general-dentistry",
] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const CONCERN_SLUGS = [
  "yellow-teeth",
  "gaps",
  "chipped-tooth",
  "old-crowns",
  "missing-teeth",
  "denture-alternative",
] as const;

export const STATIC_PATHS = [
  "/",
  "/prof-ahmed-el-hoshy/",
  "/cases/",
  "/reviews/",
  "/pricing/",
  "/faq/",
  "/international/",
  "/book/",
  "/privacy/",
] as const;

/** Prefix a language-neutral path such as "/veneers/" for the given tree. */
export function localize(lang: Lang, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (lang === "en") return p;
  return p === "/" ? "/ar/" : `/ar${p}`;
}

/** Absolute URL for a language-neutral path in the given tree. */
export function absolute(lang: Lang, path: string): string {
  return `${SITE_URL}${localize(lang, path)}`;
}

/** Given a real pathname, return the language-neutral path and the language it belongs to. */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    const rest = pathname.slice(3);
    return { lang: "ar", path: rest === "" ? "/" : rest };
  }
  return { lang: "en", path: pathname || "/" };
}

/** The same page in the other language tree. */
export function alternatePath(pathname: string): string {
  const { lang, path } = splitPath(pathname);
  return localize(lang === "en" ? "ar" : "en", path);
}

export const servicePath = (slug: string) => `/${slug}/`;
export const casePath = (slug: string) => `/cases/${slug}/`;
export const concernPath = (slug: string) => `/concerns/${slug}/`;
