import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { hasAdminAccess } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectPath } from "@/lib/utilities/redirect";

const recoveryTypes = new Set<EmailOtpType>([
  "recovery",
  "email",
  "magiclink",
  "invite",
  "email_change",
  "signup",
]);

function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (process.env.NODE_ENV !== "development" && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return url.origin;
}

function asEmailOtpType(value: string | null): EmailOtpType | null {
  if (!value || !recoveryTypes.has(value as EmailOtpType)) {
    return null;
  }

  return value as EmailOtpType;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type =
    asEmailOtpType(requestUrl.searchParams.get("type")) ??
    (tokenHash ? "recovery" : null);
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  const origin = getRequestOrigin(request);
  const loginUrl = new URL("/admin/login", origin);

  const supabase = await createClient();
  let exchangeError = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    exchangeError = Boolean(error);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    exchangeError = Boolean(error);
  } else {
    exchangeError = true;
  }

  if (exchangeError) {
    loginUrl.searchParams.set("error", "auth_callback_failed");
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    loginUrl.searchParams.set("error", "auth_callback_failed");
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !hasAdminAccess(profile)) {
    await supabase.auth.signOut();
    loginUrl.searchParams.set("error", "forbidden");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, origin));
}
