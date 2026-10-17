import { localizedString, type SanityType } from "./types";

/** Mirrors one entry of content/concerns.json */
export const concern: SanityType = {
  name: "concern",
  title: "Common concern (symptom page)",
  type: "document",
  fields: [
    { name: "slug", title: "Slug", type: "slug", validation: "required" },
    localizedString("title", "Title in patient language"),
    localizedString("seoTitle", "SEO title"),
    localizedString("description", "Meta description"),
    {
      name: "paragraphs",
      title: "Two paragraphs",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "array", of: [{ type: "text" }] },
        { name: "ar", title: "Arabic", type: "array", of: [{ type: "text" }] },
      ],
    },
    { name: "service", title: "Treatment that solves it", type: "reference", to: [{ type: "service" }] },
    { name: "cases", title: "Two related cases", type: "array", of: [{ type: "reference", to: [{ type: "caseStudy" }] }] },
  ],
  preview: { select: { title: "title.en" } },
};
