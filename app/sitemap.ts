import type { MetadataRoute } from "next";
import { cases, concerns, services } from "@/lib/content";
import { absolute, casePath, concernPath, servicePath, STATIC_PATHS } from "@/lib/routes";

export const dynamic = "force-static";

/** Both language trees, with hreflang alternates and x-default on English. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    ...STATIC_PATHS.map((p) => ({ path: p, priority: p === "/" ? 1 : 0.7, changeFrequency: "monthly" as const })),
    ...services.map((s) => ({ path: servicePath(s.slug), priority: 0.9, changeFrequency: "monthly" as const })),
    ...cases.map((c) => ({ path: casePath(c.slug), priority: 0.6, changeFrequency: "monthly" as const })),
    ...concerns.map((c) => ({ path: concernPath(c.slug), priority: 0.6, changeFrequency: "monthly" as const })),
  ];
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const { path, priority, changeFrequency } of paths) {
    const languages = { en: absolute("en", path), ar: absolute("ar", path), "x-default": absolute("en", path) };
    entries.push({ url: absolute("en", path), lastModified, changeFrequency, priority, alternates: { languages } });
    entries.push({ url: absolute("ar", path), lastModified, changeFrequency, priority, alternates: { languages } });
  }
  return entries;
}
