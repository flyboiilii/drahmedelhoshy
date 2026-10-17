import { localizedString, type SanityType } from "./types";

/** Mirrors one entry of content/cases.json. Images become Sanity image assets. */
export const caseStudy: SanityType = {
  name: "caseStudy",
  title: "Case (before and after)",
  type: "document",
  fields: [
    { name: "slug", title: "Slug", type: "slug", validation: "required" },
    { name: "caseNumber", title: "Case number", type: "string" },
    { name: "treatment", title: "Treatment", type: "reference", to: [{ type: "service" }] },
    localizedString("ageBand", "Age band"),
    localizedString("ageLabel", "Age label"),
    { name: "gender", title: "Gender", type: "string" },
    { name: "teethCount", title: "Teeth treated", type: "number" },
    { name: "material", title: "Material", type: "string" },
    { name: "visits", title: "Visits", type: "number" },
    { name: "monthsPostOp", title: "Months after treatment", type: "number" },
    { name: "before", title: "Before image", type: "image", options: { hotspot: true } },
    { name: "after", title: "After image", type: "image", options: { hotspot: true } },
    {
      name: "story",
      title: "Story (three short paragraphs)",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "array", of: [{ type: "text" }] },
        { name: "ar", title: "Arabic", type: "array", of: [{ type: "text" }] },
      ],
    },
    { name: "consent", title: "Written consent on file", type: "boolean", validation: "required, must be true", initialValue: false },
    { name: "featured", title: "Featured on home", type: "boolean", initialValue: false },
    { name: "placeholder", title: "Placeholder data", type: "boolean", initialValue: false },
  ],
  preview: { select: { title: "caseNumber", media: "after" } },
};
