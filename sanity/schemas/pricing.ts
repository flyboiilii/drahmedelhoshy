import { localizedString, localizedStringArray, localizedText, type SanityType } from "./types";

/** Mirrors content/pricing.json */
export const pricing: SanityType = {
  name: "pricing",
  title: "Pricing and financing",
  type: "document",
  fields: [
    {
      name: "consultation",
      title: "Free consultation block",
      type: "object",
      fields: [localizedString("title", "Title"), localizedText("text", "Text")],
    },
    {
      name: "entries",
      title: "Entry prices",
      type: "array",
      of: [{ type: "object", fields: [{ name: "id", title: "Id", type: "string" }, localizedString("label", "Label"), localizedString("price", "Price"), localizedString("note", "Note")] }],
    },
    {
      name: "veneersFrom",
      title: "Veneers from (English page only)",
      type: "object",
      fields: [
        { name: "label", title: "Label", type: "string" },
        { name: "price", title: "Price", type: "string" },
        { name: "note", title: "Note", type: "string" },
      ],
    },
    localizedStringArray("includes", "What a plan includes"),
    {
      name: "payment",
      title: "Payment",
      type: "object",
      fields: [localizedString("cards", "Cards"), localizedString("instalments", "Instalments")],
    },
  ],
};
