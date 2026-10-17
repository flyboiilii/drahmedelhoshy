import { localizedString, localizedText, type SanityType } from "./types";

/** Mirrors one entry of content/faqs.json */
export const faq: SanityType = {
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    { name: "service", title: "Service", type: "reference", to: [{ type: "service" }] },
    localizedString("q", "Question"),
    localizedText("a", "Answer"),
  ],
  preview: { select: { title: "q.en" } },
};
