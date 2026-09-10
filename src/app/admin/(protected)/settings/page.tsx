import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Website settings",
};

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getAdminSiteSettings();

  return (
    <main>
      <AdminPageHeader
        title="Website settings"
        description="Public contact details. Meeting URLs are linked, never embedded."
      />
      <SettingsForm settings={settings} />
    </main>
  );
}
