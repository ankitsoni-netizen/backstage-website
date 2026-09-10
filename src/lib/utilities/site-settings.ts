import type { Json, SiteSettings, SiteSettingsRow } from "@/types/database";
import type { SiteSettingsFormOutput } from "@/lib/validation/settings";

export const SITE_SETTINGS_KEY = "general";

function asRecord(value: Json | null | undefined): Record<string, Json | undefined> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, Json | undefined>;
  }

  return {};
}

function readText(
  record: Record<string, Json | undefined>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export function mapSiteSettingsRow(
  row: Pick<SiteSettingsRow, "setting_key" | "setting_value">,
): SiteSettings {
  const value = asRecord(row.setting_value);

  return {
    contact_email: readText(value, "contactEmail", "contact_email"),
    contact_phone: readText(value, "contactPhone", "contact_phone"),
    instagram_url: readText(value, "instagramUrl", "instagram_url"),
    linkedin_url: readText(value, "linkedinUrl", "linkedin_url"),
    meeting_url: readText(value, "meetingUrl", "meeting_url"),
    office_location: readText(value, "officeLocation", "office_location"),
    setting_key: row.setting_key,
    site_description: readText(value, "siteDescription", "site_description"),
    site_title: readText(value, "companyName", "site_title") || "Backstage",
    twitter_url: readText(value, "twitterUrl", "twitter_url"),
    youtube_url: readText(value, "youtubeUrl", "youtube_url"),
  };
}

export function toSiteSettingsValue(
  input: SiteSettingsFormOutput,
  current: Json | null | undefined,
): Record<string, string> {
  const existing = asRecord(current);
  const next: Record<string, string> = {};

  for (const [key, value] of Object.entries(existing)) {
    if (typeof value === "string") {
      next[key] = value;
    }
  }

  next.companyName = input.site_title ?? next.companyName ?? "Backstage";
  next.contactEmail = input.contact_email ?? "";
  next.instagramUrl = input.instagram_url ?? "";
  next.linkedinUrl = input.linkedin_url ?? "";
  next.meetingUrl = input.meeting_url ?? "";
  next.officeLocation = input.office_location ?? "";

  return next;
}
