import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const { profile, user } = await requireAdmin();

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
          <p className="text-sm text-muted">
            {profile.full_name ?? user.email ?? "Staff"}
            <span className="mx-2 text-line">/</span>
            {profile.role}
          </p>
        </header>
        <div className="flex-1 px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
