"use server";

import { redirect } from "next/navigation";

import { hasAdminAccess } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectPath } from "@/lib/utilities/redirect";
import { getMetadataBaseUrl } from "@/lib/utilities/site-url";
import {
  requestPasswordResetSchema,
  signInWithPasswordSchema,
  updatePasswordSchema,
} from "@/lib/validation/auth";

export type SignInWithPasswordInput = {
  email: string;
  next?: string;
  password: string;
};

export type SignInWithPasswordResult = {
  error: string;
};

export async function signInWithPassword(
  input: SignInWithPasswordInput,
): Promise<SignInWithPasswordResult> {
  const parsed = signInWithPasswordSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Invalid email or password." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unable to verify the signed-in session." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !hasAdminAccess(profile)) {
    await supabase.auth.signOut();
    return { error: "You do not have access to the admin area." };
  }

  redirect(getSafeRedirectPath(parsed.data.next ?? null));
}

export type RequestPasswordResetInput = {
  email: string;
};

export type RequestPasswordResetResult = {
  error?: string;
  success?: boolean;
};

export async function requestPasswordReset(
  input: RequestPasswordResetInput,
): Promise<RequestPasswordResetResult> {
  const parsed = requestPasswordResetSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Enter a valid email." };
  }

  const supabase = await createClient();
  const origin = getMetadataBaseUrl().origin;
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/admin/reset-password`,
  });

  if (error) {
    console.error("Password recovery email failed", error.message);
  }

  return { success: true };
}

export type UpdatePasswordInput = {
  confirmPassword: string;
  password: string;
};

export type UpdatePasswordResult = {
  error: string;
};

export async function updatePassword(
  input: UpdatePasswordInput,
): Promise<UpdatePasswordResult> {
  const parsed = updatePasswordSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Enter a new password of at least 8 characters.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "This reset link is invalid or has expired." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !hasAdminAccess(profile)) {
    await supabase.auth.signOut();
    return { error: "You do not have access to the admin area." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Could not update the password. Request a new reset link." };
  }

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
