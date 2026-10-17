import { z } from "zod";
import settingsJson from "@/content/settings.json";
import servicesJson from "@/content/services.json";
import casesJson from "@/content/cases.json";
import reviewsJson from "@/content/reviews.json";
import faqsJson from "@/content/faqs.json";
import awardsJson from "@/content/awards.json";
import teamJson from "@/content/team.json";
import pricingJson from "@/content/pricing.json";
import concernsJson from "@/content/concerns.json";
import modelsJson from "@/content/models.json";
import { SERVICE_SLUGS } from "./routes";

// ---------------------------------------------------------------------------
// Schemas. Every content file is parsed once at build time; a shape error
// fails `next build` with a readable message instead of a broken page.
// ---------------------------------------------------------------------------

const Localized = z.object({ en: z.string(), ar: z.string() });
const LocalizedList = z.object({ en: z.array(z.string()), ar: z.array(z.string()) });
const ServiceSlug = z.enum(SERVICE_SLUGS);
export const ModelKind = z.enum(["veneer", "implant", "aligner", "fullmouth", "none"]);
export type ModelKind = z.infer<typeof ModelKind>;

export const SettingsSchema = z.object({
  name: Localized,
  shortName: Localized,
  doctor: Localized,
  doctorShort: Localized,
  nameVariants: z.array(z.string()),
  address: Localized,
  addressParts: z.object({
    street: z.string(),
    locality: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  phones: z.object({
    primary: z.string(),
    primaryE164: z.string().regex(/^\+\d{8,15}$/),
    others: z.array(z.string()),
    othersE164: z.array(z.string().regex(/^\+\d{8,15}$/)),
  }),
  whatsapp: z.string().regex(/^\d{8,15}$/),
  hours: z.object({
    days: Localized,
    open: z.string(),
    close: z.string(),
    closed: Localized,
    schemaDays: z.array(z.string()),
    confirm: z.string(),
  }),
  socials: z.object({ instagram: z.string().url(), facebook: z.string().url(), linktree: z.string().url() }),
  googleRating: z.number().min(0).max(5),
  googleReviewCount: z.number().int().positive(),
  googleReviewKeywords: z.array(z.string()),
  googleMapsUrl: z.string(),
  googleMapsEmbedUrl: z.string().url(),
  licenceNumber: z.string(),
  languages: z.object({ en: z.array(z.string()), ar: z.array(z.string()) }),
  payment: Localized,
  since: z.string(),
});

export const ServiceSchema = z.object({
  slug: ServiceSlug,
  order: z.number().int(),
  title: Localized,
  shortTitle: Localized,
  seoTitle: Localized,
  description: Localized,
  fearIntro: Localized,
  oneLine: Localized,
  durationLabel: Localized,
  visits: Localized,
  days: Localized,
  steps: z.array(z.object({ title: Localized, text: Localized, when: Localized })).min(3),
  whoFor: z.array(Localized).min(1),
  whoNotFor: z.array(Localized).min(1),
  materials: z.array(z.object({ label: Localized, value: z.string() })),
  costParagraph: Localized,
  model: ModelKind,
  faqIds: z.array(z.string()),
});

export const CaseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  caseNumber: z.string(),
  treatmentSlug: ServiceSlug,
  ageBand: Localized,
  ageLabel: Localized,
  gender: z.string(),
  teethCount: z.number().int().positive(),
  material: z.string(),
  visits: z.number().int().positive(),
  monthsPostOp: z.number().int().nonnegative(),
  before: z.string().startsWith("/"),
  after: z.string().startsWith("/"),
  story: LocalizedList,
  consent: z.literal(true),
  featured: z.boolean(),
  placeholder: z.boolean(),
});

export const ReviewSchema = z.object({
  id: z.string(),
  author: z.string(),
  initials: z.string().min(1).max(3),
  descriptor: Localized,
  text: Localized,
  treatmentSlug: ServiceSlug,
  source: z.enum(["google", "instagram", "facebook", "video"]),
  real: z.boolean(),
  paraphrased: z.boolean(),
});

