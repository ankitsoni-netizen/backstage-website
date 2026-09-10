"use server";

import { redirect } from "next/navigation";

import { hasAdminAccess } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectPath } from "@/lib/utilities/redirect";
import { signInWithPasswordSchema } from "@/lib/validation/auth";

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

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
