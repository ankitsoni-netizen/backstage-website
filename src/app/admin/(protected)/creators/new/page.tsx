import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CreatorForm } from "@/components/admin/creators/CreatorForm";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "New creator",
};

export default async function AdminNewCreatorPage() {
  await requireAdmin();

  return (
    <main>
      <AdminPageHeader
        title="New creator"
        description="Save a draft first if the profile is still being assembled."
      />
      <CreatorForm />
    </main>
  );
}
