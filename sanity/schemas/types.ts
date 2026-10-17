/** Minimal local typing of the subset of Sanity's schema shape used here. */
export type SanityField = {
  name: string;
  title: string;
  type: string;
  of?: { type: string; fields?: SanityField[]; to?: { type: string }[] }[];
  to?: { type: string }[];
  fields?: SanityField[];
  options?: Record<string, unknown>;
  validation?: string;
  description?: string;
  initialValue?: unknown;
};

export type SanityType = {
  name: string;
  title: string;
  type: "document" | "object";
  fields: SanityField[];
  preview?: { select: Record<string, string> };
};

/** { en, ar } string pair, the same shape as every Localized field in /content. */
export const localizedString = (name: string, title: string, validation = "required"): SanityField => ({
  name,
  title,
  type: "object",
  validation,
  fields: [
    { name: "en", title: "English", type: "string", validation: "required" },
    { name: "ar", title: "Arabic", type: "string", validation: "required" },
  ],
});

export const localizedText = (name: string, title: string): SanityField => ({
  name,
  title,
  type: "object",
  fields: [
    { name: "en", title: "English", type: "text" },
    { name: "ar", title: "Arabic", type: "text" },
  ],
});

export const localizedStringArray = (name: string, title: string): SanityField => ({
  name,
  title,
  type: "array",
  of: [
    {
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "ar", title: "Arabic", type: "string" },
      ],
    },
  ],
});
