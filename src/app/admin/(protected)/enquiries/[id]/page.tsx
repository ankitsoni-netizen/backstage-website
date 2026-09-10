import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EnquiryEditor } from "@/components/admin/enquiries/EnquiryEditor";
import { requireAdmin } from "@/lib/auth/session";
import { getCreatorById } from "@/lib/data/creators";
import { getAdminCreatorName } from "@/lib/utilities/admin-display";
import { getEnquiryById } from "@/lib/data/enquiries";
import { listStaffProfiles } from "@/lib/data/profiles";

export const metadata: Metadata = {
  title: "Enquiry",
};

export default async function AdminEnquiryDetailPage({
  params,
}: PageProps<"/admin/enquiries/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const [enquiry, staff] = await Promise.all([
    getEnquiryById(id),
    listStaffProfiles(),
  ]);

  if (!enquiry) {
    notFound();
  }

  const linkedCreator = enquiry.creator_id
    ? await getCreatorById(enquiry.creator_id)
    : null;

  return (
    <main>
      <AdminPageHeader
        title={enquiry.name}
        description="Internal enquiry record. Not visible on the public site."
        action={{ href: "/admin/enquiries", label: "Back to inbox" }}
      />
      <EnquiryEditor
        enquiry={enquiry}
        staff={staff}
        creatorLabel={
          linkedCreator
            ? getAdminCreatorName(linkedCreator)
            : enquiry.creator_name
        }
        creatorHref={
          linkedCreator ? `/admin/creators/${linkedCreator.id}` : null
        }
      />
    </main>
  );
}
