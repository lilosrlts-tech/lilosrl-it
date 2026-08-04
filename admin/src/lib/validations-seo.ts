import { z } from "zod";

const pageKeySchema = z.enum([
  "home",
  "flotta",
  "autolavaggio",
  "tariffe",
  "offerte",
  "chi-siamo",
  "contatti",
  "privacy",
  "cookie-policy",
  "termini-condizioni",
]);

export const seoSettingsUpdateSchema = z.object({
  page_key: pageKeySchema,
  seo_title: z.string().min(1).max(120),
  seo_description: z.string().min(1).max(320),
  seo_keywords: z.array(z.string().min(1)).default([]),
  meta_robots: z.string().min(1).optional(),
  canonical_url: z.string().url().nullable().optional(),
  og_title: z.string().nullable().optional(),
  og_description: z.string().nullable().optional(),
});

export type SeoSettingsUpdateInput = z.infer<typeof seoSettingsUpdateSchema>;
