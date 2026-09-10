"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { requestPasswordReset } from "@/lib/auth/actions";

type ForgotState = {
  error: string | null;
  success: boolean;
};

export function AdminForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (
      _previous: ForgotState,
      formData: FormData,
    ): Promise<ForgotState> => {
      const result = await requestPasswordReset({
        email: String(formData.get("email") ?? ""),
      });

      if (result.error) {
        return { error: result.error, success: false };
      }

      return { error: null, success: true };
    },
    { error: null, success: false },
  );

  if (state.success) {
    return (
      <div className="mt-8 flex flex-col gap-5">
        <p role="status" className="text-sm leading-relaxed text-muted">
          If that email is registered for admin access, we sent a recovery
          link. Check the inbox and spam folder, then choose a new password.
        </p>
        <Link
          href="/admin/login"
          className="text-sm underline decoration-current/30 underline-offset-[0.3em]"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      {state.error ? (
        <p role="alert" className="text-sm text-admin-danger">
          {state.error}
        </p>
      ) : null}

      <Field
        id="email"
        label="Email"
        hint="Use the admin email already added in Backstage."
      >
        <input name="email" type="email" autoComplete="username" required />
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send recovery link"}
      </Button>

      <p className="text-sm text-muted">
        <Link
          href="/admin/login"
          className="underline decoration-current/30 underline-offset-[0.3em] hover:text-admin-ink"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}
