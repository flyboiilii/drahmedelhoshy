import type { Metadata, Viewport } from "next";
import "../globals.css";
import { instrumentSans, instrumentSerif, instrumentSerifItalic } from "../fonts";
import { RootShell } from "@/components/layout/RootShell";
import { metadataBase } from "@/lib/seo";
import { getDict } from "@/lib/i18n";

const d = getDict("en");

export const metadata: Metadata = {
  metadataBase,
  title: { default: d.meta.siteTitle, template: "%s" },
  description: d.meta.homeDescription,
  applicationName: "El Hoshy Dental Clinic",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F4F0E9",
  width: "device-width",
  initialScale: 1,
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <RootShell lang="en">{children}</RootShell>
      </body>
    </html>
  );
}
