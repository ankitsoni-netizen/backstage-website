import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Notice } from "@/components/admin/Notice";
import { CreatorForm } from "@/components/admin/creators/CreatorForm";
import { DeleteCreatorDialog } from "@/components/admin/creators/DeleteCreatorDialog";
import { requireAdmin } from "@/lib/auth/session";
import { getCreatorById } from "@/lib/data/creators";
import { getAdminCreatorName } from "@/lib/utilities/admin-display";
import { firstSearchParam } from "@/lib/utilities/search-params";

export const metadata: Metadata = {
  title: "Edit creator",
};

export default async function AdminEditCreatorPage({
  params,
  searchParams,
}: PageProps<"/admin/creators/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const creator = await getCreatorById(id);

  if (!creator) {
    notFound();
  }

  const notice = firstSearchParam((await searchParams).notice);

  return (
    <main>
      <AdminPageHeader
        title={getAdminCreatorName(creator)}
        description={`Status: ${creator.status}${creator.featured ? " · featured" : ""}`}
        action={
          creator.status === "published"
            ? { href: `/talent/${creator.slug}`, label: "View public" }
            : undefined
        }
      />
      {notice === "created" ? (
        <div className="mb-4">
          <Notice>Creator created. You can add media and publish when ready.</Notice>
        </div>
      ) : null}
      <CreatorForm creator={creator} />
      <div className="mt-10 max-w-4xl">
        <DeleteCreatorDialog
          creatorId={creator.id}
          creatorName={getAdminCreatorName(creator)}
        />
      </div>
    </main>
  );
}
