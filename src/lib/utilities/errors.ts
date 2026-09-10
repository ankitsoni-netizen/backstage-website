import type { PostgrestError } from "@supabase/supabase-js";

function formatSupabaseError(error: PostgrestError): string {
  const message = error.message.trim();

  if (message.startsWith("<!") || message.includes("<html")) {
    return "Supabase returned a non-API response. Check NEXT_PUBLIC_SUPABASE_URL.";
  }

  return error.message;
}

export function unwrapSupabaseResult<T>(
  data: T,
  error: PostgrestError | null,
  context: string,
): T {
  if (error) {
    throw new Error(`${context}: ${formatSupabaseError(error)}`);
  }

  return data;
}

export function requireSupabaseRow<T>(
  data: T | null,
  error: PostgrestError | null,
  context: string,
): T {
  const value = unwrapSupabaseResult(data, error, context);

  if (value === null) {
    throw new Error(`${context}: no data returned`);
  }

  return value;
}
