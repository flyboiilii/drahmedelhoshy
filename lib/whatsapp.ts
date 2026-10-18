import { dictionaries, fmt, type Lang } from "./i18n";
import { waUrl, WHATSAPP_NUMBER } from "./lead";

// Server-side helpers: these read the dictionaries, so client components must not import this
// module (the lead form uses lib/lead.ts, which carries no dictionary).
export { WHATSAPP_NUMBER, waUrl };
export const TEL_PRIMARY = "+201028294777";

/** Page-aware prefilled message in the current language. */
export function whatsAppMessage(lang: Lang, opts: { service?: string; page: string }): string {
  const d = dictionaries[lang].whatsapp;
  return fmt(d.template, { service: opts.service ?? d.generalService, page: opts.page });
}

export function whatsAppUrl(lang: Lang, opts: { service?: string; page: string }): string {
  return waUrl(whatsAppMessage(lang, opts));
}

export function videoConsultUrl(lang: Lang): string {
  return waUrl(dictionaries[lang].whatsapp.videoTemplate);
}
