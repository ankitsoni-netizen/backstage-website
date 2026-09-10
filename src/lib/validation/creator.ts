import { z } from "zod";

export const creatorStatusSchema = z.enum(["draft", "published", "archived"]);
export const creatorIntentSchema = z.enum(["draft", "publish", "archive"]);

export const creatorSlugSchema = z
  .string()
  .trim()
  .min(1, "Enter a slug.")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case.");

const emptyToNull = (value: string | null | undefined) => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable().transform(emptyToNull);

const optionalUrlSchema = z
  .union([z.url("Enter a valid URL."), z.literal("")])
  .optional()
  .nullable()
  .transform(emptyToNull);

const optionalCountSchema = z
  .union([z.coerce.number().int().nonnegative(), z.literal("")])
  .optional()
  .nullable()
  .transform((value) => {
    if (value === "" || value == null) {
      return null;
    }

    return value;
  });

export const creatorFormSchema = z.object({
  categories_text: z.string().max(600).optional().default(""),
  city: optionalText(160),
  display_name: z.string().trim().min(1, "Enter a display name.").max(160),
  featured: z.boolean().default(false),
  full_bio: optionalText(8000),
  hero_image_path: optionalText(500),
  instagram_followers: optionalCountSchema,
  instagram_url: optionalUrlSchema,
  intent: creatorIntentSchema.default("draft"),
  linkedin_url: optionalUrlSchema,
  manager_name: optionalText(160),
  primary_category: optionalText(80),
  profile_image_path: optionalText(500),
  seo_description: optionalText(300),
  seo_title: optionalText(120),
  short_bio: optionalText(280),
  slug: creatorSlugSchema,
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  tiktok_followers: optionalCountSchema,
  tiktok_url: optionalUrlSchema,
  twitter_url: optionalUrlSchema,
  youtube_followers: optionalCountSchema,
  youtube_url: optionalUrlSchema,
});

export const creatorPublishSchema = creatorFormSchema.superRefine((value, ctx) => {
  if (value.intent !== "publish") {
    return;
  }

  if (!value.primary_category) {
    ctx.addIssue({
      code: "custom",
      message: "Add a primary category before publishing.",
      path: ["primary_category"],
    });
  }

  if (!value.profile_image_path) {
    ctx.addIssue({
      code: "custom",
      message: "Add a profile image before publishing.",
      path: ["profile_image_path"],
    });
  }

  if (!value.full_bio) {
    ctx.addIssue({
      code: "custom",
      message: "Add a full bio before publishing.",
      path: ["full_bio"],
    });
  }
});

export function parseCategoriesText(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }

  const seen = new Set<string>();
  const categories: string[] = [];

  for (const part of value.split(",")) {
    const category = part.trim();
    const key = category.toLowerCase();

    if (!category || seen.has(key)) {
      continue;
    }

    seen.add(key);
    categories.push(category.slice(0, 80));
  }

  return categories;
}

export function toCategoriesText(categories: string[] | null | undefined): string {
  return (categories ?? []).join(", ");
}

export type CreatorFormValues = z.input<typeof creatorFormSchema>;
export type CreatorFormOutput = z.output<typeof creatorFormSchema>;
export type CreatorInput = CreatorFormOutput;
export type CreatorUpdateInput = Partial<CreatorFormOutput>;
