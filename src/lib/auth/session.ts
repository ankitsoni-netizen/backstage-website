import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { hasAdminAccess } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export type CurrentUser = {
  profile: Profile | null;
  user: User;
};

export type AdminUser = {
  profile: Profile;
  user: User;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { profile: null, user };
  }

  return { profile, user };
}

export async function requireAdmin(): Promise<AdminUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/admin/login");
  }

  if (!hasAdminAccess(currentUser.profile)) {
    redirect("/admin/login?error=forbidden");
  }

  return {
    profile: currentUser.profile,
    user: currentUser.user,
  };
}
