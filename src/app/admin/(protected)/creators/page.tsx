import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Notice } from "@/components/admin/Notice";
import { CreatorsManager } from "@/components/admin/creators/CreatorsManager";
import { requireAdmin } from "@/lib/auth/session";
import { listCreators } from "@/lib/data/creators";
import { firstSearchParam } from "@/lib/utilities/search-params";

export const metadata: Metadata = {
  title: "Creators",
};

export default async function AdminCreatorsPage({
  searchParams,
}: PageProps<"/admin/creators">) {
  await requireAdmin();
  const creators = await listCreators();
  const notice = firstSearchParam((await searchParams).notice);

  return (
    <main>
      <AdminPageHeader
        title="Creators"
        description="Draft, publish and feature the roster."
        action={{ href: "/admin/creators/new", label: "Add creator" }}
      />
      {notice === "deleted" ? <Notice>Creator deleted.</Notice> : null}
      {notice === "created" ? (
        <div className="mb-4">
          <Notice>Creator created.</Notice>
        </div>
      ) : null}
      <CreatorsManager creators={creators} />
    </main>
  );
}
