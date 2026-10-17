import { localizedString, type SanityType } from "./types";

/** Mirrors content/settings.json */
export const settings: SanityType = {
  name: "settings",
  title: "Clinic settings",
  type: "document",
  fields: [
    localizedString("name", "Clinic name"),
    localizedString("shortName", "Short name"),
    localizedString("doctor", "Doctor"),
    localizedString("doctorShort", "Doctor, short"),
    { name: "nameVariants", title: "Spelling variants (SEO)", type: "array", of: [{ type: "string" }] },
    localizedString("address", "Address"),
    {
      name: "addressParts",
      title: "Address parts (schema.org)",
      type: "object",
      fields: [
        { name: "street", title: "Street", type: "string" },
        { name: "locality", title: "Locality", type: "string" },
        { name: "region", title: "Region", type: "string" },
        { name: "postalCode", title: "Postal code", type: "string" },
        { name: "country", title: "Country code", type: "string" },
      ],
    },
    { name: "coordinates", title: "Coordinates", type: "geopoint" },
    {
      name: "phones",
      title: "Phones",
      type: "object",
      fields: [
        { name: "primary", title: "Primary, display", type: "string" },
        { name: "primaryE164", title: "Primary, E.164", type: "string" },
        { name: "others", title: "Other phones, display", type: "array", of: [{ type: "string" }] },
        { name: "othersE164", title: "Other phones, E.164", type: "array", of: [{ type: "string" }] },
      ],
    },
    { name: "whatsapp", title: "WhatsApp number (digits only)", type: "string" },
    {
      name: "hours",
      title: "Hours",
      type: "object",
      fields: [
        localizedString("days", "Days"),
        { name: "open", title: "Opens", type: "string" },
        { name: "close", title: "Closes", type: "string" },
        localizedString("closed", "Closed note"),
        { name: "schemaDays", title: "Days open (schema.org names)", type: "array", of: [{ type: "string" }] },
      ],
    },
    {
      name: "socials",
      title: "Social links",
      type: "object",
      fields: [
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "linktree", title: "Linktree", type: "url" },
      ],
    },
    { name: "googleRating", title: "Google rating", type: "number" },
    { name: "googleReviewCount", title: "Google review count", type: "number" },
    { name: "googleReviewKeywords", title: "Google review keyword chips", type: "array", of: [{ type: "string" }] },
    { name: "googleMapsUrl", title: "Google Maps place URL", type: "url" },
    { name: "googleMapsEmbedUrl", title: "Google Maps embed URL", type: "url" },
    { name: "licenceNumber", title: "Licence number", type: "string" },
    {
      name: "languages",
      title: "Languages spoken",
      type: "object",
      fields: [
        { name: "en", title: "English list", type: "array", of: [{ type: "string" }] },
        { name: "ar", title: "Arabic list", type: "array", of: [{ type: "string" }] },
      ],
    },
    localizedString("payment", "Payment note"),
    { name: "since", title: "In practice since", type: "string" },
  ],
};
