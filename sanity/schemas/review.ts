import { localizedString, localizedText, type SanityType } from "./types";

/** Mirrors one entry of content/reviews.json */
export const review: SanityType = {
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    { name: "author", title: "Author (first name and initial)", type: "string" },
    { name: "initials", title: "Initials", type: "string" },
    localizedString("descriptor", "Descriptor"),
    localizedText("text", "Text"),
    { name: "treatment", title: "Treatment", type: "reference", to: [{ type: "service" }] },
    { name: "source", title: "Source", type: "string", options: { list: ["google", "instagram", "facebook", "video"] } },
    { name: "real", title: "Verified real review", type: "boolean", initialValue: false },
    { name: "paraphrased", title: "Paraphrased", type: "boolean", initialValue: false },
  ],
  preview: { select: { title: "author", subtitle: "text.en" } },
};
