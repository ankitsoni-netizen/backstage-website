"use server";

import { revalidatePublicSite } from "@/lib/admin/revalidate";
import { requireAdmin } from "@/lib/auth/session";
import {
  createSiteSettings,
  getAdminSiteSettings,
  updateSiteSettings,
} from "@/lib/data/settings";
import { siteSettingsFormSchema } from "@/lib/validation/settings";

export type SettingsActionState = {
  error: string | null;
  success: boolean;
};

export async function saveSiteSettingsAction(
  input: unknown,
): Promise<SettingsActionState> {
  await requireAdmin();

  const parsed = siteSettingsFormSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Check the settings fields and try again.", success: false };
  }

  try {
    const current = await getAdminSiteSettings();

    if (current) {
      await updateSiteSettings(current.setting_key, parsed.data);
    } else {
      await createSiteSettings(parsed.data);
    }

    revalidatePublicSite();
    return { error: null, success: true };
  } catch {
    return { error: "Settings could not be saved.", success: false };
  }
}
