import { localizedString, localizedStringArray, localizedText, type SanityType } from "./types";

/** Mirrors one entry of content/services.json */
export const service: SanityType = {
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    { name: "slug", title: "Slug", type: "slug", validation: "required" },
    { name: "order", title: "Order", type: "number" },
    localizedString("title", "Title"),
    localizedString("shortTitle", "Short title"),
    localizedString("seoTitle", "SEO title (under 60 characters)"),
    localizedString("description", "Meta description (under 155 characters)"),
    localizedText("fearIntro", "Fear-first intro"),
    localizedString("oneLine", "One line"),
    localizedString("durationLabel", "Duration label"),
    localizedString("visits", "Visits"),
    localizedString("days", "Days"),
    {
      name: "steps",
      title: "How it works",
      type: "array",
      of: [{ type: "object", fields: [localizedString("title", "Title"), localizedText("text", "Text"), localizedString("when", "When")] }],
    },
    localizedStringArray("whoFor", "Who it is for"),
    localizedStringArray("whoNotFor", "Who it is not for"),
    {
      name: "materials",
      title: "Materials and brands",
      type: "array",
      of: [{ type: "object", fields: [localizedString("label", "Label"), { name: "value", title: "Value", type: "string" }] }],
    },
    localizedText("costParagraph", "Cost paragraph"),
    { name: "model", title: "3D model", type: "string", options: { list: ["veneer", "implant", "aligner", "fullmouth", "none"] } },
    { name: "faqs", title: "FAQs", type: "array", of: [{ type: "reference", to: [{ type: "faq" }] }] },
  ],
  preview: { select: { title: "title.en", subtitle: "slug.current" } },
};
