import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { buildMetadata } from "@/lib/seo";
import { getDict } from "@/lib/i18n";

const d = getDict("en");
export const metadata: Metadata = buildMetadata({ lang: "en", path: "/", title: d.meta.homeTitle, description: d.meta.homeDescription });

export default function Page() {
  return <HomePage lang="en" />;
}
