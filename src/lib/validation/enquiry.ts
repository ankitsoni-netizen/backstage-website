import { z } from "zod";

export const enquiryStatuses = [
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
] as const;

export const enquiryStatusSchema = z.enum(enquiryStatuses);

export const enquiryTypes = [
  "book_talent",
  "brand_partnership",
  "join_roster",
  "press",
  "general",
] as const;
export const budgetRanges = [
  "under_5l",
  "5l_15l",
  "15l_50l",
  "50l_plus",
  "tbd",
] as const;
export const campaignTimelines = [
  "asap",
  "1_2_months",
  "3_6_months",
  "flexible",
] as const;

export const enquiryTypeLabels: Record<(typeof enquiryTypes)[number], string> = {
  book_talent: "Book talent",
  brand_partnership: "Brand partnership",
  join_roster: "Join the roster",
  press: "Press",
  general: "General",
};

export const enquiryStatusLabels: Record<(typeof enquiryStatuses)[number], string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
  spam: "Spam",
};

export const budgetRangeLabels: Record<(typeof budgetRanges)[number], string> = {
  under_5l: "Under ₹5L",
  "5l_15l": "₹5L – ₹15L",
  "15l_50l": "₹15L – ₹50L",
  "50l_plus": "₹50L+",
  tbd: "To be discussed",
};

export const campaignTimelineLabels: Record<
  (typeof campaignTimelines)[number],
  string
> = {
  asap: "As soon as possible",
  "1_2_months": "1–2 months",
  "3_6_months": "3–6 months",
  flexible: "Flexible",
};

const emptyToNull = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform(emptyToNull);

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values), z.literal("")])
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

export const publicEnquiryFieldsSchema = z.object({
  budget_range: optionalEnum(budgetRanges),
  campaign_brief: z
    .string()
    .trim()
    .min(1, "Tell us about the work.")
    .max(8000, "Keep the brief under 8,000 characters."),
  campaign_timeline: optionalEnum(campaignTimelines),
  company: optionalText(160),
  creator_id: z
    .union([z.uuid(), z.literal("")])
    .optional()
    .nullable()
    .transform(emptyToNull),
  creator_name: optionalText(160),
  enquiry_type: z.enum(enquiryTypes, {
    error: "Choose what this enquiry is about.",
  }),
  name: z.string().trim().min(1, "Enter your name.").max(160),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .nullable()
    .transform(emptyToNull)
    .refine(
      (value) => value === null || /^[+]?[\d\s()-]{8,}$/.test(value),
      "Enter a valid phone number.",
    ),
  preferred_meeting_date: z
    .union([
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
      z.literal(""),
    ])
    .optional()
    .nullable()
    .transform(emptyToNull),
  work_email: z.email("Enter a valid work email."),
});

export const publicEnquiryFormSchema = publicEnquiryFieldsSchema.extend({
  website: z.string().max(200).optional().default(""),
});

export const publicEnquirySubmissionSchema = publicEnquiryFieldsSchema.extend({
  started_at: z.number().int(),
  website: z.string().max(200).optional().default(""),
});

export const enquiryInputSchema = publicEnquiryFieldsSchema;

export const enquiryUpdateSchema = z.object({
  assigned_to: z
    .union([z.uuid(), z.literal("")])
    .optional()
    .nullable()
    .transform(emptyToNull),
  internal_notes: optionalText(8000),
  status: enquiryStatusSchema,
});

export type EnquiryType = (typeof enquiryTypes)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type CampaignTimeline = (typeof campaignTimelines)[number];
export type PublicEnquiryFields = z.output<typeof publicEnquiryFieldsSchema>;
export type PublicEnquiryFormValues = z.input<typeof publicEnquiryFormSchema>;
export type PublicEnquirySubmission = z.input<typeof publicEnquirySubmissionSchema>;
export type EnquiryInput = z.infer<typeof enquiryInputSchema>;
export type EnquiryUpdateInput = z.infer<typeof enquiryUpdateSchema>;
