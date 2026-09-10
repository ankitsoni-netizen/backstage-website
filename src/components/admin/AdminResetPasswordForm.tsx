"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { updatePassword } from "@/lib/auth/actions";

type ResetState = {
  error: string | null;
};

export function AdminResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    async (_previous: ResetState, formData: FormData): Promise<ResetState> => {
      const result = await updatePassword({
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      return { error: result.error };
    },
    { error: null },
  );

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      {state.error ? (
        <p role="alert" className="text-sm text-admin-danger">
          {state.error}
        </p>
      ) : null}

      <Field id="password" label="New password">
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>

      <Field id="confirmPassword" label="Confirm password">
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save new password"}
      </Button>
    </form>
  );
}
