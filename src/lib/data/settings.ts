import { requireAdmin } from "@/lib/auth/session";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import {
  requireSupabaseRow,
  unwrapSupabaseResult,
} from "@/lib/utilities/errors";
import {
  SITE_SETTINGS_KEY,
  mapSiteSettingsRow,
  toSiteSettingsValue,
} from "@/lib/utilities/site-settings";
import type { SiteSettings, SiteSettingsRow } from "@/types/database";
import type { SiteSettingsFormOutput } from "@/lib/validation/settings";

function mapRow(row: SiteSettingsRow | null): SiteSettings | null {
  return row ? mapSiteSettingsRow(row) : null;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("setting_key", SITE_SETTINGS_KEY)
    .eq("is_public", true)
    .maybeSingle();

  return mapRow(
    unwrapSupabaseResult(data, error, "Failed to load site settings"),
  );
}

export async function getPublicSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await getSiteSettings();
  } catch {
    return null;
  }
}

export async function getAdminSiteSettings(): Promise<SiteSettings | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("setting_key", SITE_SETTINGS_KEY)
    .maybeSingle();

  return mapRow(
    unwrapSupabaseResult(data, error, "Failed to load site settings"),
  );
}

export async function updateSiteSettings(
  settingKey: string,
  input: SiteSettingsFormOutput,
): Promise<SiteSettings> {
  await requireAdmin();
  const supabase = await createClient();
  const current = await supabase
    .from("site_settings")
    .select("*")
    .eq("setting_key", settingKey)
    .maybeSingle();

  const currentRow = unwrapSupabaseResult(
    current.data,
    current.error,
    "Failed to load site settings",
  );

  if (!currentRow) {
    return createSiteSettings(input);
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update({
      setting_value: toSiteSettingsValue(input, currentRow.setting_value),
    })
    .eq("setting_key", settingKey)
    .select("*")
    .single();

  return mapSiteSettingsRow(
    requireSupabaseRow(data, error, "Failed to update site settings"),
  );
}

export async function createSiteSettings(
  input: SiteSettingsFormOutput,
): Promise<SiteSettings> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .insert({
      is_public: true,
      setting_key: SITE_SETTINGS_KEY,
      setting_value: toSiteSettingsValue(input, null),
    })
    .select("*")
    .single();

  return mapSiteSettingsRow(
    requireSupabaseRow(data, error, "Failed to create site settings"),
  );
}
