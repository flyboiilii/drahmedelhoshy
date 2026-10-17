import en from "@/content/i18n/en.json";
import ar from "@/content/i18n/ar.json";

export type Lang = "en" | "ar";
export type Dict = typeof en;

// The annotation (not a cast) makes TypeScript fail the build if the Arabic
// dictionary is missing any key that exists in English.
const arDict: Dict = ar;

export const dictionaries: Record<Lang, Dict> = { en, ar: arDict };

export function getDict(lang: Lang): Dict {
  return dictionaries[lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "ar" : "en";
}

export type Localized = { en: string; ar: string };

/** Pick the string for a language from a { en, ar } pair. */
export function l(value: Localized, lang: Lang): string {
  return value[lang];
}

/** Replace {name} tokens in a UI string. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

export const dirFor = (lang: Lang): "ltr" | "rtl" => (lang === "ar" ? "rtl" : "ltr");
export const htmlLang = (lang: Lang): string => (lang === "ar" ? "ar-EG" : "en");
