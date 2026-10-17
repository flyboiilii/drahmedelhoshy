/**
 * Sanity schema mirrors for the JSON content in /content. NOT wired yet.
 * These are plain TypeScript objects in the shape Sanity's defineType()
 * accepts, kept dependency-free so the static build is unaffected. When the
 * phase 1 Sanity swap happens (see README), install `sanity` and pass these
 * objects to defineType() in the studio config.
 */
import { settings } from "./settings";
import { service } from "./service";
import { caseStudy } from "./caseStudy";
import { review } from "./review";
import { faq } from "./faq";
import { award } from "./award";
import { teamMember } from "./teamMember";
import { pricing } from "./pricing";
import { concern } from "./concern";

export const schemaTypes = [settings, service, caseStudy, review, faq, award, teamMember, pricing, concern];

export type { SanityField, SanityType } from "./types";
