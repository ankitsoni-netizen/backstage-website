import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EnquiriesManager } from "@/components/admin/enquiries/EnquiriesManager";
import { requireAdmin } from "@/lib/auth/session";
import { listCreators } from "@/lib/data/creators";
import { getAdminCreatorName } from "@/lib/utilities/admin-display";
import { listEnquiries } from "@/lib/data/enquiries";

export const metadata: Metadata = {
  title: "Enquiries",
};

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const [enquiries, creators] = await Promise.all([
    listEnquiries(),
    listCreators(),
  ]);

  const creatorNames = Object.fromEntries(
    creators.map((creator) => [creator.id, getAdminCreatorName(creator)]),
  );

  return (
    <main>
      <AdminPageHeader
        title="Enquiries"
        description="Brand and talent requests stay in this inbox. They are not public."
      />
      <EnquiriesManager creatorNames={creatorNames} enquiries={enquiries} />
    </main>
  );
}