export const FaqSchema = z.object({ id: z.string(), serviceSlug: ServiceSlug, q: Localized, a: Localized });
export const AwardSchema = z.object({ id: z.string(), title: Localized, issuer: Localized, year: z.string() });
export const TeamSchema = z.object({ id: z.string(), name: Localized, role: Localized, image: z.string(), placeholder: z.boolean() });

export const PricingSchema = z.object({
  consultation: z.object({ title: Localized, text: Localized, durationConfirm: z.string() }),
  entries: z.array(z.object({ id: z.string(), label: Localized, price: Localized, note: Localized })),
  veneersFrom: z.object({ label: z.string(), price: z.string(), note: z.string() }),
  includes: z.array(Localized),
  payment: z.object({ cards: Localized, instalments: Localized }),
});

export const ConcernSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: Localized,
  seoTitle: Localized,
  description: Localized,
  paragraphs: LocalizedList,
  serviceSlug: ServiceSlug,
  caseSlugs: z.array(z.string()).length(2),
});

export const ModelsSchema = z.object({
  veneer: z.boolean(),
  implant: z.boolean(),
  aligner: z.boolean(),
  fullmouth: z.boolean(),
  arch: z.boolean(),
});

// ---------------------------------------------------------------------------
// Parsed, typed exports
// ---------------------------------------------------------------------------

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content in content/${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const settings = parse(SettingsSchema, settingsJson, "settings.json");
export const services = parse(z.array(ServiceSchema), servicesJson, "services.json").sort((a, b) => a.order - b.order);
export const cases = parse(z.array(CaseSchema), casesJson, "cases.json");
export const reviews = parse(z.array(ReviewSchema), reviewsJson, "reviews.json");
export const faqs = parse(z.array(FaqSchema), faqsJson, "faqs.json");
export const awards = parse(z.array(AwardSchema), awardsJson, "awards.json");
export const team = parse(z.array(TeamSchema), teamJson, "team.json");
export const pricing = parse(PricingSchema, pricingJson, "pricing.json");
export const concerns = parse(z.array(ConcernSchema), concernsJson, "concerns.json");
export const models = parse(ModelsSchema, modelsJson, "models.json");

export type Settings = z.infer<typeof SettingsSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Case = z.infer<typeof CaseSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type Award = z.infer<typeof AwardSchema>;
export type TeamMember = z.infer<typeof TeamSchema>;
export type Pricing = z.infer<typeof PricingSchema>;
export type Concern = z.infer<typeof ConcernSchema>;
export type Models = z.infer<typeof ModelsSchema>;

// Cross-file integrity: every referenced id must exist.
for (const s of services) {
  for (const id of s.faqIds) {
    if (!faqs.some((f) => f.id === id)) throw new Error(`services.json: ${s.slug} references missing FAQ ${id}`);
  }
}
for (const c of concerns) {
  for (const slug of c.caseSlugs) {
    if (!cases.some((k) => k.slug === slug)) throw new Error(`concerns.json: ${c.slug} references missing case ${slug}`);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getService(slug: string): Service {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Unknown service ${slug}`);
  return s;
}

export function getCase(slug: string): Case | undefined {
  return cases.find((x) => x.slug === slug);
}

export function getConcern(slug: string): Concern | undefined {
  return concerns.find((x) => x.slug === slug);
}

export function casesFor(serviceSlug: string): Case[] {
  return cases.filter((c) => c.treatmentSlug === serviceSlug);
}

export function faqsFor(ids: string[]): Faq[] {
  return ids.map((id) => faqs.find((f) => f.id === id)).filter((f): f is Faq => Boolean(f));
}

export function faqsByService(serviceSlug: string): Faq[] {
  return faqs.filter((f) => f.serviceSlug === serviceSlug);
}

/** Google Maps search link built from verified coordinates (used until the place URL is supplied). */
export function googleMapsLink(): string {
  if (settings.googleMapsUrl && !settings.googleMapsUrl.startsWith("[")) return settings.googleMapsUrl;
  const { lat, lng } = settings.coordinates;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export const isPlaceholder = (value: string) => /\[[^\]]+\]/.test(value);
