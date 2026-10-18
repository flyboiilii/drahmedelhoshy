/**
 * Lead form helpers that are safe to ship to the browser: no dictionary imports.
 * The form receives its strings as props from the server, and passes them in here.
 */
export const WHATSAPP_NUMBER = "201028294777";

export function waUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type LeadFields = {
  name: string;
  phone: string;
  treatment: string;
  visitType: string;
  day: string;
  page: string;
};

export type LeadStrings = {
  messageIntro: string;
  messageName: string;
  messagePhone: string;
  messageTreatment: string;
  messageVisitType: string;
  messageDay: string;
  messageOutro: string;
};

/** The message the lead form composes. Exported so it can be unit-checked without a browser. */
export function leadMessage(t: LeadStrings, f: LeadFields): string {
  const lines = [
    t.messageIntro,
    `${t.messageName}: ${f.name}`,
    `${t.messagePhone}: ${f.phone}`,
    `${t.messageTreatment}: ${f.treatment}`,
    `${t.messageVisitType}: ${f.visitType}`,
    `${t.messageDay}: ${f.day}`,
    `${t.messageOutro} (${f.page}).`,
  ];
  return lines.join("\n");
}

export function leadUrl(t: LeadStrings, f: LeadFields): string {
  return waUrl(leadMessage(t, f));
}
