import type { Metadata } from "next";

import { AdminResetPasswordForm } from "@/components/admin/AdminResetPasswordForm";
import { Wordmark } from "@/components/shared/Wordmark";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function AdminResetPasswordPage() {
  await requireAdmin();

  return (
    <main className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Wordmark />
        <h1 className="mt-8 text-title">Choose a new password</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Use at least 8 characters. You&apos;ll be signed in to admin after
          saving.
        </p>
        <AdminResetPasswordForm />
      </div>
    </main>
  );
}
