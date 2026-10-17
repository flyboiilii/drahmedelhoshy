import { localizedString, type SanityType } from "./types";

/** Mirrors one entry of content/awards.json */
export const award: SanityType = {
  name: "award",
  title: "Award",
  type: "document",
  fields: [localizedString("title", "Title"), localizedString("issuer", "Issuer"), { name: "year", title: "Year", type: "string" }],
  preview: { select: { title: "title.en", subtitle: "year" } },
};
