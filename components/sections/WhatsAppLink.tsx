import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { whatsAppUrl } from "@/lib/whatsapp";

type Props = {
  lang: Lang;
  /** Human label of the service, in the current language. Omit for a general enquiry. */
  service?: string;
  /** Page path, e.g. "/veneers/" */
  page: string;
  className?: string;
  children: ReactNode;
  event?: "whatsapp" | "video_consult";
};

/** wa.me link with a page-aware prefilled message in the current language. */
export function WhatsAppLink({ lang, service, page, className = "", children, event = "whatsapp" }: Props) {
  return (
    <a href={whatsAppUrl(lang, { service, page })} target="_blank" rel="noopener noreferrer" className={className} data-event={event}>
      {children}
    </a>
  );
}
