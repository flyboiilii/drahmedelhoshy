import { Suspense, type ReactNode } from "react";
import { getDict, type Lang } from "@/lib/i18n";
import { localize } from "@/lib/routes";
import { settings } from "@/lib/content";
import { whatsAppUrl } from "@/lib/whatsapp";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyBar } from "./StickyBar";
import { ClientEffects } from "./ClientEffects";
import { Scene } from "@/components/three/Scene";

/** Shared body for both root layouts. */
export function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const d = getDict(lang);
  const beacon = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  return (
    <>
      <a href="#main" className="skip-link">
        {d.common.skip}
      </a>
      <Header lang={lang} />
      <main id="main" className="body-pad-sticky">
        {children}
      </main>
      <Suspense>
        <Footer lang={lang} />
      </Suspense>
      <StickyBar
        whatsappHref={whatsAppUrl(lang, { page: lang === "ar" ? "/ar/" : "/" })}
        telHref={`tel:${settings.phones.primaryE164}`}
        casesHref={localize(lang, "/cases/")}
        labels={d.sticky}
      />
      <Scene />
      <ClientEffects />
      {beacon && (
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: beacon })}
        />
      )}
    </>
  );
}
