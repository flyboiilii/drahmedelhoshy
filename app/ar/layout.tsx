import type { Metadata, Viewport } from "next";
import "../globals.css";
import { instrumentSans, instrumentSerif, instrumentSerifItalic, notoNaskh } from "../fonts";
import { RootShell } from "@/components/layout/RootShell";
import { metadataBase } from "@/lib/seo";
import { getDict } from "@/lib/i18n";

const d = getDict("ar");

export const metadata: Metadata = {
  metadataBase,
  title: { default: d.meta.siteTitle, template: "%s" },
  description: d.meta.homeDescription,
  applicationName: "عيادة الحوشى للأسنان",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F4F0E9",
  width: "device-width",
  initialScale: 1,
};

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar-EG" dir="rtl" className={`${notoNaskh.variable} ${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <RootShell lang="ar">{children}</RootShell>
      </body>
    </html>
  );
}
