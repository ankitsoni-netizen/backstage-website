import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { unwrapSupabaseResult } from "@/lib/utilities/errors";
import type { Profile } from "@/types/database";

export async function listStaffProfiles(): Promise<Profile[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "editor"])
    .order("full_name", { ascending: true });

  return unwrapSupabaseResult(data ?? [], error, "Failed to load staff");
}
