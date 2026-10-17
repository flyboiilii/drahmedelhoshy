import { dictionaries, fmt, type Lang } from "./i18n";

export const WHATSAPP_NUMBER = "201028294777";
export const TEL_PRIMARY = "+201028294777";

export function waUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

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

export type LeadFields = {
  name: string;
  phone: string;
  treatment: string;
  visitType: string;
  day: string;
  page: string;
};

/** The message the lead form composes. Exported so it can be unit-checked without a browser. */
export function leadMessage(lang: Lang, f: LeadFields): string {
  const d = dictionaries[lang].form;
  const lines = [
    d.messageIntro,
    `${d.messageName}: ${f.name}`,
    `${d.messagePhone}: ${f.phone}`,
    `${d.messageTreatment}: ${f.treatment}`,
    `${d.messageVisitType}: ${f.visitType}`,
    `${d.messageDay}: ${f.day}`,
    `${d.messageOutro} (${f.page}).`,
  ];
  return lines.join("\n");
}

export function leadUrl(lang: Lang, f: LeadFields): string {
  return waUrl(leadMessage(lang, f));
}
