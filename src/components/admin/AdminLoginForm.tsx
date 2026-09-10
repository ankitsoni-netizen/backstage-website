"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { signInWithPassword } from "@/lib/auth/actions";

type AdminLoginFormProps = {
  initialError: string | null;
  nextPath: string;
};

type LoginState = {
  error: string | null;
};

const errorMessages: Record<string, string> = {
  auth_callback_failed: "Sign-in could not be completed. Try again.",
  forbidden: "You do not have access to the admin area.",
};

export function AdminLoginForm({
  initialError,
  nextPath,
}: AdminLoginFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_previous: LoginState, formData: FormData): Promise<LoginState> => {
      const result = await signInWithPassword({
        email: String(formData.get("email") ?? ""),
        next: nextPath,
        password: String(formData.get("password") ?? ""),
      });

      return { error: result.error };
    },
    {
      error: initialError ? (errorMessages[initialError] ?? initialError) : null,
    },
  );

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      {state.error ? (
        <p role="alert" className="text-sm text-admin-danger">
          {state.error}
        </p>
      ) : null}

      <Field id="email" label="Email">
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
        />
      </Field>

      <Field id="password" label="Password">
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
