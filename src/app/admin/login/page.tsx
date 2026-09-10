import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Wordmark } from "@/components/shared/Wordmark";

export const metadata: Metadata = {
  title: "Login",
};

function firstSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const params = await searchParams;

  return (
    <main className="flex min-h-full flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Wordmark />
        <h1 className="mt-8 text-title">Admin login</h1>
        <AdminLoginForm
          initialError={firstSearchParam(params.error)}
          nextPath={firstSearchParam(params.next) ?? "/admin"}
        />
      </div>
    </main>
  );
}
