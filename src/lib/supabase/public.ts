import { createClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/utilities/env";
import type { Database } from "@/types/database";

export function createPublicClient() {
  const { url, publicKey } = getSupabasePublicEnv();

  return createClient<Database>(url, publicKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
