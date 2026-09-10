import type { Metadata } from "next";

import { AdminForgotPasswordForm } from "@/components/admin/AdminForgotPasswordForm";
import { Wordmark } from "@/components/shared/Wordmark";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function AdminForgotPasswordPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Wordmark />
        <h1 className="mt-8 text-title">Forgot password</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter the admin email. We&apos;ll send a recovery link if that
          account has access.
        </p>
        <AdminForgotPasswordForm />
      </div>
    </main>
  );
}
