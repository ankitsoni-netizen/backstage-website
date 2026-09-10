import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "@/lib/utilities/env";
import type { Database } from "@/types/database";

export function createClient() {
  const { url, publicKey } = getSupabasePublicEnv();

  return createBrowserClient<Database>(url, publicKey);
}
