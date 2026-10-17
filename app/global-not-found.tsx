import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { instrumentSans, instrumentSerif, instrumentSerifItalic, notoNaskh } from "./fonts";
import { getDict } from "@/lib/i18n";

const en = getDict("en");
const ar = getDict("ar");

export const metadata: Metadata = {
  title: "404 | El Hoshy Dental Clinic",
  robots: { index: false, follow: false },
};

/**
 * Global 404 for paths outside both language trees (Next 15.4+ convention,
 * enabled with experimental.globalNotFound). Bilingual, since the language is
 * unknown for an unmatched URL.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${instrumentSerifItalic.variable} ${instrumentSans.variable} ${notoNaskh.variable}`}>
      <body>
        <main className="container-x py-16 md:py-24 grid gap-16 md:grid-cols-2">
          <section>
            <p className="eyebrow">404</p>
            <h1 className="h2 mt-5">{en.common.notFoundTitle}</h1>
            <p className="lead mt-5">{en.common.notFoundText}</p>
            <p className="mt-6">
              <Link href="/" className="btn btn-dark">
                {en.common.notFoundHome}
              </Link>
            </p>
          </section>
          <section dir="rtl" lang="ar-EG" style={{ fontFamily: "var(--ff-arabic)" }}>
            <p className="eyebrow" style={{ letterSpacing: "0.04em", textTransform: "none" }}>
              404
            </p>
            <h2 className="h2 mt-5" style={{ letterSpacing: 0, lineHeight: 1.25 }}>
              {ar.common.notFoundTitle}
            </h2>
            <p className="lead mt-5">{ar.common.notFoundText}</p>
            <p className="mt-6">
              <Link href="/ar/" className="btn btn-secondary" style={{ textTransform: "none", letterSpacing: "0.02em" }}>
                {ar.common.notFoundHome}
              </Link>
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
