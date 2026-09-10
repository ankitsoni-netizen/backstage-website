import { z } from "zod";

const emptyToNull = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform(emptyToNull);

const optionalUrl = z
  .union([z.url("Enter a valid URL."), z.literal("")])
  .optional()
  .nullable()
  .transform(emptyToNull);

export const siteSettingsFormSchema = z.object({
  contact_email: z
    .union([z.email("Enter a valid email."), z.literal("")])
    .optional()
    .nullable()
    .transform(emptyToNull),
  instagram_url: optionalUrl,
  linkedin_url: optionalUrl,
  meeting_url: optionalUrl,
  office_location: optionalText(200),
  site_title: z
    .string()
    .trim()
    .min(1, "Enter a site title.")
    .max(120)
    .optional()
    .nullable()
    .transform((value) => value || "Backstage"),
});

export type SiteSettingsFormValues = z.input<typeof siteSettingsFormSchema>;
export type SiteSettingsFormOutput = z.output<typeof siteSettingsFormSchema>;
